import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  bulkUpdateProductActiveApi,
  deleteProductApi,
  fetchCategoriesApi,
  fetchProductsApi,
} from "./api";

type AwaitableQueryResponse = { data: unknown; error?: unknown };

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

function createAwaitableQuery(response: AwaitableQueryResponse) {
  const query = {
    eq: vi.fn(() => query),
    ilike: vi.fn(() => query),
    then: (
      onFulfilled?: ((value: AwaitableQueryResponse) => unknown) | null,
      onRejected?: ((reason: unknown) => unknown) | null
    ) => Promise.resolve(response).then(onFulfilled ?? undefined, onRejected ?? undefined),
  };

  return query;
}

describe("products api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchCategoriesApi queries categories and returns data", async () => {
    const orderMock = vi.fn().mockResolvedValue({
      data: [{ id: "c1", title: "Coffee" }],
    });
    fromMock.mockReturnValue({
      select: vi.fn(() => ({ order: orderMock })),
    });

    const result = await fetchCategoriesApi();

    expect(result).toEqual([{ id: "c1", title: "Coffee" }]);
    expect(orderMock).toHaveBeenCalledWith("sort_order", { ascending: true });
  });

  it("fetchProductsApi applies filters and returns payload", async () => {
    const awaitable = createAwaitableQuery({
      data: [{ id: "p1", name: "Milk" }],
      error: null,
    });
    fromMock.mockReturnValue({
      select: vi.fn(() => ({
        order: vi.fn(() => awaitable),
      })),
    });

    const result = await fetchProductsApi({
      categoryId: "cat-1",
      manageMode: true,
      statusFilter: "off",
      search: "  latte ",
    });

    expect(awaitable.eq).toHaveBeenCalledWith("category_id", "cat-1");
    expect(awaitable.eq).toHaveBeenCalledWith("is_active", false);
    expect(awaitable.ilike).toHaveBeenCalledWith("name", "%latte%");
    expect(result).toEqual({ data: [{ id: "p1", name: "Milk" }], error: null });
  });

  it("delete and bulk update call expected table operations", async () => {
    const eqMock = vi.fn().mockResolvedValue({});
    const inMock = vi.fn().mockResolvedValue({});
    const deleteMock = vi.fn(() => ({ eq: eqMock }));
    const updateMock = vi.fn(() => ({ in: inMock }));

    fromMock.mockReturnValue({
      delete: deleteMock,
      update: updateMock,
    });

    await deleteProductApi("p1");
    await bulkUpdateProductActiveApi(["p1", "p2"], true);

    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", "p1");
    expect(updateMock).toHaveBeenCalledWith({ is_active: true });
    expect(inMock).toHaveBeenCalledWith("id", ["p1", "p2"]);
  });
});
