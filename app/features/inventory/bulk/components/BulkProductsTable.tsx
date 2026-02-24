import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { getPublicImageUrl } from "@/app/lib/storage";
import { INPUT_UNITS, type BulkType, type InputUnit, type RowState, type SortDirection } from "../bulk.model";
import { QuantityHintPopover } from "./QuantityHintPopover";

type BulkProductsTableProps = {
  type: BulkType;
  products: any[];
  rowById: Record<string, RowState>;
  isLoading: boolean;
  sortStock: SortDirection;
  onToggleStockSort: () => void;
  setRow: (productId: string, patch: Partial<RowState>) => void;
  clearRow: (productId: string) => void;
  adjustInput: (productId: string, delta: number) => void;
};

export function BulkProductsTable({
  type,
  products,
  rowById,
  isLoading,
  sortStock,
  onToggleStockSort,
  setRow,
  clearRow,
  adjustInput,
}: BulkProductsTableProps) {
  return (
    <div className="hidden md:block">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50 text-gray-600">
          <tr>
            <th className="w-105 px-4 py-3 text-left">Sản phẩm</th>
            <th
              onClick={onToggleStockSort}
              className="group w-72 cursor-pointer select-none px-4 py-3 text-left text-gray-600 hover:text-[#1b4f94]"
            >
              <div className="inline-flex items-center gap-1">
                <span>Tồn hiện tại</span>
                <span className="flex h-4 w-4 items-center justify-center">
                  {sortStock === null && (
                    <ChevronsUpDown size={14} className="opacity-50 transition-opacity group-hover:opacity-100" />
                  )}
                  {sortStock === "asc" && <ChevronUp size={14} />}
                  {sortStock === "desc" && <ChevronDown size={14} />}
                </span>
              </div>
            </th>
            <th className="w-32 px-4 py-3 text-left">
              <div className="inline-flex items-center gap-1">
                <span>Số lượng</span>
                <QuantityHintPopover />
              </div>
            </th>
            <th className="w-48 px-4 py-3 text-right">
              {type === "in" ? "Nhập" : "Xuất"} kho ({type === "in" ? "IN" : "OUT"})
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-20 w-20 rounded-lg bg-gray-200" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-48 rounded bg-gray-200" />
                      <div className="h-3 w-28 rounded bg-gray-200" />
                    </div>
                  </div>
                </td>

                <td className="px-4 py-6">
                  <div className="h-9 w-28 rounded-lg bg-gray-200" />
                </td>

                <td className="px-4 py-4">
                  <div className="flex w-72 items-center gap-2">
                    <div className="h-9 w-14 rounded-lg bg-gray-200" />
                    <div className="h-9 w-20 rounded-lg bg-gray-200" />
                    <div className="h-9 w-16 rounded-lg bg-gray-200" />
                  </div>
                </td>

                <td className="pr-4 py-4 text-right">
                  <div className="ml-auto h-9 w-14 rounded-lg bg-gray-200" />
                </td>
              </tr>
            ))
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-center text-gray-500">
                Không có sản phẩm
              </td>
            </tr>
          ) : (
            products.map((p) => {
              const stock = p.stock_quantity ?? 0;
              const row = rowById[p.id];
              const qty = row?.qty ?? 0;
              const inputValue = row?.inputValue ?? "";
              const unit = row?.unit ?? "ML";

              return (
                <tr key={p.id} className={qty > 0 ? "bg-blue-50/30" : "hover:bg-gray-50"}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-50">
                        {p.image ? (
                          <img
                            src={getPublicImageUrl("products", p.image) ?? ""}
                            alt={p.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No image</div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-[#1c4273]">{p.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-6">
                    {stock <= 0 ? (
                      <span className="rounded-lg bg-red-100 px-3 py-2.5 text-xs font-semibold text-red-700">Out of stock</span>
                    ) : (
                      <span className="rounded-lg bg-blue-100 px-3 py-2.5 text-xs font-semibold text-blue-700">Còn {stock}</span>
                    )}
                  </td>

                  <td className="px-4">
                    <div className="flex w-72 items-center gap-2">
                      <button
                        onClick={() => adjustInput(p.id, -1)}
                        className="h-9 w-9 rounded-lg border bg-gray-50 text-lg hover:bg-gray-100"
                      >
                        -
                      </button>

                      <input
                        value={inputValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== "" && !/^\d*\.?\d*$/.test(val)) return;
                          setRow(p.id, { inputValue: val });
                        }}
                        placeholder="0"
                        inputMode="decimal"
                        className="w-12 rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-center text-sm outline-none focus:border-[#1b4f94]"
                      />

                      <button
                        onClick={() => adjustInput(p.id, 1)}
                        className="h-9 w-9 rounded-lg border bg-gray-50 text-lg hover:bg-gray-100"
                      >
                        +
                      </button>

                      <select
                        value={unit}
                        onChange={(e) => setRow(p.id, { unit: e.target.value as InputUnit })}
                        className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#1b4f94]"
                      >
                        {INPUT_UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => clearRow(p.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>

                  <td className="pr-4.5 py-4 text-right">
                    {qty > 0 ? (
                      <span className="rounded-lg bg-[#1b4f94] px-3 py-2 text-sm font-semibold text-white">{qty}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
