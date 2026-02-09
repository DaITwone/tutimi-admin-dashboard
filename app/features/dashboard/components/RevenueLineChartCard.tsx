"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { RevenueChartPoint } from "../types/dashboard";
import { formatVnd } from "@/app/lib/formatMoney";
import { formatDateShort } from "@/app/lib/formatDate";

type BucketType = "day" | "week" | "month" | "year";

function safeNumber(n: unknown) {
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

function formatBucketLabel(bucket: string, bucketType: BucketType) {
  // bucket is:
  // - day:   "2026-02-04"
  // - week:  "2026-W05"
  // - month: "2026-02"
  // - year:  "2026"
  if (bucketType === "day") return formatDateShort(bucket);
  if (bucketType === "week") return bucket.replace("-W", " W");
  return bucket;
}

function normalizeRevenueData(data: RevenueChartPoint[], bucketType: BucketType) {
  return [...data]
    .map((p) => ({
      bucket: p.bucket,
      revenue: safeNumber(p.revenue),
      label: formatBucketLabel(p.bucket, bucketType),
    }))
    .sort((a, b) => (a.bucket > b.bucket ? 1 : -1));
}

function getTitleByBucketType(bucketType: BucketType) {
  switch (bucketType) {
    case "day":
      return "Doanh thu theo ngày";
    case "week":
      return "Doanh thu theo tuần";
    case "month":
      return "Doanh thu theo tháng";
    case "year":
      return "Doanh thu theo năm";
    default:
      return "Doanh thu";
  }
}

export function RevenueLineChartCard({
  data,
  isLoading,
  bucketType = "day",
}: {
  data?: RevenueChartPoint[];
  isLoading: boolean;
  bucketType?: BucketType;
}) {
  const chartData = React.useMemo(
    () => normalizeRevenueData(data ?? [], bucketType),
    [data, bucketType]
  );

  const totalRevenue = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg text-blue1 font-bold">
            {getTitleByBucketType(bucketType)}
          </CardTitle>
          <div className="mt-1 text-sm text-muted-foreground">
            Tổng:{" "}
            <span className="font-bold text-[#1b4f94]">
              {formatVnd(totalRevenue)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-65 w-full rounded-2xl" />
        ) : chartData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />

                {/* ✅ label */}
                <XAxis dataKey="label" tickLine={false} axisLine={false} />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => {
                    if (typeof v !== "number") return "";
                    return new Intl.NumberFormat("vi-VN", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(v);
                  }}
                />

                <Tooltip
                  formatter={(value) => formatVnd(safeNumber(value))}
                  labelFormatter={(_, payload) => {
                    const rawBucket = payload?.[0]?.payload?.bucket as string | undefined;
                    if (!rawBucket) return "";

                    if (bucketType === "day") {
                      return `Ngày ${formatDateShort(rawBucket)}`;
                    }

                    if (bucketType === "week") {
                      return `Tuần ${rawBucket.replace("-W", " ")}`;
                    }

                    if (bucketType === "month") {
                      return `Tháng ${rawBucket}`;
                    }

                    return `Năm ${rawBucket}`;
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 w-full flex items-center justify-center text-muted-foreground">
            Không có dữ liệu doanh thu cho khoảng thời gian này.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
