import type { TxRow } from "@/app/features/inventory/print/types";

export function formatDateVN(dateStr: string) {
  const date = new Date(dateStr);
  return `Ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
}

export function getReceiptTitle(type: "in" | "out") {
  return type === "in" ? "PHIẾU NHẬP KHO" : "PHIẾU XUẤT KHO";
}

export function getInputText(row: TxRow) {
  if (row.input_value == null || !row.input_unit) return "-";
  return `${row.input_value} ${row.input_unit}`;
}

