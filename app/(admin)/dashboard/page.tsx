"use client";

import * as React from "react";

import { KpiGrid } from "@/app/features/dashboard/components/KpiGrid";
import { RecentOrders } from "@/app/features/dashboard/components/RecentOrders";
import { TopSellingProductsTable } from "@/app/features/dashboard/components/TopSellingProductsTable";
import { LatestNewsPanel } from "@/app/features/dashboard/components/LatestNewsPanel";
import { useDashboardRealtimeSync } from "@/app/features/dashboard/hooks/useDashboardRealtimeSync";
import { RevenueLineChartCard } from "@/app/features/dashboard/components/RevenueLineChartCard";
import { OrdersStatusBarChartCard } from "@/app/features/dashboard/components/OrdersStatusBarChartCard";
import { InventoryInOutChartCard } from "@/app/features/dashboard/components/InventoryInOutChartCard";

import {
  useDashboardKpisQuery,
  useRecentOrdersQuery,
  useLatestNewsQuery,
  useRevenueChartQuery,
  useOrdersCountChartQuery,
  useInventoryInOutChartQuery,
  useTopSellingProductsQuery,
  useLowStockProductsQuery,
} from "@/app/features/dashboard/api/useDashboardQuery";

import { DashboardRangeFilter, type DashboardRange } from "@/app/features/dashboard/components/DashboardRangeFilter";

type BucketType = "day" | "week" | "month" | "year";

function getDefaultRangeByBucket(bucket: BucketType) {
  const now = new Date();
  const from = new Date(now);

  switch (bucket) {
    case "day":
      from.setHours(0, 0, 0, 0); // today only
      break;

    case "week":
      from.setDate(from.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      break;

    case "month":
      from.setDate(from.getDate() - 30);
      from.setHours(0, 0, 0, 0);
      break;

    case "year":
      from.setMonth(from.getMonth() - 12);
      from.setHours(0, 0, 0, 0);
      break;
  }

  return {
    from: from.toISOString(),
    to: now.toISOString(),
  };
}

export default function DashboardPage() {
  useDashboardRealtimeSync();

  // allow null dates so input can be empty/cleared
  const [range, setRange] = React.useState<DashboardRange>(() => ({
    bucket: "day",
    from: null,
    to: null,
  }));

  // fallback theo bucket nếu user chưa chọn from/to
  const effectiveRange = React.useMemo(() => {
    const defaults = getDefaultRangeByBucket(range.bucket);

    return {
      bucket: range.bucket,
      from: range.from ?? defaults.from,
      to: range.to ?? defaults.to,
    };
  }, [range]);

  const kpisQuery = useDashboardKpisQuery(effectiveRange);
  const lowStockQuery = useLowStockProductsQuery(5);
  const recentOrdersQuery = useRecentOrdersQuery(10);
  const topProductsQuery = useTopSellingProductsQuery(effectiveRange, 5);
  const latestNewsQuery = useLatestNewsQuery(4);
  const revenueChartQuery = useRevenueChartQuery(effectiveRange);
  const ordersChartQuery = useOrdersCountChartQuery(effectiveRange);
  const inventoryChartQuery = useInventoryInOutChartQuery(effectiveRange);

  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <p className="text-sm text-muted-foreground">Tổng quan hoạt động gần đây.</p>
      </div>

      <DashboardRangeFilter value={range} onChange={setRange} />

      {/* KPI */}
      <KpiGrid
        data={kpisQuery.data}
        isLoading={kpisQuery.isLoading}
        range={effectiveRange}
        lowStockProducts={lowStockQuery.data}
        lowStockLoading={lowStockQuery.isLoading}
      />

      {/* Revenue chart */}
      <RevenueLineChartCard
        data={revenueChartQuery.data}
        isLoading={revenueChartQuery.isLoading}
        bucketType={effectiveRange.bucket}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <OrdersStatusBarChartCard
          data={ordersChartQuery.data}
          isLoading={ordersChartQuery.isLoading}
          bucketType={effectiveRange.bucket}
        />

        <InventoryInOutChartCard
          data={inventoryChartQuery.data}
          isLoading={inventoryChartQuery.isLoading}
          bucketType={effectiveRange.bucket}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders data={recentOrdersQuery.data} isLoading={recentOrdersQuery.isLoading} />
        </div>

        <LatestNewsPanel data={latestNewsQuery.data} isLoading={latestNewsQuery.isLoading} />

      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopSellingProductsTable
            data={topProductsQuery.data}
            isLoading={topProductsQuery.isLoading}
            bucketType={effectiveRange.bucket}
          />
        </div>

      </div>
    </div>
  );
}
