import { describe, it, expect } from "vitest";
import { convertToQty } from "./utils";

describe("convertToQty", () => {
  it("ML: 500 => 1", () => {
    expect(convertToQty(500, "ML")).toBe(1);
  });

  it("L: 1 => 2", () => {
    expect(convertToQty(1, "L")).toBe(2);
  });

  it("G: 250 => 2 (floor)", () => {
    expect(convertToQty(250, "G")).toBe(2);
  });

  it("Kg: 1.5 => 15", () => {
    expect(convertToQty(1.5, "Kg")).toBe(15);
  });

  it("Cái: floor", () => {
    expect(convertToQty(2.9, "Cái")).toBe(2);
  });

  it("Lốc: 2 => 12", () => {
    expect(convertToQty(2, "Lốc")).toBe(12);
  });

  it("invalid input => 0", () => {
    expect(convertToQty(0, "ML")).toBe(0);
    expect(convertToQty(-1, "ML")).toBe(0);
    expect(convertToQty(Number.NaN, "ML")).toBe(0);
  });
});
