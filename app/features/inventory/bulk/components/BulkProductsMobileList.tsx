import type { BulkType, InputUnit, RowState } from "../bulk.model";
import { BulkInventoryCard } from "./BulkInventoryCard";
import { BulkMobileSkeleton } from "./BulkMobileSkeleton";

type BulkProductsMobileListProps = {
  type: BulkType;
  products: any[];
  rowById: Record<string, RowState>;
  isLoading: boolean;
  setRow: (productId: string, patch: Partial<RowState>) => void;
  clearRow: (productId: string) => void;
  adjustInput: (productId: string, delta: number) => void;
};

export function BulkProductsMobileList({
  type,
  products,
  rowById,
  isLoading,
  setRow,
  clearRow,
  adjustInput,
}: BulkProductsMobileListProps) {
  return (
    <div className="space-y-3 p-4 md:hidden">
      {isLoading ? (
        <BulkMobileSkeleton count={6} />
      ) : products.length === 0 ? (
        <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">Không có sản phẩm</div>
      ) : (
        products.map((p) => {
          const stock = p.stock_quantity ?? 0;
          const row = rowById[p.id];
          const qty = row?.qty ?? 0;
          const inputValue = row?.inputValue ?? "";
          const unit = row?.unit ?? "ML";

          return (
            <BulkInventoryCard
              key={p.id}
              type={type}
              product={p}
              stock={stock}
              qty={qty}
              inputValue={inputValue}
              unit={unit}
              onChangeValue={(val) => setRow(p.id, { inputValue: val })}
              onChangeUnit={(u) => setRow(p.id, { unit: u as InputUnit })}
              onClear={() => clearRow(p.id)}
              adjustInput={adjustInput}
            />
          );
        })
      )}
    </div>
  );
}
