import { getPublicImageUrl } from '@/app/lib/storage';
import type { Product } from '../types';

type ProductCardProps = {
  product: Product;
  manageMode: boolean;
  checked: boolean;
  onToggleChecked: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ProductCard({
  product,
  manageMode,
  checked,
  onToggleChecked,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const price = product.sale_price ?? product.price;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {manageMode && (
          <input
            type="checkbox"
            className="mt-1 scale-125 accent-brand-2"
            checked={checked}
            onChange={(e) => onToggleChecked(e.target.checked)}
          />
        )}

        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-muted/30">
          {product.image ? (
            <img
              src={getPublicImageUrl('products', product.image) ?? ''}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="line-clamp-2 font-bold leading-snug text-brand-2">{product.name}</p>

            {product.is_best_seller && (
              <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:border-green-500/40 dark:bg-green-500/20 dark:text-green-300">
                Best seller
              </span>
            )}
          </div>

          {product.stats ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.stats}</p> : null}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            {product.sale_price ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-600 dark:text-red-300">
                  {product.sale_price.toLocaleString()}đ
                </span>
                <span className="text-xs text-muted-foreground line-through">{product.price.toLocaleString()}đ</span>
              </div>
            ) : (
              <span className="font-semibold text-foreground/90">{price.toLocaleString()}đ</span>
            )}
          </div>

          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              product.is_active
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {product.is_active ? 'Đang hoạt động' : 'Tạm tắt'}
          </span>
        </div>

        {!manageMode && (
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onEdit}
              className="flex-1 rounded-xl border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted/50"
            >
              Sửa
            </button>

            <button
              onClick={onDelete}
              className="flex-1 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
