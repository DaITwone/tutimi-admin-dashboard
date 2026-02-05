import { useQuery } from "@tanstack/react-query";
import { dashboardQueryKeys } from "./dashboardQueryKeys";
import { DashboardRange, dashboardService } from "../services/dashboardService";

export function useDashboardKpisQuery(range: DashboardRange) {
  return useQuery({
    queryKey: dashboardQueryKeys.kpis(range),
    queryFn: () => dashboardService.getKpis(range),
  });
}

export function useLowStockProductsQuery(limit = 5) {
  return useQuery({
    queryKey: dashboardQueryKeys.lowStockProducts(limit),
    queryFn: () => dashboardService.getLowStockProducts(limit),
    staleTime: 10_000,
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

export function useTopSellingProductsQuery(range: DashboardRange, limit = 5) {
  return useQuery({
    queryKey: dashboardQueryKeys.topSellingProducts(range, limit),
    queryFn: () => dashboardService.getTopSellingProducts(range, limit),
  })
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

