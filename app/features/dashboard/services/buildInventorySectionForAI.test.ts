import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildInventorySectionForAI } from "./buildInventorySectionForAI";

type QueryResponse = { data: unknown; error: unknown };

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

function createAwaitableTxQuery(response: QueryResponse) {
  const query = {
    gte: vi.fn(() => query),
    lt: vi.fn(() => query),
    then: (
      onFulfilled?: ((value: QueryResponse) => unknown) | null,
      onRejected?: ((reason: unknown) => unknown) | null
    ) => Promise.resolve(response).then(onFulfilled ?? undefined, onRejected ?? undefined),
  };

  return query;
}

describe("buildInventorySectionForAI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds low/high stock and recent transaction context", async () => {
    const lowStockSelect = {
      order: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue({
          data: [{ id: "p1", name: "Milk", stock_quantity: 1 }],
          error: null,
        }),
      })),
    };
    const highStockSelect = {
      order: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue({
          data: [{ id: "p2", name: "Tea", stock_quantity: 100 }],
          error: null,
        }),
      })),
    };
    const txQuery = createAwaitableTxQuery({
      data: [
        {
          product_id: "p1",
          products: { name: "Milk" },
          type: "IN",
          requested_quantity: 2,
          applied_quantity: 2,
          delta: 2,
          created_at: "2026-02-24T10:00:00.000Z",
          receipt_id: "r1",
        },
        {
          product_id: "p3",
          products: null,
          type: "OUT",
          requested_quantity: 1,
          applied_quantity: 1,
          delta: -1,
          created_at: "2026-02-24T10:10:00.000Z",
          receipt_id: null,
        },
      ],
      error: null,
    });
    const txSelect = {
      order: vi.fn(() => ({
        limit: vi.fn(() => txQuery),
      })),
    };

    fromMock.mockImplementation((table: string) => {
      if (table === "products") {
        const call = fromMock.mock.calls.length;
        if (call === 1) return { select: vi.fn(() => lowStockSelect) };
        return { select: vi.fn(() => highStockSelect) };
      }
      return { select: vi.fn(() => txSelect) };
    });

    const result = await buildInventorySectionForAI();

    expect(result.low_stock_products).toEqual([
      { product_id: "p1", name: "Milk", stock_quantity: 1 },
    ]);
    expect(result.high_stock_products).toEqual([
      { product_id: "p2", name: "Tea", stock_quantity: 100 },
    ]);
    expect(result.recent_transactions[1].product_name).toBe("Unknown");
    expect(txQuery.gte).toHaveBeenCalled();
    expect(txQuery.lt).toHaveBeenCalled();
  });

  it("applies explicit from/to filters when provided", async () => {
    const selectWithLimit = {
      order: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    };
    const txQuery = createAwaitableTxQuery({ data: [], error: null });
    const txSelect = {
      order: vi.fn(() => ({
        limit: vi.fn(() => txQuery),
      })),
    };

    fromMock.mockImplementation((table: string) => {
      if (table === "products") return { select: vi.fn(() => selectWithLimit) };
      return { select: vi.fn(() => txSelect) };
    });

    await buildInventorySectionForAI({
      from: "2026-02-20T00:00:00.000Z",
      to: "2026-02-24T23:59:59.999Z",
    });

    expect(txQuery.gte).toHaveBeenCalledWith("created_at", "2026-02-20T00:00:00.000Z");
    expect(txQuery.lt).toHaveBeenCalledWith("created_at", "2026-02-24T23:59:59.999Z");
  });
});
