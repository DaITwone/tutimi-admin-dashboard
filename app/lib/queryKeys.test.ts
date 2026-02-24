import { describe, it, expect } from "vitest";
import { queryKeys } from "./queryKeys";

describe("queryKeys", () => {
  it("categories key", () => {
    expect(queryKeys.categories()).toEqual(["categories"]);
  });

  it("products key", () => {
    expect(
      queryKeys.products({
        categoryId: "all",
        search: "abc",
        manageMode: true,
        statusFilter: "on",
      })
    ).toEqual([
      "products",
      { categoryId: "all", search: "abc", manageMode: true, statusFilter: "on" },
    ]);
  });

  it("inventoryTransactions key", () => {
    expect(queryKeys.inventoryTransactions("p1")).toEqual(["inventoryTransactions", "p1"]);
  });
});
