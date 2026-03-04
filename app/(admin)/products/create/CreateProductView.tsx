'use client';

import ProductPreview from '@/app/components/ProductPreview';
import { useCreateProduct } from './useCreateProduct';

export default function CreateProductView() {
  const {
    name,
    setName,
    price,
    setPrice,
    salePrice,
    setSalePrice,
    stats,
    setStats,
    isBestSeller,
    setIsBestSeller,
    imageType,
    setImageType,
    setNewImage,
    imageLink,
    setImageLink,
    previewImage,
    saving,
    previewOpen,
    setPreviewOpen,
    handleSubmit,
    handleCancel,
  } = useCreateProduct();

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="max-w-150">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex gap-6 text-sm font-semibold text-brand-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    checked={imageType === 'upload'}
                    onChange={() => setImageType('upload')}
                    className="accent-brand-2"
                  />
                  Upload ảnh
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    checked={imageType === 'link'}
                    onChange={() => setImageType('link')}
                    className="accent-brand-2"
                  />
                  Dán link
                </label>
              </div>

              <div className="flex gap-4">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/40">
                  {previewImage ? (
                    <img src={previewImage} className="h-full w-full object-cover transition-transform hover:scale-105" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </div>

                <div className="flex-1">
                  {imageType === 'upload' ? (
                    <label className="inline-block cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-muted/50">
                      Chọn ảnh
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
                      />
                    </label>
                  ) : (
                    <input
                      value={imageLink}
                      onChange={(e) => setImageLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-brand-2 focus:outline-none focus:ring-2 focus:ring-brand-2/20"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-brand-2">Tên sản phẩm</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-brand-2 focus:outline-none focus:ring-2 focus:ring-brand-2/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-brand-2">Giá gốc</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-brand-2 focus:outline-none focus:ring-2 focus:ring-brand-2/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-brand-2">Giá khuyến mãi</label>
              <input
                type="number"
                value={salePrice ?? ''}
                onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : null)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-brand-2 focus:outline-none focus:ring-2 focus:ring-brand-2/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-brand-2">Trạng thái</label>
              <input
                value={stats}
                onChange={(e) => setStats(e.target.value)}
                placeholder="VD: 5k+ đã bán"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-brand-2 focus:outline-none focus:ring-2 focus:ring-brand-2/20"
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-brand-2">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="accent-brand-2"
              />
              Best seller
            </label>

            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="w-full rounded-xl border border-brand-2 bg-card px-4 py-2 text-sm font-semibold text-brand-2 transition hover:bg-muted/50 lg:hidden"
            >
              Xem preview
            </button>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-muted/50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-1 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-2 disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Tạo sản phẩm'}
              </button>
            </div>
          </form>
        </div>

        <div className="hidden lg:block">
          <ProductPreview
            name={name}
            price={price}
            salePrice={salePrice}
            image={previewImage}
            stats={stats}
            isBestSeller={isBestSeller}
          />
        </div>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreviewOpen(false)} />

          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border border-border bg-card p-4 shadow-2xl">
            <div className="flex justify-center">
              <div className="h-1.5 w-10 rounded-full bg-muted" />
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-brand-2">Trang sản phẩm</div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-border bg-background px-3 py-1 text-sm text-foreground transition hover:bg-muted/50"
              >
                X
              </button>
            </div>

            <ProductPreview
              name={name}
              price={price}
              salePrice={salePrice}
              image={previewImage}
              stats={stats}
              isBestSeller={isBestSeller}
            />
          </div>
        </div>
      )}
    </div>
  );
}
