"use client";

import { Search } from "lucide-react";

type InventoryToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onBulkIn: () => void;
  onBulkOut: () => void;
  onOpenHistoryPage: () => void;
};

export function InventoryToolbar({
  search,
  onSearchChange,
  onBulkIn,
  onBulkOut,
  onOpenHistoryPage,
}: InventoryToolbarProps) {
  return (
    <div className="mx-4 mt-4.5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:flex-wrap sm:items-center">
        <button
          onClick={onBulkIn}
          className="w-full rounded-lg bg-brand-2 px-4 py-2 text-white transition hover:bg-brand-1 sm:w-auto"
        >
          Nhập Hàng
        </button>

        <button
          onClick={onBulkOut}
          className="w-full rounded-lg border border-border bg-card px-4 py-2 font-semibold text-brand-1 transition hover:bg-muted/50 dark:text-brand-2 sm:w-auto"
        >
          Xuất Hàng
        </button>

        <button
          onClick={onOpenHistoryPage}
          className="col-span-2 w-full rounded-lg border border-border bg-card px-4 py-2 font-semibold text-brand-1 transition hover:bg-muted/50 dark:text-brand-2 sm:col-span-1 sm:w-auto"
        >
          Phiếu In
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <div className="relative w-full md:w-72">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={16} />
          </span>

          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted/40 py-2 pl-10 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-brand-2 focus:bg-background"
          />
        </div>
      </div>
    </div>
  );
}
