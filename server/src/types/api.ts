export type AICategory = {
  id: string;
  title: string;
};

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
  category?: AICategory | null;
};

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

export type AIContext = {
  dashboard?: {
    kpi: unknown;
    range: { from: string; to: string; bucket: string };
  };
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
    high_stock_products: {
      product_id: string;
      name: string;
      stock_quantity: number;
    }[];
    recent_transactions: AIInventoryTransaction[];
  };
};

export type AIHistoryMessage = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

export type DashboardRange = {
  from?: string | null;
  to?: string | null;
  bucket?: "day" | "week" | "month" | "year";
};

export type DashboardContext = {
  kpi?: unknown;
  lowStock?: unknown;
  topProducts?: unknown;
  currentRange?: DashboardRange;
  range?: DashboardRange;
};

export type DashboardAiRequest = {
  prompt: string;
  history?: AIHistoryMessage[];
  dashboardContext?: DashboardContext;
};

export type DashboardAiSuccessResponse = {
  content: string;
};

export type ApiErrorResponse = {
  errorCode: string;
  message: string;
  requestId?: string;
};

export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  isOperational: boolean;

  constructor(statusCode: number, errorCode: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
  }
}
