import { describe, it, expect } from "vitest";
import { formatDateShort } from "./formatDate";

describe("formatDateShort", () => {
  it("should format date to dd/mm (allowing '/' or '-')", () => {
    const result = formatDateShort("2024-02-15");

    // kiểm tra structure
    expect(result).toMatch(/^\d{2}[\/-]\d{2}$/);

    // kiểm tra đúng day và month
    const [day, month] = result.split(/[\/-]/);
    expect(day).toBe("15");
    expect(month).toBe("02");
  });

  it("should work with full ISO string", () => {
    const result = formatDateShort("2024-12-01T10:30:00Z");

    expect(result).toMatch(/^\d{2}[\/-]\d{2}$/);

    const [day, month] = result.split(/[\/-]/);
    expect(day).toBe("01");
    expect(month).toBe("12");
  });

  it("should return 'Invalid Date' for invalid input", () => {
    const result = formatDateShort("abc");
    expect(result).toBe("Invalid Date");
  });
});