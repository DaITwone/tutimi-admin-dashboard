import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardTopSellingProduct } from "../types/dashboard";
import { formatVnd } from "@/app/lib/formatMoney";
import { getPublicImageUrl } from "@/app/lib/storage";

type BucketType = "day" | "week" | "month" | "year";


export function TopSellingProductsTable({
  data,
  isLoading,
  bucketType = "day"
}: {
  data?: DashboardTopSellingProduct[];
  isLoading: boolean;
  bucketType?: BucketType
}) {

  function getBucketLabel(bucket: BucketType) {
    switch (bucket) {
      case "day":
        return "Hôm nay";
      case "week":
        return "7 ngày gần đây";
      case "month":
        return "30 ngày gần đây";
      case "year":
        return "12 tháng gần đây";
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-blue1 font-bold">Top Sản phẩm bán chạy ({getBucketLabel(bucketType)}) </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-3">
            {(data ?? []).map((p) => (
              <div
                key={p.product_id}
                className="flex items-center gap-3 rounded-xl border p-3"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-lg border bg-muted">
                  {p.product_image ? (
                    <img
                      src={getPublicImageUrl("products", p.product_image) ?? ''}
                      alt={p.product_name}
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-blue2">{p.product_name}</div>
                  <div className="text-xs text-muted-foreground">
                    Đã bán: <span className="font-medium">{p.sold_quantity}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {formatVnd(p.revenue)}
                  </div>
                  <div className="text-xs text-muted-foreground">Doanh thu</div>
                </div>
              </div>
            ))}

            {(data ?? []).length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Chưa có dữ liệu bán hàng.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
