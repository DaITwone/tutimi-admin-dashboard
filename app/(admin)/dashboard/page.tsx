"use client";

import { useMemo, useState } from "react";

import { KpiGrid } from "@/app/features/dashboard/components/KpiGrid";
import { RecentOrders } from "@/app/features/dashboard/components/RecentOrders";
import { TopSellingProductsTable } from "@/app/features/dashboard/components/TopSellingProductsTable";
import { LatestNewsPanel } from "@/app/features/dashboard/components/LatestNewsPanel";
import { useDashboardRealtimeSync } from "@/app/features/dashboard/hooks/useDashboardRealtimeSync";
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

import { DashboardAIDrawer, QUICK_ACTIONS, type Message } from "@/app/components/DashboardAIDrawer";
import { DashboardAIButton } from "@/app/components/DashboardAIButton";

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
  const [range, setRange] = useState<DashboardRange>(() => ({
    bucket: "day",
    from: null,
    to: null,
  }));

  // fallback theo bucket nếu user chưa chọn from/to
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

  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickAction = async (id: string) => {
    const action = QUICK_ACTIONS.find(a => a.id === id);
    const displayLabel = action ? action.label : id;
      setIsLoading(true);

    const typingId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: `${displayLabel}` },

      { id: typingId, role: "assistant", content: "", isTyping: true },
    ]);

    await new Promise((r) => setTimeout(r, 1000));

    setMessages((prev) =>
      prev.map((m) =>
        m.id === typingId
          ? { ...m, isTyping: false, content: "Kết quả (demo)" }
          : m
      )
    );

    setIsLoading(false);
  };


  const handleSendMessage = async (text: string) => {
    setIsLoading(true);

    const typingId = crypto.randomUUID();

    // 1. user message
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text },

      // 2. assistant typing
      { id: typingId, role: "assistant", content: "", isTyping: true },
    ]);

    // 3. fake delay / API call
    await new Promise((r) => setTimeout(r, 1200));

    // 4. replace typing bằng kết quả thật
    setMessages((prev) =>
      prev.map((m) =>
        m.id === typingId
          ? {
            ...m,
            isTyping: false,
            content: "Kết quả (demo)",
          }
          : m
      )
    );

    setIsLoading(false);
  };


  function handleResetChart() {
    setMessages([]);
    setIsLoading(false);
  }

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

        {/* Floating AI Chat Widget */}
        <div className="fixed bottom-2 right-2 z-50">
          <div className="relative">
            {/* Chat box (popover – bên trái button) */}
            <DashboardAIDrawer
              open={aiOpen}
              onClose={() => setAiOpen(false)}
              onQuickAction={handleQuickAction}
              onSendMessage={handleSendMessage}
              onReset={handleResetChart}
              messages={messages}
              isLoading={isLoading}
            />

            {/* Chat button */}
            <DashboardAIButton onClick={() => setAiOpen((prev) => !prev)} />
          </div>
        </div>
      </div>
    </div>
  );
}
