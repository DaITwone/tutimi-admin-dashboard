import { getPublicImageUrl } from "@/app/lib/storage";
import { INPUT_UNITS, type BulkType, type InputUnit } from "../bulk.model";

type BulkInventoryCardProps = {
  type: BulkType;
  product: any;
  stock: number;
  qty: number;
  inputValue: string;
  unit: InputUnit;
  onChangeValue: (v: string) => void;
  onChangeUnit: (u: InputUnit) => void;
  onClear: () => void;
  adjustInput: (productId: string, delta: number) => void;
};

export function BulkInventoryCard({
  type,
  product,
  stock,
  qty,
  inputValue,
  unit,
  onChangeValue,
  onChangeUnit,
  onClear,
  adjustInput,
}: BulkInventoryCardProps) {
  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm ${qty > 0 ? "border-blue-200 bg-blue-50/30" : "border-gray-100"}`}>
      <div className="flex gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
          {product.image ? (
            <img
              src={getPublicImageUrl("products", product.image) ?? ""}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 font-bold text-[#1c4273]">{product.name}</div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {stock <= 0 ? (
              <span className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Out of stock</span>
            ) : (
              <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Còn {stock}</span>
            )}

            {qty > 0 ? (
              <span className="rounded-lg bg-[#1b4f94] px-3 py-1 text-xs font-semibold text-white">
                {type === "in" ? "Nhập" : "Xuất"}: {qty}
              </span>
            ) : (
              <span className="text-xs text-gray-400">Chưa chọn</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 items-center gap-2">
        <button
          onClick={() => adjustInput(product.id, -1)}
          className="h-10 rounded-lg border bg-gray-50 text-lg font-semibold hover:bg-gray-100"
        >
          -
        </button>

        <input
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            if (val !== "" && !/^\d*\.?\d*$/.test(val)) return;
            onChangeValue(val);
          }}
          placeholder="0"
          inputMode="decimal"
          className="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 text-center text-sm outline-none focus:border-[#1b4f94]"
        />

        <button
          onClick={() => adjustInput(product.id, 1)}
          className="h-10 rounded-lg border bg-gray-50 text-lg font-semibold hover:bg-gray-100"
        >
          +
        </button>

        <select
          value={unit}
          onChange={(e) => onChangeUnit(e.target.value as InputUnit)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-2 text-sm outline-none focus:border-[#1b4f94]"
        >
          {INPUT_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onClear}
        className="mt-2 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
      >
        Xóa
      </button>
    </div>
  );
}
