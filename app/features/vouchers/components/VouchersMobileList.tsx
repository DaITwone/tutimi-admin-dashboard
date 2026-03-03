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
    <div className="space-y-3 px-4 pb-4 pt-3 md:hidden">
      {loading ? (
        <VouchersMobileSkeleton count={5} />
      ) : vouchers.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-sm">
          Chua co voucher nao
        </div>
      ) : (
        vouchers.map((voucher) => (
          <VoucherCard
            key={voucher.code}
            voucher={voucher}
            onEdit={() => onEdit(voucher.code)}
            onDelete={() => onDelete(voucher.code)}
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
      : `${voucher.discount_value.toLocaleString()}d`;

  const minOrderText = voucher.min_order_value
    ? `${voucher.min_order_value.toLocaleString()}d`
    : '--';
  const maxUsageText = voucher.max_usage_per_user ?? '--';

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-mono font-extrabold text-brand-1 dark:text-brand-2">
            {voucher.code}
          </p>

          <p className="mt-1 line-clamp-2 font-bold leading-snug text-brand-2">
            {voucher.title}
          </p>

          {voucher.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {voucher.description}
            </p>
          ) : null}
        </div>

        <span
          className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold ${
            voucher.is_active
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {voucher.is_active ? 'Hoat dong' : 'Tat'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-muted/50 p-3">
          <div className="text-xs text-muted-foreground">Giam</div>
          <div className="mt-1 font-semibold text-foreground/90">{discountText}</div>
        </div>

        <div className="rounded-xl bg-muted/50 p-3">
          <div className="text-xs text-muted-foreground">Don toi thieu</div>
          <div className="mt-1 font-semibold text-foreground/90">{minOrderText}</div>
        </div>

        <div className="rounded-xl bg-muted/50 p-3">
          <div className="text-xs text-muted-foreground">Gioi han</div>
          <div className="mt-1 font-semibold text-foreground/90">{maxUsageText}</div>
        </div>

        <div className="rounded-xl bg-muted/50 p-3">
          <div className="text-xs text-muted-foreground">Doi tuong</div>
          <div className="mt-1">
            {voucher.for_new_user ? (
              <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                Khach moi
              </span>
            ) : (
              <span className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Tat ca
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onEdit}
          className="rounded-xl border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted/50"
        >
          Sua
        </button>

        <button
          onClick={onDelete}
          className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
        >
          Xoa
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
          className="animate-pulse rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
            </div>
            <div className="h-6 w-20 rounded bg-muted" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="h-16 rounded-xl bg-muted" />
            <div className="h-16 rounded-xl bg-muted" />
            <div className="h-16 rounded-xl bg-muted" />
            <div className="h-16 rounded-xl bg-muted" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="h-10 rounded-xl bg-muted" />
            <div className="h-10 rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
