"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { OrdersCountChartPoint } from "../types/dashboard";
import { formatDateShort } from "@/app/lib/formatDate";

type BucketType = "day" | "week" | "month" | "year";

function safeNumber(n: unknown) {
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

function formatBucketLabel(bucket: string, bucketType: BucketType) {
  if (bucketType === "day") return formatDateShort(bucket);
  if (bucketType === "week") return bucket.replace("-W", " W");
  return bucket; // month/year
}

function normalizeOrdersData(data: OrdersCountChartPoint[], bucketType: BucketType) {
  return [...data]
    .map((p) => ({
      bucket: p.bucket,
      label: formatBucketLabel(p.bucket, bucketType),
      total: safeNumber(p.total),
      completed: safeNumber(p.completed),
      confirmed: safeNumber(p.confirmed),
      cancelled: safeNumber(p.cancelled),
    }))
    .sort((a, b) => (a.bucket > b.bucket ? 1 : -1));
}

function getTitleByBucketType(bucketType: BucketType) {
  switch (bucketType) {
    case "day":
      return "Số đơn theo trạng thái (ngày)";
    case "week":
      return "Số đơn theo trạng thái (tuần)";
    case "month":
      return "Số đơn theo trạng thái (tháng)";
    case "year":
      return "Số đơn theo trạng thái (năm)";
    default:
      return "Số đơn theo trạng thái";
  }
}

export function OrdersStatusBarChartCard({
  data,
  isLoading,
  bucketType = "day",
}: {
  data?: OrdersCountChartPoint[];
  isLoading: boolean;
  bucketType?: BucketType;
}) {
  // Giải pháp 1: Chống lỗi Hydration bằng mounted state
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = React.useMemo(
    () => normalizeOrdersData(data ?? [], bucketType),
    [data, bucketType]
  );

  const totalOrders = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.total, 0);
  }, [chartData]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-blue1 font-bold">
          {getTitleByBucketType(bucketType)}
        </CardTitle>
        <div className="mt-1 text-sm text-muted-foreground">
          Tổng đơn: <span className="font-semibold">{totalOrders}</span>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full rounded-2xl" />
        ) : (
          <div className="h-80 w-full min-h-80">
            {/* Giải pháp 2: Chỉ render khi đã mounted và có dữ liệu hợp lệ */}
            {mounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 18, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                    labelFormatter={(_, payload) => {
                      const rawBucket = payload?.[0]?.payload?.bucket as string | undefined;
                      if (!rawBucket) return "";
                      if (bucketType === "day") return `Ngày ${formatDateShort(rawBucket)}`;
                      if (bucketType === "week") return `Tuần ${rawBucket.replace("-W", " ")}`;
                      if (bucketType === "month") return `Tháng ${rawBucket}`;
                      return `Năm ${rawBucket}`;
                    }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" />
                  
                  {/* Giải pháp 3: Stacked bars với màu sắc đồng nhất UI */}
                  <Bar dataKey="completed" stackId="a" name="Hoàn thành" fill="#22c55e" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="confirmed" stackId="a" name="Đã xác nhận" fill="#1b4f94" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="cancelled" stackId="a" name="Đã huỷ" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm italic">
                {mounted ? "Không có dữ liệu hiển thị" : ""}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}