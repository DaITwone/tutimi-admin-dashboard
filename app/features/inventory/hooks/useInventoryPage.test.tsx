import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Product } from "@/app/features/inventory/types";
import { useInventoryPage } from "./useInventoryPage";

const { useInventoryCategoriesMock, useProductsQueryMock } = vi.hoisted(() => ({
  useInventoryCategoriesMock: vi.fn(),
  useProductsQueryMock: vi.fn(),
}));

vi.mock("@/app/features/inventory/hooks/useInventoryCategories", () => ({
  useInventoryCategories: useInventoryCategoriesMock,
}));

vi.mock("@/app/hooks/useProductsQuery", () => ({
  useProductsQuery: useProductsQueryMock,
}));

const productsFixture: Product[] = [
  { id: "p1", name: "Milk", stock_quantity: 12, image: null, measure_unit: null },
  { id: "p2", name: "Apple", stock_quantity: 2, image: null, measure_unit: null },
  { id: "p3", name: "Bread", stock_quantity: 7, image: null, measure_unit: null },
];

describe("useInventoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useInventoryCategoriesMock.mockReturnValue({
      categories: [
        { id: "all", title: "All" },
        { id: "c1", title: "Coffee" },
      ],
    });

    useProductsQueryMock.mockImplementation(() => ({
      data: productsFixture,
      isLoading: false,
      error: null,
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces and trims search before querying", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useInventoryPage());

    act(() => {
      result.current.setSearch("  tra sua  ");
    });

    act(() => {
      vi.advanceTimersByTime(401);
    });

    expect(useProductsQueryMock).toHaveBeenLastCalledWith({
      categoryId: "all",
      search: "tra sua",
    });
  });

  it("sorts rows by stock asc then desc", () => {
    const { result } = renderHook(() => useInventoryPage());

    act(() => {
      result.current.toggleSort("stock");
    });

    expect(result.current.rows.map((x) => x.id)).toEqual(["p2", "p3", "p1"]);
    expect(result.current.sortOrder).toBe("asc");

    act(() => {
      result.current.toggleSort("stock");
    });

    expect(result.current.rows.map((x) => x.id)).toEqual(["p1", "p3", "p2"]);
    expect(result.current.sortOrder).toBe("desc");
  });

  it("maps products error into user-facing message", () => {
    useProductsQueryMock.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("query failed"),
    });

    const { result } = renderHook(() => useInventoryPage());

    expect(result.current.error).toMatch(/danh sách sản phẩm/i);
  });
});
