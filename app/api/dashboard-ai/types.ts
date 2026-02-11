// Category context
export type AICategory = {
  id: string;
  title: string;
};

// Product context 
export type AIProduct = {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  image: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_best_seller: boolean;
  stats?: string | null;

  category?: {
    id: string;
    title: string;
  } | null;
};

// Inventory transaction (đủ để AI hiểu nhập / xuất)
export type AIInventoryTransaction = {
  product_id: string;
  product_name: string;
  type: "IN" | "OUT";
  requested_quantity: number;
  applied_quantity: number;
  delta: number;
  created_at: string;
  receipt_id?: string | null;
};

// News
export type AINews = {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
};

// Users (profiles)
export type AIUserSummary = {
  total: number;
  admin: number;
  user: number;
};

// Vouchers
export type AIVoucherSummary = {
  active: number;
  inactive: number;
};

// Orders (summary để hỏi nghiệp vụ)
export type AIOrderSummary = {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
};

// ===== MASTER CONTEXT =====
export type AIContext = {
  dashboard?: {
    kpi: any;
    range: {
      from: string;
      to: string;
      bucket: string;
    };
  };

  categories?: AICategory[];

  products?: {
    total: number;
    active: number;
    inactive: number;

    inactive_products: AIProduct[];
    top_selling: AIProduct[];

    by_category: {
      id: string;
      title: string;
      total: number;
      active: number;
      items: AIProduct[];
    }[];
  };

  inventory?: {
    low_stock_products: {
      product_id: string;
      name: string;
      stock_quantity: number;
    }[];
    recent_transactions: AIInventoryTransaction[];
  };

  news?: {
    latest: AINews[];
  };

  users?: AIUserSummary;

  vouchers?: AIVoucherSummary;

  orders?: AIOrderSummary;
};
