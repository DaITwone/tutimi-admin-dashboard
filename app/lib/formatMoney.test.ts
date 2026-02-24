import { describe, it, expect } from "vitest";
import { formatMoney, formatVnd } from "./formatMoney";

describe("formatMoney", () => {
  it("trả về chuỗi có ký hiệu tiền tệ", () => {
    const result = formatMoney(1500);
    expect(result).toContain("₫");
    expect(result.length).toBeGreaterThan(1);
  });
});

describe("formatVnd", () => {
  it("format currency VND không có phần thập phân", () => {
    const result = formatVnd(1234567);
    const expected = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(1234567);

    expect(result).toBe(expected);
  });
});
