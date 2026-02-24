export type BulkType = "in" | "out";

export type SortDirection = "asc" | "desc" | null;

export const REASON_PRESETS = [
  "Kho giao",
  "Luân chuyển cửa hàng",
  "Bổ sung tồn kho",
  "Hàng đổi trả",
  "Khác",
] as const;

export const INPUT_UNITS = ["ML", "L", "G", "Kg", "Cái", "Lốc"] as const;

export type InputUnit = (typeof INPUT_UNITS)[number];

export type RowState = {
  inputValue: string;
  unit: InputUnit;
  qty: number;
};

export type SelectedBulkItem = {
  productId: string;
  qty: number;
  inputValue: number | null;
  inputUnit: InputUnit;
};

export type SubmitResult = {
  success: number;
  fail: number;
  details: { productId: string; qty: number; error?: string }[];
};
