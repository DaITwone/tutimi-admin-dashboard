"use client";

import { InventoryDesktopTable } from "@/app/features/inventory/components/InventoryDesktopTable";
import { InventoryMobileList } from "@/app/features/inventory/components/InventoryMobileList";
import { InventoryToolbar } from "@/app/features/inventory/components/InventoryToolbar";
import type { Category, Product, SortKey, SortOrder } from "@/app/features/inventory/types";

type InventoryPageViewProps = {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  error: string | null;
  loading: boolean;
  rows: Product[];
  search: string;
  onSearchChange: (value: string) => void;
  sortKey: SortKey | null;
  sortOrder: SortOrder;
  onToggleSort: (key: SortKey) => void;
  onBulkIn: () => void;
  onBulkOut: () => void;
  onOpenHistoryPage: () => void;
  onOpenHistory: (productId: string) => void;
};

export function InventoryPageView({
  categories,
  activeCategory,
  onCategoryChange,
  error,
  loading,
  rows,
  search,
  onSearchChange,
  sortKey,
  sortOrder,
  onToggleSort,
  onBulkIn,
  onBulkOut,
  onOpenHistoryPage,
  onOpenHistory,
}: InventoryPageViewProps) {
  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 -mx-6 bg-gray-50 px-6">
        <div className="flex gap-2 overflow-x-auto py-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
              activeCategory === "all"
                ? "bg-[#1b4f94] text-white"
                : "bg-gray-100 text-[#1c4273]"
            }`}
          >
            Tất cả
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
                activeCategory === cat.id
                  ? "bg-[#1b4f94] text-white"
                  : "bg-gray-100 text-[#1c4273]"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <InventoryToolbar
          search={search}
          onSearchChange={onSearchChange}
          onBulkIn={onBulkIn}
          onBulkOut={onBulkOut}
          onOpenHistoryPage={onOpenHistoryPage}
        />

        <InventoryMobileList
          loading={loading}
          rows={rows}
          onOpenHistory={onOpenHistory}
        />

        <InventoryDesktopTable
          loading={loading}
          rows={rows}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onToggleSort={onToggleSort}
          onOpenHistory={onOpenHistory}
        />
      </div>
    </div>
  );
}
