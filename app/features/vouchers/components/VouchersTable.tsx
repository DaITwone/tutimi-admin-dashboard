"use client";

import type { Voucher } from "../types";

type VouchersTableProps = {
  vouchers: Voucher[];
  loading: boolean;
  onEdit: (code: string) => void;
  onDelete: (code: string) => void;
  skeletonRows?: number;
};

export default function VouchersTable({
  vouchers,
  loading,
  onEdit,
  onDelete,
  skeletonRows = 5,
}: VouchersTableProps) {
  return (
    <div className="hidden md:block">
      <table className="mt-3 w-full text-sm">
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th className="p-4 text-left">Code</th>
            <th className="p-4 text-left">Tiêu đề</th>
            <th className="p-4 text-left">Giảm</th>
            <th className="p-4 text-left">Đơn tối thiểu</th>
            <th className="p-4 text-left">Giới hạn</th>
            <th className="p-4 text-left">Đối tượng</th>
            <th className="p-4 text-left">Trạng thái</th>
            <th className="px-4.5 text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <TableSkeleton rows={skeletonRows} />
          ) : vouchers.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-center text-muted-foreground">
                Chưa có voucher nào
              </td>
            </tr>
          ) : (
            vouchers.map((voucher) => (
              <VoucherRow
                key={voucher.code}
                voucher={voucher}
                onEdit={() => onEdit(voucher.code)}
                onDelete={() => onDelete(voucher.code)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function VoucherRow({
  voucher,
  onEdit,
  onDelete,
}: {
  voucher: Voucher;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const discountText =
    voucher.discount_type === "percent"
      ? `${voucher.discount_value}%`
      : `${voucher.discount_value.toLocaleString()}d`;

  const minOrderText = voucher.min_order_value
    ? `${voucher.min_order_value.toLocaleString()}d`
    : "--";
  const maxUsageText = voucher.max_usage_per_user ?? "--";

  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="p-4 font-mono font-extrabold text-brand-1 dark:text-brand-2">
        {voucher.code}
      </td>

      <td className="p-4">
        <p className="font-bold text-brand-2">{voucher.title}</p>
        {voucher.description && (
          <p className="text-xs text-muted-foreground">{voucher.description}</p>
        )}
      </td>

      <td className="p-4 text-foreground/80">{discountText}</td>
      <td className="p-4 text-foreground/80">{minOrderText}</td>
      <td className="p-4 text-foreground/80">{maxUsageText}</td>

      <td className="p-4">
        {voucher.for_new_user ? (
          <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
            Khách mới
          </span>
        ) : (
          <span className="rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground">
            Tất cả
          </span>
        )}
      </td>

      <td className="p-4">
        <span
          className={`rounded-lg px-3 py-1 text-sm ${
            voucher.is_active
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
              : "bg-muted text-muted-foreground"
          }`}
        >
         {voucher.is_active ? 'Hoạt động' : 'Tắt'}
        </span>
      </td>

      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            className="rounded-md border border-border px-3 py-1 text-sm text-foreground transition hover:bg-muted/50"
          >
            Sửa
          </button>

          <button
            onClick={onDelete}
            className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
          >
            Xóa
          </button>
        </div>
      </td>
    </tr>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="p-4">
            <div className="h-4 w-24 rounded bg-muted" />
          </td>
          <td className="space-y-2 p-4">
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted" />
          </td>
          <td className="p-4">
            <div className="h-4 w-16 rounded bg-muted" />
          </td>
          <td className="p-4">
            <div className="h-4 w-20 rounded bg-muted" />
          </td>
          <td className="p-4">
            <div className="h-4 w-12 rounded bg-muted" />
          </td>
          <td className="p-4">
            <div className="h-6 w-20 rounded-full bg-muted" />
          </td>
          <td className="p-4">
            <div className="h-6 w-20 rounded-full bg-muted" />
          </td>
          <td className="p-4 text-right">
            <div className="flex justify-end gap-2">
              <div className="h-7 w-12 rounded bg-muted" />
              <div className="h-7 w-12 rounded bg-muted" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
