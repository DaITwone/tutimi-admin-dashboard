"use client";

import { useMemo, useState } from "react";

import { KpiGrid } from "@/app/features/dashboard/components/KpiGrid";
import { RecentOrders } from "@/app/features/dashboard/components/RecentOrders";
import { TopSellingProductsTable } from "@/app/features/dashboard/components/TopSellingProductsTable";
import { LatestNewsPanel } from "@/app/features/dashboard/components/LatestNewsPanel";
import { useDashboardRealtimeSync } from "@/app/features/dashboard/hooks/useDashboardRealtimeSync";
import { useDashboardAIChat } from "@/app/features/dashboard/hooks/useDashboardAIChat";
import { RevenueLineChartCard } from "@/app/features/dashboard/components/RevenueLineChartCard";
import { OrdersStatusBarChartCard } from "@/app/features/dashboard/components/OrdersStatusBarChartCard";
import { InventoryInOutChartCard } from "@/app/features/dashboard/components/InventoryInOutChartCard";
import { DashboardRangeFilter, type DashboardRange } from "@/app/features/dashboard/components/DashboardRangeFilter";

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

import { DashboardAIDrawer } from "@/app/components/DashboardAIDrawer";
import { DashboardAIButton } from "@/app/components/DashboardAIButton";

type BucketType = "day" | "week" | "month" | "year";

function getDefaultRangeByBucket(bucket: BucketType) {
  const now = new Date();
  const from = new Date(now);

  switch (bucket) {
    case "day":
      from.setHours(0, 0, 0, 0);
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

  const [range, setRange] = useState<DashboardRange>(() => ({
    bucket: "day",
    from: null,
    to: null,
  }));

  const effectiveRange = useMemo(() => {
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

  const {
    aiOpen,
    setAiOpen,
    messages,
    isLoading,
    handleQuickAction,
    handleSendMessage,
    handleResetChat,
  } = useDashboardAIChat({
    kpi: kpisQuery.data,
    lowStock: lowStockQuery.data,
    topProducts: topProductsQuery.data,
    currentRange: effectiveRange,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Tổng quan hoạt động gần đây.</p>
      </div>

      <DashboardRangeFilter value={range} onChange={setRange} />

      <KpiGrid
        data={kpisQuery.data}
        isLoading={kpisQuery.isLoading}
        range={effectiveRange}
        lowStockProducts={lowStockQuery.data}
        lowStockLoading={lowStockQuery.isLoading}
      />

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

        <div className="fixed bottom-2 right-2 z-50">
          <div className="relative">
            <DashboardAIDrawer
              open={aiOpen}
              onClose={() => setAiOpen(false)}
              onQuickAction={handleQuickAction}
              onSendMessage={handleSendMessage}
              onReset={handleResetChat}
              messages={messages}
              isLoading={isLoading}
            />
            <DashboardAIButton onClick={() => setAiOpen((prev) => !prev)} />
          </div>
        </div>
      </div>
    </div>
  );
}
