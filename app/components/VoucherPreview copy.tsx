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



export default function VoucherPreview({ }: VoucherPreviewProps) {
  const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
  );
  
  return (
    <div className="sticky top-7">
      <div className="mx-auto w-90 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-xl">
        {/* STATUS BAR */}
        <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
          <span className="rounded-md px-2 py-0.5 text-black">
            08:14
          </span>
          <span>📶 🔋</span>
        </div>

        {/* HEADER */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">←</span>
            <h3 className="text-lg font-semibold text-[#1b4f94]">
              Kho voucher
            </h3>
          </div>
          <p className="pl-7 text-sm text-gray-500">
            Săn mã giảm giá mới mỗi ngày
          </p>
        </div>

        {/* VOUCHER LIST */}
        <div className="space-y-4 px-4 mt-5 pb-6">
          {/* VOUCHER  */}
          <div className="space-y-3 border border-gray-400 p-3 rounded-lg">
            <div className="relative gap-3 pb-8">
              <div className="flex gap-2">
                {/* ICON */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  🏷️
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-[#1b4f94]">
                    Giảm 10% đơn từ 100K
                  </p>

                  <p className="text-[12px] text-gray-500">
                    Giảm 10% cho đơn hàng có giá trị từ 100.000đ
                  </p>
                </div>

              </div>

              <p className="mt-4 text-[12px] text-gray-400">
                Mã voucher
              </p>
              <span className="text-[14px] font-bold text-blue-600">
                ORDER100
              </span>

              {/* ACTION – bottom right */}
              <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 px-4 py-1 text-[12px] text-white">
                Lưu mã
              </button>
            </div>

            <div className="border-t pt-2 text-[12px] text-gray-400">
              ⓘ Áp dụng cho đơn từ 100.000đ
            </div>
          </div>

          {/* SKELETON VOUCHERS */}
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>

                <Skeleton className="h-9 w-20 rounded-full" />
              </div>

              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>

        {/* BOTTOM TAB */}
        <div className="border-t px-4 py-3 flex justify-between text-xs text-gray-400">
          <span>Trang chủ</span>
          <span>Menu</span>
          <span>Tin tức</span>
          <span className="font-medium text-[#1b4f94]">
            Tài khoản
          </span>
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-gray-400">
        Preview giao diện app
      </div>
    </div>
  );
}
