'use client';

import type { Voucher } from '../types';

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
        <thead className="border-b text-gray-500">
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
              <td colSpan={7} className="p-6 text-center text-gray-500">
                Chưa có voucher nào
              </td>
            </tr>
          ) : (
            vouchers.map((v) => (
              <VoucherRow
                key={v.code}
                voucher={v}
                onEdit={() => onEdit(v.code)}
                onDelete={() => onDelete(v.code)}
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
  return (
    <tr className="border-t border-gray-300 hover:bg-gray-50">
      <td className="p-4 font-mono font-extrabold text-[#1c4273]">
        {voucher.code}
      </td>

      <td className="p-4">
        <p className="font-bold text-[#1b4f94]">{voucher.title}</p>
        {voucher.description && (
          <p className="text-xs text-gray-400">{voucher.description}</p>
        )}
      </td>

      <td className="p-4">
        {voucher.discount_type === 'percent'
          ? `${voucher.discount_value}%`
          : `${voucher.discount_value.toLocaleString()}đ`}
      </td>

      <td className="p-4">
        {voucher.min_order_value
          ? `${voucher.min_order_value.toLocaleString()}đ`
          : '—'}
      </td>

      <td className="p-4">{voucher.max_usage_per_user ?? '—'}</td>

      <td className="p-4">
        {voucher.for_new_user ? (
          <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">
            Khách mới
          </span>
        ) : (
          <span className="rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-600">
            Tất cả
          </span>
        )}
      </td>

      <td className="p-4">
        <span
          className={`rounded-lg px-3 py-1 text-sm ${
            voucher.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {voucher.is_active ? 'Hoạt động' : 'Tắt'}
        </span>
      </td>

      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            className="rounded-md border border-gray-400 px-3 py-1 text-sm hover:bg-gray-50"
          >
            Sửa
          </button>

          <button
            onClick={onDelete}
            className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
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
            <div className="h-4 w-24 rounded bg-gray-200" />
          </td>
          <td className="p-4 space-y-2">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="h-3 w-28 rounded bg-gray-200" />
          </td>
          <td className="p-4">
            <div className="h-4 w-16 rounded bg-gray-200" />
          </td>
          <td className="p-4">
            <div className="h-4 w-20 rounded bg-gray-200" />
          </td>
          <td className="p-4">
            <div className="h-4 w-12 rounded bg-gray-200" />
          </td>
          <td className="p-4">
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </td>
          <td className="p-4">
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </td>
          <td className="p-4 text-right">
            <div className="flex justify-end gap-2">
              <div className="h-7 w-12 rounded bg-gray-200" />
              <div className="h-7 w-12 rounded bg-gray-200" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
