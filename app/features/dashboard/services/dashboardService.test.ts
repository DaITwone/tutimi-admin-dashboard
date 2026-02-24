import { beforeEach, describe, expect, it, vi } from "vitest";
import { dashboardService, type DashboardRange } from "./dashboardService";

const { fromMock, rpcMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  rpcMock: vi.fn(),
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
    rpc: rpcMock,
  },
}));

describe("dashboardService", () => {
  const range: DashboardRange = {
    from: "2026-02-01T00:00:00.000Z",
    to: "2026-02-24T23:59:59.999Z",
    bucket: "day",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getKpis returns computed counters and revenue", async () => {
    const totalOrdersQuery = {
      select: vi.fn(() => ({
        gte: vi.fn(() => ({
          lt: vi.fn().mockResolvedValue({ count: 11, error: null }),
        })),
      })),
    };
    const revenueQuery = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            lt: vi
              .fn()
              .mockResolvedValue({
                data: [{ total_price: 100 }, { total_price: null }, { total_price: 25 }],
                error: null,
              }),
          })),
        })),
      })),
    };
    const confirmedOrdersQuery = {
      select: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ count: 4, error: null }),
      })),
    };
    const lowStockQuery = {
      select: vi.fn(() => ({
        lte: vi.fn().mockResolvedValue({ count: 3, error: null }),
      })),
    };

    fromMock.mockImplementation((table: string) => {
      if (table === "orders") {
        const call = fromMock.mock.calls.length;
        if (call === 1) return totalOrdersQuery;
        if (call === 2) return revenueQuery;
        return confirmedOrdersQuery;
      }
      return lowStockQuery;
    });

    const result = await dashboardService.getKpis(range);

    expect(result).toEqual({
      totalOrders: 11,
      revenue: 125,
      confirmedOrders: 4,
      lowStockProducts: 3,
    });
  });

  it("getTopSellingProducts aggregates and sorts sold quantity", async () => {
    const ordersQuery = {
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            lt: vi
              .fn()
              .mockResolvedValue({ data: [{ id: "o1" }, { id: "o2" }], error: null }),
          })),
        })),
      })),
    };
    const orderItemsQuery = {
      select: vi.fn(() => ({
        in: vi.fn().mockResolvedValue({
          data: [
            { product_id: "p1", product_name: "Milk", product_image: null, quantity: 2, total_price: 20 },
            { product_id: "p2", product_name: "Tea", product_image: null, quantity: 5, total_price: 50 },
            { product_id: "p1", product_name: "Milk", product_image: null, quantity: 3, total_price: 30 },
          ],
          error: null,
        }),
      })),
    };

    fromMock.mockImplementation((table: string) =>
      table === "orders" ? ordersQuery : orderItemsQuery
    );

    const result = await dashboardService.getTopSellingProducts(range, 5);

    expect(result.map((x) => x.product_id)).toEqual(["p1", "p2"]);
    expect(result[0].sold_quantity).toBe(5);
    expect(result[0].revenue).toBe(50);
  });

  it("getRevenueChart calls rpc with range params", async () => {
    rpcMock.mockResolvedValue({
      data: [{ bucket: "2026-02-24", revenue: 300 }],
      error: null,
    });

    const result = await dashboardService.getRevenueChart(range);

    expect(rpcMock).toHaveBeenCalledWith("get_revenue_vn", {
      p_from: range.from,
      p_to: range.to,
      p_bucket: range.bucket,
    });
    expect(result).toEqual([{ bucket: "2026-02-24", revenue: 300 }]);
  });
});
