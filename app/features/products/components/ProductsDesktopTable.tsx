import { getPublicImageUrl } from '@/app/lib/storage';
import type { Product } from '../types';

type ProductsDesktopTableProps = {
  loading: boolean;
  products: Product[];
  manageMode: boolean;
  selectedIds: string[];
  selectedCount: number;
  isAllChecked: boolean;
  skeletonRows: number;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectOne: (id: string, checked: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function ProductsDesktopTable({
  loading,
  products,
  manageMode,
  selectedIds,
  selectedCount,
  isAllChecked,
  skeletonRows,
  onToggleSelectAll,
  onToggleSelectOne,
  onEdit,
  onDelete,
}: ProductsDesktopTableProps) {
  const colSpan = manageMode ? 5 : 4;

  return (
    <div className="hidden md:block">
      <table className="mt-2 w-full text-sm">
        <thead className="border-b border-border bg-muted/30 text-muted-foreground">
          <tr>
            <th className="w-12 py-3 pl-6 pr-2 text-left">
              {manageMode ? (
                <input
                  type="checkbox"
                  className="scale-125 accent-brand-2"
                  checked={isAllChecked}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                />
              ) : (
                <span>STT</span>
              )}
            </th>

            <th className="py-3 pl-5 pr-2 text-left">
              <div className="flex items-center gap-2">
                <span>Sản phẩm</span>

                {manageMode && (
                  <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                    Đã chọn {selectedCount}
                  </span>
                )}
              </div>
            </th>

            <th className="w-40 px-4 py-3 text-left">Giá</th>
            <th className="w-60 px-4 py-3 text-left">Chỉ số</th>
            <th className="w-40 px-4 py-3 text-left">Trạng thái</th>
            <th className="w-44 px-4 py-3 text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="w-12 py-4 pl-6 pr-2">
                  {manageMode ? <div className="h-4 w-4 rounded bg-muted" /> : <div className="h-4 w-6 rounded bg-muted" />}
                </td>

                <td className="px-4 py-4 align-top">
                  <div className="flex items-center gap-3">
                    <div className="h-20 w-16 rounded-lg bg-muted" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-muted" />
                      <div className="h-3 w-24 rounded bg-muted" />
                    </div>
                  </div>
                </td>

                <td className="w-40 px-4 py-4">
                  <div className="h-4 w-24 rounded bg-muted" />
                </td>

                <td className="w-60 px-4 py-4">
                  <div className="h-4 w-44 rounded bg-muted" />
                </td>

                <td className="w-40 px-4 py-4">
                  <div className="h-4 w-20 rounded bg-muted" />
                </td>

                <td className="w-44 px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <div className="h-7 w-12 rounded bg-muted" />
                    <div className="h-7 w-12 rounded bg-muted" />
                  </div>
                </td>
              </tr>
            ))
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="p-6 text-center text-muted-foreground">
                Chưa có sản phẩm nào
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id} className="hover:bg-muted/30">
                <td className="w-12 py-3 pl-6 pr-2 text-center text-sm font-semibold text-muted-foreground">
                  {manageMode ? (
                    <input
                      type="checkbox"
                      className="scale-125 accent-brand-2"
                      checked={selectedIds.includes(product.id)}
                      onChange={(e) => onToggleSelectOne(product.id, e.target.checked)}
                    />
                  ) : (
                    <span className="text-center">{index + 1}</span>
                  )}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-24 w-20 overflow-hidden rounded-lg bg-muted/30">
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

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold leading-snug text-brand-2">{product.name}</p>

                        {product.is_best_seller && (
                          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:border-green-500/40 dark:bg-green-500/20 dark:text-green-300">
                            Best seller
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="w-40 px-4 py-4">
                  {product.sale_price ? (
                    <div className="space-x-2">
                      <span className="font-semibold text-red-600 dark:text-red-300">
                        {product.sale_price.toLocaleString()}đ
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.price.toLocaleString()}đ
                      </span>
                    </div>
                  ) : (
                    <span className="text-foreground/90">{product.price.toLocaleString()}đ</span>
                  )}
                </td>

                <td className="w-60 px-4 py-4">
                  {product.stats ? (
                    <p className="text-xs text-muted-foreground">{product.stats}</p>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>

                <td className="w-40 px-4 py-4">
                  {product.is_active ? (
                    <span className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className="rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
                      Tạm tắt
                    </span>
                  )}
                </td>

                <td className="w-44 px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(product.id)}
                      className="rounded-md border border-border px-3 py-1 text-sm text-foreground transition hover:bg-muted/50"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => onDelete(product.id)}
                      className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
