
export const dashboardQueryKeys = {
  all: ["dashboard"] as const,

  kpis: (range: { from: string; to: string; bucket: string }) =>
    [...dashboardQueryKeys.all, "kpis", range] as const,

  lowStockProducts: (limit: number) =>
    [...dashboardQueryKeys.all, "lowStockProducts", limit] as const,

  recentOrders: (limit: number) =>
    [...dashboardQueryKeys.all, "recentOrders", limit] as const,

  revenueChart: (range: { from: string; to: string; bucket: string }) =>
    [...dashboardQueryKeys.all, "revenueChart", range] as const,

  ordersCountChart: (range: { from: string; to: string; bucket: string }) =>
    [...dashboardQueryKeys.all, "ordersCountChart", range] as const,

  inventoryInOutChart: (range: { from: string; to: string; bucket: string }) =>
    [...dashboardQueryKeys.all, "inventoryInOutChart", range] as const,

  inventorySummary: (range: { from: string; to: string; bucket: string }) =>
    [...dashboardQueryKeys.all, "inventorySummary", range] as const,

  topSellingProducts: (range: { from: string, to: string, bucket: string }, limit: number) =>
    [...dashboardQueryKeys.all, "topSellingProducts", range, limit] as const,
};
