'use client';

import { Search } from 'lucide-react';

type VouchersHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
};

export default function VouchersHeader({
  search,
  onSearchChange,
  onCreate,
}: VouchersHeaderProps) {
  return (
    <div className="mx-4 mt-4.5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <button
        onClick={onCreate}
        className="w-full md:w-auto rounded-lg bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273]"
      >
        + Thêm voucher
      </button>

      <div className="relative w-full md:w-72">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={16} />
        </span>

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm voucher..."
          className="
            w-full rounded-lg border border-gray-300 bg-gray-50
            py-2 pl-10 pr-3 text-sm
            focus:border-[#1b4f94]
            focus:bg-white
            outline-none
          "
        />
      </div>
    </div>
  );
}
