import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  DashboardInventorySummary,
  DashboardRecentInventoryTransaction,
} from "../types/dashboard";

type BucketType = "day" | "week" | "month" | "year";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

function getTypeLabel(type: "IN" | "OUT") {
  return type === "IN" ? "Nhập" : "Xuất";
}

function getTitleByBucket(bucketType: BucketType) {
  switch (bucketType) {
    case "day":
      return "Kho hàng (ngày)";
    case "week":
      return "Kho hàng (tuần)";
    case "month":
      return "Kho hàng (tháng)";
    case "year":
      return "Kho hàng (năm)";
    default:
      return "Kho hàng";
  }
}

export function InventorySummaryCard({
  summary,
  recentTransactions,
  isLoadingSummary,
  isLoadingRecent,
  bucketType = "day",
}: {
  summary?: DashboardInventorySummary;
  recentTransactions?: DashboardRecentInventoryTransaction[];
  isLoadingSummary: boolean;
  isLoadingRecent: boolean;
  bucketType?: BucketType;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-blue1 font-bold">
          {getTitleByBucket(bucketType)}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border p-3">
            <div className="text-xs text-muted-foreground">Tổng nhập</div>
            {isLoadingSummary ? (
              <Skeleton className="mt-2 h-6 w-16 rounded-lg" />
            ) : (
              <div className="mt-1 text-lg font-semibold">
                {summary?.totalIn ?? 0}
              </div>
            )}
          </div>

          <div className="rounded-xl border p-3">
            <div className="text-xs text-muted-foreground">Tổng xuất</div>
            {isLoadingSummary ? (
              <Skeleton className="mt-2 h-6 w-16 rounded-lg" />
            ) : (
              <div className="mt-1 text-lg font-semibold">
                {summary?.totalOut ?? 0}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium">Giao dịch gần đây</div>

          {isLoadingRecent ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full rounded-xl" />
              <Skeleton className="h-9 w-full rounded-xl" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          ) : (
            <div className="space-y-2">
              {(recentTransactions ?? []).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-blue2">
                      {tx.product_name ?? "Unknown product"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(tx.created_at)}
                      {tx.note ? ` • ${tx.note}` : ""}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">
                      {getTypeLabel(tx.type)} {tx.applied_quantity}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Delta: {tx.delta}
                    </div>
                  </div>
                </div>
              ))}

              {(recentTransactions ?? []).length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Chưa có giao dịch kho.
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
