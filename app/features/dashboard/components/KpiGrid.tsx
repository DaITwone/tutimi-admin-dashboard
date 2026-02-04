import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardKpis } from "../types/dashboard";

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
}: {
  data?: DashboardKpis; // totalOrders, revenue, confirmOrders, lowStockProducts
  isLoading: boolean;
  range?: DashboardRange; // from, to, bucket
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
    {
      title: "Sắp hết hàng",
      value: data?.lowStockProducts ?? 0,
    },
  ];

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
    </div>
  );
}
