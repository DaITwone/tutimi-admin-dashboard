'use client';

type VoucherPreviewProps = {
  code?: string;
  title?: string;
  description?: string;
  discountType?: 'percent' | 'fixed';
  discountValue?: number | '';
  minOrderValue?: number | '';
  maxUsagePerUser?: number | '';
  forNewUser?: boolean;
  isActive?: boolean;
};

export default function VoucherPreview({
  code,
  title,
  description,
  discountType,
  discountValue,
  minOrderValue,
}: VoucherPreviewProps) {
  const isLoading = !code && !title && !description && !discountValue;

  const hasMinOrder = typeof minOrderValue === 'number' && Number.isFinite(minOrderValue);
  const minOrderText = hasMinOrder ? `${minOrderValue.toLocaleString()}d` : '--';

  const discountText =
    discountType === 'percent'
      ? `${discountValue || 0}%`
      : typeof discountValue === 'number'
        ? `${discountValue.toLocaleString()}d`
        : '--';

  const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse rounded bg-muted ${className}`} />
  );

  return (
    <div className="lg:sticky lg:top-7">
      <div className="mx-auto w-full max-w-90 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
          <span className="rounded-md px-2 py-0.5 text-foreground">08:14</span>
          <span>📶 🔋</span>
        </div>

        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl text-foreground/80">←</span>
            <h3 className="text-lg font-semibold text-brand-2">Kho voucher</h3>
          </div>
          <p className="pl-7 text-sm text-muted-foreground">Săn mã giảm giá mới mỗi ngày</p>
        </div>

        <div className="mt-5 px-4 pb-6">
          <div className="space-y-3 rounded-lg border border-border bg-background/70 p-3">
            <div className="relative pb-8">
              <div className="flex gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                  🏷️
                </div>

                <div className="flex-1 space-y-1">
                  <p
                    className={`text-[15px] font-semibold ${
                      isLoading ? 'h-4 w-2/3 animate-pulse rounded bg-muted' : 'text-brand-2'
                    }`}
                  >
                    {!isLoading && title}
                  </p>

                  <p
                    className={`text-[12px] ${
                      isLoading ? 'h-3 w-full animate-pulse rounded bg-muted' : 'text-muted-foreground'
                    }`}
                  >
                    {!isLoading && description}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[12px] text-muted-foreground">Mã voucher</p>

              <span
                className={`text-[14px] font-bold ${
                  isLoading
                    ? 'inline-block h-4 w-20 animate-pulse rounded bg-muted'
                    : 'text-blue-600 dark:text-blue-300'
                }`}
              >
                {!isLoading && code}
              </span>

              <button className="absolute bottom-0 right-0 rounded-full bg-brand-2 px-4 py-1 text-[12px] text-white transition hover:bg-brand-1">
                Lưu mã
              </button>
            </div>

            <div className={isLoading ? '-mt-3' : 'border-t border-border pt-2 text-[12px] text-muted-foreground'}>
              {!isLoading && `ⓘ Áp dụng cho đơn từ ${minOrderText} - Giảm ${discountText}`}
            </div>
          </div>

          {[1].map((i) => (
            <div key={i} className="mt-4 space-y-3 rounded-lg border border-border bg-background/70 p-3">
              <div className="relative pb-8">
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>

                <Skeleton className="mt-4 h-3 w-24" />
                <Skeleton className="mt-0.5 h-4 w-20" />
                <Skeleton className="absolute bottom-0 right-0 h-7 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>Trang chủ</span>
          <span>Menu</span>
          <span>Tin tức</span>
          <span className="font-medium text-brand-2">Tài khoản</span>
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-muted-foreground">Preview giao diện app</div>
    </div>
  );
}
