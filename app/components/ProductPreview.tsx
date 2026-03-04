'use client';

import { useEffect, useMemo } from 'react';

type ProductPreviewProps = {
  name: string;
  price: number | '';
  salePrice: number | null;
  image: File | string | null;
  stats: string;
  isBestSeller: boolean;
};

export default function ProductPreview({
  name,
  price,
  salePrice,
  image,
  stats,
  isBestSeller,
}: ProductPreviewProps) {
  const imageUrl = useMemo(() => {
    if (image instanceof File) return URL.createObjectURL(image);
    if (typeof image === 'string') return image;
    return null;
  }, [image]);

  useEffect(() => {
    return () => {
      if (image instanceof File && imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image, imageUrl]);

  return (
    <div className="lg:sticky lg:top-7">
      <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
          <span>18:39</span>
          <span>📶 🔋</span>
        </div>

        <div className="px-4 pb-2">
          <h3 className="text-lg font-semibold text-brand-2">Thực đơn</h3>
          <p className="text-sm text-muted-foreground">Chọn món bạn yêu thích ☕</p>
        </div>

        <div className="scrollbar-hide flex flex-nowrap gap-2 overflow-x-auto px-4 pb-4">
          {['Tất cả', 'Cà Phê', 'Trà Sữa', 'Matcha'].map((item, i) => (
            <div
              key={item}
              className={`flex h-8 shrink-0 items-center justify-center rounded-full px-3 text-center text-xs leading-tight shadow-sm ${
                i === 0 ? 'bg-brand-2 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="space-y-5 px-4 pb-6">
          <div className="flex items-start gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-lg bg-muted">
              {imageUrl ? (
                <img src={imageUrl} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-1">
                {name || 'Tên sản phẩm'}
                {isBestSeller && (
                  <span className="ml-2 rounded-2xl bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-500/20 dark:text-green-300">
                    Best seller
                  </span>
                )}
              </p>

              <p className="text-xs text-muted-foreground">{stats || '0 đã bán | 0 lượt thích'}</p>

              <div className="mt-1 flex items-center gap-2">
                {salePrice && price ? (
                  <>
                    <span className="text-xs text-muted-foreground line-through">{price.toLocaleString()}đ</span>
                    <span className="font-semibold text-red-500">{salePrice.toLocaleString()}đ</span>
                  </>
                ) : price ? (
                  <span className="font-semibold text-red-500">{price.toLocaleString()}đ</span>
                ) : (
                  <span className="font-semibold text-red-500">0đ</span>
                )}
              </div>
            </div>

            <button type="button" className="h-6 w-5 rounded-lg bg-brand-2 text-white">
              +
            </button>
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="flex animate-pulse items-start gap-3">
              <div className="h-14 w-14 rounded-lg bg-muted" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
              </div>

              <div className="h-9 w-9 rounded-lg bg-muted" />
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span>Trang chủ</span>
          <span className="font-medium text-brand-2">Menu</span>
          <span>Tin tức</span>
          <span>Tài khoản</span>
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-muted-foreground">Preview giao diện app</div>
    </div>
  );
}
