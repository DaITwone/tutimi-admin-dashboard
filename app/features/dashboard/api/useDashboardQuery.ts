import { useQuery } from "@tanstack/react-query";
import { dashboardQueryKeys } from "./dashboardQueryKeys";
import { DashboardRange, dashboardService } from "../services/dashboardService";

export function useDashboardKpisQuery(range: DashboardRange) {
  return useQuery({
    queryKey: dashboardQueryKeys.kpis(range),
    queryFn: () => dashboardService.getKpis(range),
  });
}

export function useRecentOrdersQuery(limit = 10) {
  return useQuery({
    queryKey: dashboardQueryKeys.recentOrders(limit),
    queryFn: () => dashboardService.getRecentOrders(limit),
    staleTime: 10_000, // khỏi refetch trong 10s
    refetchInterval: 30_000, // Đảm bảo dashboard không 'chết' nếu không có event realtime
  });
}

export function useTopSellingProductsLast7DaysQuery(limit = 5) {
  return useQuery({
    queryKey: [...dashboardQueryKeys.all, "topSellingProductsLast7Days", limit],
    queryFn: () => dashboardService.getTopSellingProductsLastDays(limit),
  });
}

export function useInventorySummaryLast7DaysQuery() {
  return useQuery({
    queryKey: [...dashboardQueryKeys.all, "inventorySummaryLast7Days"],
    queryFn: dashboardService.getInventorySummaryLast7Days,
  });
}

export function useRecentInventoryTransactionsQuery(limit = 8) {
  return useQuery({
    queryKey: [...dashboardQueryKeys.all, "recentInventoryTransactions", limit],
    queryFn: () => dashboardService.getrecentInventoryTransactions(limit),
  });
}

export function useLatestNewsQuery(limit = 5) {
  return useQuery({
    queryKey: [...dashboardQueryKeys.all, "latestNews", limit],
    queryFn: () => dashboardService.getLatestNews(limit),
    staleTime: 15_000,
    refetchInterval: 60_000,
  });
}

export function useRevenueChartQuery(range: DashboardRange) {
  return useQuery({
    queryKey: dashboardQueryKeys.revenueChart(range),
    queryFn: () => dashboardService.getRevenueChart(range),
  });
}

export function useOrdersCountChartQuery(range: DashboardRange) {
  return useQuery({
    queryKey: dashboardQueryKeys.ordersCountChart(range),
    queryFn: () => dashboardService.getOrdersCountChart(range),
  });
}

export function useInventoryInOutChartQuery(range: DashboardRange) {
  return useQuery({
    queryKey: dashboardQueryKeys.inventoryInOutChart(range),
    queryFn: () => dashboardService.getInventoryInOutChart(range),
  });
}

