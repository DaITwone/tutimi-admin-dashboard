import { AIInventoryTransaction } from "@/app/api/dashboard-ai/types";
import { supabase } from "@/app/lib/supabase";

type InventoryContext = {
    low_stock_products: {
        product_id: string;
        name: string;
        stock_quantity: number;
    }[];
    high_stock_products: {
        product_id: string;
        name: string;
        stock_quantity: number;
    }[];
    recent_transactions: AIInventoryTransaction[];
};

type BuildInventoryParams = {
    lowStockLimit?: number;
    highStockLimit?: number;
    recentTransactionLimit?: number;
    from?: string | null;
    to?: string | null;
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

    return {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
    };
}


export async function buildInventorySectionForAI(params: BuildInventoryParams = {}): Promise<InventoryContext> {
    const {
        lowStockLimit = 5,
        highStockLimit = 5,
        recentTransactionLimit = 20,
        from,
        to,
    } = params;

    // low stock
    const { data: lowStock, error: lowStockError } = await supabase
        .from("products")
        .select("id, name, stock_quantity")
        .order("stock_quantity", { ascending: true })
        .limit(lowStockLimit)

    if (lowStockError) throw lowStockError;

    // high stock
    const { data: highStock, error: highStockError } = await supabase
        .from("products")
        .select("id, name, stock_quantity")
        .order("stock_quantity", { ascending: false })
        .limit(highStockLimit)

    if (highStockError) throw highStockError;

    const clamped = clampRangeToRecentDays(from, to, 7);

    // recent inventory transactions
    let rencentTransactionQuery = supabase
        .from("inventory_transactions")
        .select("product_id, type, requested_quantity, applied_quantity, delta, created_at, receipt_id, products(name)")
        .order("created_at", { ascending: false })
        .limit(recentTransactionLimit)

    rencentTransactionQuery = rencentTransactionQuery
        .gte("created_at", clamped.from)
        .lt("created_at", clamped.to)

    if (from) rencentTransactionQuery = rencentTransactionQuery.gte("created_at", from);

    if (to) rencentTransactionQuery = rencentTransactionQuery.lt("created_at", to);

    const { data: txRows, error: txError } = await rencentTransactionQuery;

    if (txError) throw txError;

    const recent_transactions: AIInventoryTransaction[] = (txRows ?? []).map(
        (tx: any) => ({
            product_id: tx.product_id,
            product_name: tx.products?.name ?? "Unknown",
            type: tx.type,
            requested_quantity: tx.requested_quantity,
            applied_quantity: tx.applied_quantity,
            delta: tx.delta,
            created_at: tx.created_at,
            receipt_id: tx.receipt_id ?? null
        })
    );

    return {
        low_stock_products: (lowStock ?? []).map((p) => ({
            product_id: p.id,
            name: p.name,
            stock_quantity: p.stock_quantity,
        })),
        high_stock_products: (highStock ?? []).map((p) => ({
            product_id: p.id,
            name: p.name,
            stock_quantity: p.stock_quantity,
        })),
        recent_transactions,
    };
}