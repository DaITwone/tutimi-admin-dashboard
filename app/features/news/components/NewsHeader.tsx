'use client';

import { Search } from 'lucide-react';

type NewsHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
};

export default function NewsHeader({
  search,
  onSearchChange,
  onCreate,
}: NewsHeaderProps) {
  return (
    <div className="mx-4 mt-4.5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <button
        onClick={onCreate}
        className="w-full rounded-lg bg-brand-2 px-4 py-2 text-white transition hover:bg-brand-1 md:w-auto"
      >
        + Thêm tin tức
      </button>

      <div className="relative w-full md:w-72">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={16} />
        </span>

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm tin tức..."
          className="w-full rounded-lg border border-border bg-muted/30 py-2 pl-10 pr-3 text-sm text-foreground outline-none focus:border-brand-2 focus:bg-card"
        />
      </div>
    </div>
  );
}
