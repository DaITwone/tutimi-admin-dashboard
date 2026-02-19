'use client';

import type { Voucher } from '../types';

type VouchersMobileListProps = {
  vouchers: Voucher[];
  loading: boolean;
  onEdit: (code: string) => void;
  onDelete: (code: string) => void;
};

export default function VouchersMobileList({
  vouchers,
  loading,
  onEdit,
  onDelete,
}: VouchersMobileListProps) {
  return (
    <div className="md:hidden px-4 pb-4 pt-3 space-y-3">
      {loading ? (
        <VouchersMobileSkeleton count={5} />
      ) : vouchers.length === 0 ? (
        <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">
          Chưa có voucher nào
        </div>
      ) : (
        vouchers.map((v) => (
          <VoucherCard
            key={v.code}
            voucher={v}
            onEdit={() => onEdit(v.code)}
            onDelete={() => onDelete(v.code)}
          />
        ))
      )}
    </div>
  );
}

function VoucherCard({
  voucher,
  onEdit,
  onDelete,
}: {
  voucher: Voucher;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const discountText =
    voucher.discount_type === 'percent'
      ? `${voucher.discount_value}%`
      : `${voucher.discount_value.toLocaleString()}đ`;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono font-extrabold text-[#1c4273] truncate">
            {voucher.code}
          </p>

          <p className="mt-1 font-bold text-[#1b4f94] leading-snug line-clamp-2">
            {voucher.title}
          </p>

          {voucher.description ? (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {voucher.description}
            </p>
          ) : null}
        </div>

        <span
          className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${
            voucher.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {voucher.is_active ? 'Hoạt động' : 'Tắt'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="text-xs text-gray-500">Giảm</div>
          <div className="mt-1 font-semibold text-gray-800">{discountText}</div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="text-xs text-gray-500">Đơn tối thiểu</div>
          <div className="mt-1 font-semibold text-gray-800">
            {voucher.min_order_value
              ? `${voucher.min_order_value.toLocaleString()}đ`
              : '—'}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="text-xs text-gray-500">Giới hạn</div>
          <div className="mt-1 font-semibold text-gray-800">
            {voucher.max_usage_per_user ?? '—'}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="text-xs text-gray-500">Đối tượng</div>
          <div className="mt-1">
            {voucher.for_new_user ? (
              <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                Khách mới
              </span>
            ) : (
              <span className="rounded-lg bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                Tất cả
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onEdit}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Sửa
        </button>

        <button
          onClick={onDelete}
          className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

function VouchersMobileSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-200" />
            </div>

            <div className="h-6 w-20 rounded bg-gray-200" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="h-16 rounded-xl bg-gray-200" />
            <div className="h-16 rounded-xl bg-gray-200" />
            <div className="h-16 rounded-xl bg-gray-200" />
            <div className="h-16 rounded-xl bg-gray-200" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="h-10 rounded-xl bg-gray-200" />
            <div className="h-10 rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
