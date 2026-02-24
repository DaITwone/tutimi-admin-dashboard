import ProductCard from './ProductCard';
import ProductsMobileSkeleton from './ProductsMobileSkeleton';
import type { Product } from '../types';

type ProductsMobileListProps = {
  bulkLoading: boolean;
  loading: boolean;
  manageMode: boolean;
  products: Product[];
  selectedIds: string[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSelectOne: (id: string, checked: boolean) => void;
  onBulkOn: () => void;
  onBulkOff: () => void;
};

export default function ProductsMobileList({
  bulkLoading,
  loading,
  manageMode,
  products,
  selectedIds,
  onEdit,
  onDelete,
  onToggleSelectOne,
  onBulkOn,
  onBulkOff,
}: ProductsMobileListProps) {
  return (
    <>
      <div className="space-y-3 px-4 pb-4 pt-3 md:hidden">
        {loading ? (
          <ProductsMobileSkeleton count={5} manageMode={manageMode} />
        ) : products.length === 0 ? (
          <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">
            Chưa có sản phẩm nào
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              manageMode={manageMode}
              checked={selectedIds.includes(product.id)}
              onToggleChecked={(checked) => onToggleSelectOne(product.id, checked)}
              onEdit={() => onEdit(product.id)}
              onDelete={() => onDelete(product.id)}
            />
          ))
        )}
      </div>

      {manageMode && (
        <div className="sticky bottom-0 z-20 -mx-4 bg-[#F7F8FB] px-4 pb-3 pt-2 md:hidden">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
            <div className="text-sm text-gray-700">
              Đã chọn <b>{selectedIds.length}</b>
            </div>

            <div className="flex gap-2">
              <button
                disabled={bulkLoading || selectedIds.length === 0}
                onClick={onBulkOn}
                className="rounded-xl bg-green-600 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                {bulkLoading ? '...' : 'ON'}
              </button>

              <button
                disabled={bulkLoading || selectedIds.length === 0}
                onClick={onBulkOff}
                className="rounded-xl bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                {bulkLoading ? '...' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
