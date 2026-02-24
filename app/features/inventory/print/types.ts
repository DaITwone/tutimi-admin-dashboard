export type ReceiptType = "in" | "out";

export type TxRow = {
  id: string;
  type: "IN" | "OUT" | "ADJUST";
  requested_quantity: number;
  applied_quantity: number;
  delta: number;
  note: string | null;
  input_value: number | null;
  input_unit: string | null;
  created_at: string;
  product_id: string;
  receipt_id?: string | null;
};

export type ProductMini = {
  id: string;
  name: string;
  image: string | null;
};

export type PrintReceiptViewModel = {
  loading: boolean;
  error: string | null;
  rows: TxRow[];
  productMap: Map<string, ProductMini>;
  createdAt: string | null;
  reasonText: string;
  totalQty: number;
  title: string;
  receiptCode: string;
};

