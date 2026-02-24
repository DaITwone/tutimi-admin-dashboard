import { Search } from "lucide-react";
import { QuantityHintPopover } from "./QuantityHintPopover";

type BulkSearchSectionProps = {
  search: string;
  selectedCount: number;
  onChangeSearch: (value: string) => void;
};

export function BulkSearchSection({ search, selectedCount, onChangeSearch }: BulkSearchSectionProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <input
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-[#1b4f94] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Tổng sản phẩm:</span>
          <span className="rounded-lg bg-blue-50 px-3 py-1 text-md font-semibold text-[#1b4f94]">{selectedCount}</span>
          <div className="sm:hidden">
            <QuantityHintPopover side="bottom" align="center" />
          </div>
        </div>
      </div>
    </div>
  );
}
