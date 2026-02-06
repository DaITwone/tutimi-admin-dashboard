import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardKpis, DashboardLowStockProduct } from "../types/dashboard";
import * as React from "react";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { getPublicImageUrl } from "@/app/lib/storage";
import { useRouter } from "next/navigation";

type BucketType = "day" | "week" | "month" | "year";

type DashboardRange = {
  from: string;
  to: string;
  bucket: BucketType; // day, week, month, year
};

function formatVnd(n: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

function getRangeLabel(range?: DashboardRange) {
  if (!range) return "7 ngày";

  switch (range.bucket) {
    case "day":
      return "ngày";
    case "week":
      return "tuần";
    case "month":
      return "tháng";
    case "year":
      return "năm";
    default:
      return "gần đây";
  }
}

export function KpiGrid({
  data,
  isLoading,
  range,
  lowStockProducts,
  lowStockLoading,
}: {
  data?: DashboardKpis; // totalOrders, revenue, confirmOrders, lowStockProducts
  isLoading: boolean;
  range?: DashboardRange; // from, to, bucket
  lowStockProducts?: DashboardLowStockProduct[];
  lowStockLoading?: boolean;
}) {
  const rangeLabel = getRangeLabel(range);

  const items = [
    {
      title: `Đơn hàng (${rangeLabel})`,
      value: data?.totalOrders ?? 0,
    },
    {
      title: `Doanh thu (${rangeLabel})`,
      value: formatVnd(data?.revenue ?? 0),
    },
    {
      title: "Đã xác nhận",
      value: data?.confirmedOrders ?? 0,
    },
  ];

  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 rounded-xl" />
            ) : (
              <div className="text-2xl font-bold text-blue2 tracking-tight">
                {item.value}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <Card className="rounded-2xl cursor-pointer transition hover:bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sắp hết hàng
              </CardTitle>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24 rounded-xl" />
              ) : (
                <div className="text-2xl font-bold text-blue2 tracking-tight">
                  {data?.lowStockProducts ?? 0}
                </div>
              )}
            </CardContent>
          </Card> 
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-72"
        >
          {lowStockLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ) : (lowStockProducts ?? []).length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Không có sản phẩm sắp hết.
            </div>
          ) : (
            <div className="space-y-2">
              {(lowStockProducts ?? []).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-md border p-2 hover:bg-muted cursor-pointer"
                  onClick={() => router.push("/inventory")}
                >
                  <div className="h-8 w-8 overflow-hidden rounded bg-muted">
                    {p.image ? (
                      <img
                        src={getPublicImageUrl("products", p.image) ?? ""}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-blue2 font-medium">
                      {p.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tồn kho: <span className="font-medium">{p.stock_quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>

    </div>
  );
}
