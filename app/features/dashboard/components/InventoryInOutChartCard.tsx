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

import type { InventoryInOutChartPoint } from "../types/dashboard";
import { formatDateShort } from "@/app/lib/formatDate";

type BucketType = "day" | "week" | "month" | "year";

function safeNumber(n: unknown) {
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

function formatBucketLabel(bucket: string, bucketType: BucketType) {
  if (bucketType === "day") return formatDateShort(bucket);
  if (bucketType === "week") return bucket.replace("-W", " W");
  return bucket;
}

function normalizeInventoryData(data: InventoryInOutChartPoint[], bucketType: BucketType) {
  return [...data]
    .map((p) => ({
      bucket: p.bucket,
      label: formatBucketLabel(p.bucket, bucketType),
      total_in: safeNumber(p.total_in),
      total_out: safeNumber(p.total_out),
    }))
    .sort((a, b) => (a.bucket > b.bucket ? 1 : -1));
}

function getTitleByBucketType(bucketType: BucketType) {
  switch (bucketType) {
    case "day":
      return "Nhập / Xuất kho (ngày)";
    case "week":
      return "Nhập / Xuất kho (tuần)";
    case "month":
      return "Nhập / Xuất kho (tháng)";
    case "year":
      return "Nhập / Xuất kho (năm)";
    default:
      return "Nhập / Xuất kho";
  }
}

export function InventoryInOutChartCard({
  data,
  isLoading,
  bucketType = "day",
}: {
  data?: InventoryInOutChartPoint[];
  isLoading: boolean;
  bucketType?: BucketType;
}) {
  
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = React.useMemo(
    () => normalizeInventoryData(data ?? [], bucketType),
    [data, bucketType]
  );

  const totalIn = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.total_in, 0);
  }, [chartData]);

  const totalOut = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.total_out, 0);
  }, [chartData]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-blue1 font-bold">
          {getTitleByBucketType(bucketType)}
        </CardTitle>
        <div className="mt-1 text-sm text-muted-foreground">
          IN: <span className="font-semibold text-blue-700">{totalIn}</span> • OUT:{" "}
          <span className="font-semibold text-red-600">{totalOut}</span>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-80 w-full rounded-2xl" />
        ) : (
          <div className="h-80 w-full min-h-80">
            {/* ✅ Chỉ render chart khi component đã mount và có dữ liệu */}
            {mounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 12, right: 18, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
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
                  <Legend verticalAlign="top" align="right" iconType="rect" />
                  <Bar 
                    dataKey="total_in" 
                    name="Nhập" 
                    fill="#1b4f94" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="total_out" 
                    name="Xuất" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm italic">
                {mounted ? "Không có dữ liệu tồn kho" : ""}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}