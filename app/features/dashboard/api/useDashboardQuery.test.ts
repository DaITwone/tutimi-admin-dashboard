import { beforeEach, describe, expect, it, vi } from "vitest";
import { dashboardQueryKeys } from "./dashboardQueryKeys";
import {
  useDashboardKpisQuery,
  useLatestNewsQuery,
  useRecentOrdersQuery,
  useTopSellingProductsQuery,
} from "./useDashboardQuery";

type UseQueryOptionsLike = {
  queryKey: unknown;
  queryFn: () => Promise<unknown>;
  staleTime?: number;
  refetchInterval?: number;
};

const { useQueryMock, dashboardServiceMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
  dashboardServiceMock: {
    getKpis: vi.fn(),
    getLowStockProducts: vi.fn(),
    getRecentOrders: vi.fn(),
    getTopSellingProducts: vi.fn(),
    getLatestNews: vi.fn(),
    getRevenueChart: vi.fn(),
    getOrdersCountChart: vi.fn(),
    getInventoryInOutChart: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: useQueryMock,
}));

vi.mock("../services/dashboardService", () => ({
  dashboardService: dashboardServiceMock,
}));

describe("useDashboardQuery hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useQueryMock.mockImplementation((opts: UseQueryOptionsLike) => opts);
  });

  it("configures kpis query with proper key and fn", async () => {
    const range = { from: "2026-02-01", to: "2026-02-24", bucket: "day" as const };
    dashboardServiceMock.getKpis.mockResolvedValue({ totalOrders: 1 });

    useDashboardKpisQuery(range);
    const options = useQueryMock.mock.calls[0][0] as UseQueryOptionsLike;
    await options.queryFn();

    expect(options.queryKey).toEqual(dashboardQueryKeys.kpis(range));
    expect(dashboardServiceMock.getKpis).toHaveBeenCalledWith(range);
  });

  it("applies stale/refetch options for recent orders and latest news", () => {
    useRecentOrdersQuery(12);
    useLatestNewsQuery(7);

    const recentOptions = useQueryMock.mock.calls[0][0] as UseQueryOptionsLike;
    const latestNewsOptions = useQueryMock.mock.calls[1][0] as UseQueryOptionsLike;

    expect(recentOptions.queryKey).toEqual(dashboardQueryKeys.recentOrders(12));
    expect(recentOptions.staleTime).toBe(10_000);
    expect(recentOptions.refetchInterval).toBe(30_000);

    expect(latestNewsOptions.queryKey).toEqual([
      ...dashboardQueryKeys.all,
      "latestNews",
      7,
    ]);
    expect(latestNewsOptions.staleTime).toBe(15_000);
    expect(latestNewsOptions.refetchInterval).toBe(60_000);
  });

  it("passes range and limit to top selling query fn", async () => {
    const range = { from: "2026-02-01", to: "2026-02-24", bucket: "week" as const };

    useTopSellingProductsQuery(range, 9);
    const options = useQueryMock.mock.calls[0][0] as UseQueryOptionsLike;
    await options.queryFn();

    expect(options.queryKey).toEqual(dashboardQueryKeys.topSellingProducts(range, 9));
    expect(dashboardServiceMock.getTopSellingProducts).toHaveBeenCalledWith(range, 9);
  });
});
