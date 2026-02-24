import { describe, it, expect } from "vitest";
import { formatDateVN, getInputText, getReceiptTitle } from "./format";
import type { TxRow } from "@/app/features/inventory/print/types";

describe("formatDateVN", () => {
  it("format ngày tiếng Việt", () => {
    expect(formatDateVN("2026-02-24T12:00:00.000Z")).toContain("năm 2026");
  });
});

describe("getReceiptTitle", () => {
  it("in/out đúng tiêu đề", () => {
    expect(getReceiptTitle("in")).toContain("NHẬP");
    expect(getReceiptTitle("out")).toContain("XUẤT");
  });
});

describe("getInputText", () => {
  it("thiếu input thì trả -", () => {
    const row = { input_value: null, input_unit: null } as TxRow;
    expect(getInputText(row)).toBe("-");
  });

  it("đủ input thì ghép value + unit", () => {
    const row = { input_value: 500, input_unit: "ML" } as TxRow;
    expect(getInputText(row)).toBe("500 ML");
  });
});
