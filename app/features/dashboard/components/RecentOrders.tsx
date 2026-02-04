import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardRecentOrder, OrderStatus } from "../types/dashboard";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

function formatVnd(n: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n);
}

function getStatusMeta(status: OrderStatus) {
  switch (status) {
    case "confirmed":
      return { label: "Đã xác nhận", variant: "secondary" as const, className: "bg-blue2 text-white hover:bg-blue1" };
    case "completed":
      return { label: "Hoàn thành", variant: "default" as const, className: "bg-green-600 text-white hover:bg-green-600", };
    case "cancelled":
      return { label: "Đã huỷ", variant: "destructive" as const };
    default:
      return { label: status, variant: "outline" as const };
  }
}

export function RecentOrders({
  data,
  isLoading,
}: {
  data?: DashboardRecentOrder[];
  isLoading: boolean;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-blue1 font-bold">Đơn hàng gần đây</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full rounded-xl" />
            <Skeleton className="h-8 w-full rounded-xl" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Tổng</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {(data ?? []).map((order) => {
                const meta = getStatusMeta(order.status);

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-blue2">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{formatTime(order.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant={meta.variant} className={meta.className}>{meta.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatVnd(order.total_price)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {!isLoading && (!data || data.length === 0) && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Chưa có đơn hàng nào.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
