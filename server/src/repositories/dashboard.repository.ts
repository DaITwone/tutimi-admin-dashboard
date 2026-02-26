import { createClient } from "@supabase/supabase-js";
import {
  AIInventoryTransaction,
  AIProduct,
  AppError,
} from "../types/api";

type BuildInventoryParams = {
  lowStockLimit?: number;
  highStockLimit?: number;
  recentTransactionLimit?: number;
  from?: string | null;
  to?: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  image: string | null;
  stock_quantity: number;
  is_active: boolean | null;
  is_best_seller: boolean;
  stats: string | null;
  category: { id: string; title: string } | null;
};

type ProductRowRaw = Omit<ProductRow, "category"> & {
  category: { id: string; title: string } | { id: string; title: string }[] | null;
};

type StockRow = {
  id: string;
  name: string;
  stock_quantity: number;
};

type TxRow = {
  product_id: string;
  type: "IN" | "OUT";
  requested_quantity: number;
  applied_quantity: number;
  delta: number;
  created_at: string;
  receipt_id: string | null;
  products: { name: string } | null;
};

type TxRowRaw = Omit<TxRow, "products"> & {
  products: { name: string } | { name: string }[] | null;
};

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!url || !key) {
    throw new AppError(500, "MISSING_CONFIG", "Supabase env is missing");
  }

  return createClient(url, key);
}

function getPublicImageUrl(bucket: string, path: string | null) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

function summarizeProducts(products: AIProduct[]) {
  const activeProducts = products.filter((p) => p.is_active);
  const inactiveProducts = products.filter((p) => !p.is_active);

  return {
    total: products.length,
    active: activeProducts.length,
    inactive: inactiveProducts.length,
    inactive_products: inactiveProducts,
  };
}

function getTopSellingProducts(products: AIProduct[], limit = 10) {
  return products.filter((p) => p.is_best_seller).slice(0, limit);
}

function groupProductsByCategory(products: AIProduct[]) {
  const map = new Map<
    string,
    { id: string; title: string; total: number; active: number; items: AIProduct[] }
  >();

  for (const p of products) {
    if (!p.category) continue;
    const key = p.category.id;

    if (!map.has(key)) {
      map.set(key, {
        id: p.category.id,
        title: p.category.title,
        total: 0,
        active: 0,
        items: [],
      });
    }

    const group = map.get(key)!;
    group.total += 1;
    if (p.is_active) group.active += 1;
    group.items.push(p);
  }

  return Array.from(map.values());
}

function clampRangeToRecentDays(
  from: string | null | undefined,
  to: string | null | undefined,
  maxDays: number
) {
  const now = new Date();
  const maxFrom = new Date(now);
  maxFrom.setDate(maxFrom.getDate() - maxDays);

  let fromDate = from ? new Date(from) : maxFrom;
  let toDate = to ? new Date(to) : now;

  if (fromDate < maxFrom) fromDate = maxFrom;
  if (toDate > now) toDate = now;

  if (fromDate > toDate) {
    fromDate = maxFrom;
    toDate = now;
  }

  return { from: fromDate.toISOString(), to: toDate.toISOString() };
}

async function buildProductsAIContext(): Promise<AIProduct[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("products").select(`
    id,
    name,
    price,
    sale_price,
    image,
    stock_quantity,
    is_active,
    is_best_seller,
    stats,
    category:categories (
      id,
      title
    )
  `);

  if (error) throw error;

  return ((data ?? []) as ProductRowRaw[]).map((p) => {
    const categoryRel = Array.isArray(p.category) ? (p.category[0] ?? null) : p.category;
    const category = categoryRel ? { id: categoryRel.id, title: categoryRel.title } : null;

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      sale_price: p.sale_price,
      image: getPublicImageUrl("products", p.image),
      stock_quantity: p.stock_quantity,
      is_active: p.is_active ?? true,
      is_best_seller: p.is_best_seller,
      stats: p.stats,
      category,
    };
  });
}

export async function getProductsSectionForAI() {
  const products = await buildProductsAIContext();
  const summary = summarizeProducts(products);

  return {
    total: summary.total,
    active: summary.active,
    inactive: summary.inactive,
    inactive_products: summary.inactive_products,
    top_selling: getTopSellingProducts(products, 10),
    by_category: groupProductsByCategory(products),
  };
}

export async function getInventorySectionForAI(params: BuildInventoryParams = {}) {
  const supabase = getSupabaseClient();
  const {
    lowStockLimit = 5,
    highStockLimit = 5,
    recentTransactionLimit = 20,
    from,
    to,
  } = params;

  const { data: lowStock, error: lowStockError } = await supabase
    .from("products")
    .select("id, name, stock_quantity")
    .order("stock_quantity", { ascending: true })
    .limit(lowStockLimit);

  if (lowStockError) throw lowStockError;

  const { data: highStock, error: highStockError } = await supabase
    .from("products")
    .select("id, name, stock_quantity")
    .order("stock_quantity", { ascending: false })
    .limit(highStockLimit);

  if (highStockError) throw highStockError;

  const clamped = clampRangeToRecentDays(from, to, 7);

  let query = supabase
    .from("inventory_transactions")
    .select("product_id, type, requested_quantity, applied_quantity, delta, created_at, receipt_id, products(name)")
    .order("created_at", { ascending: false })
    .limit(recentTransactionLimit)
    .gte("created_at", clamped.from)
    .lt("created_at", clamped.to);

  if (from) query = query.gte("created_at", from);
  if (to) query = query.lt("created_at", to);

  const { data: txRows, error: txError } = await query;
  if (txError) throw txError;

  const recent_transactions: AIInventoryTransaction[] = ((txRows ?? []) as TxRowRaw[]).map((tx) => {
    const productRel = Array.isArray(tx.products) ? (tx.products[0] ?? null) : tx.products;
    return {
      product_id: tx.product_id,
      product_name: productRel?.name ?? "Unknown",
      type: tx.type,
      requested_quantity: tx.requested_quantity,
      applied_quantity: tx.applied_quantity,
      delta: tx.delta,
      created_at: tx.created_at,
      receipt_id: tx.receipt_id ?? null,
    };
  });

  return {
    low_stock_products: ((lowStock ?? []) as StockRow[]).map((p) => ({
      product_id: p.id,
      name: p.name,
      stock_quantity: p.stock_quantity,
    })),
    high_stock_products: ((highStock ?? []) as StockRow[]).map((p) => ({
      product_id: p.id,
      name: p.name,
      stock_quantity: p.stock_quantity,
    })),
    recent_transactions,
  };
}
