import { Power, Search } from 'lucide-react';

type ProductsToolbarProps = {
  bulkLoading: boolean;
  manageMode: boolean;
  search: string;
  statusFilter: 'all' | 'on' | 'off';
  onAdd: () => void;
  onClearSelection: () => void;
  onManageToggle: () => void;
  onSearchChange: (value: string) => void;
  onStatusAll: () => void;
  onStatusToggle: () => void;
  onBulkOn: () => void;
  onBulkOff: () => void;
};

export default function ProductsToolbar({
  bulkLoading,
  manageMode,
  search,
  statusFilter,
  onAdd,
  onClearSelection,
  onManageToggle,
  onSearchChange,
  onStatusAll,
  onStatusToggle,
  onBulkOn,
  onBulkOff,
}: ProductsToolbarProps) {
  return (
    <div className="mx-4 mt-4.5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="mt-4.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          onClick={onAdd}
          className="w-full rounded-lg border border-[#1b4f94] bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273] sm:w-auto"
        >
          + Thêm sản phẩm
        </button>

        <button
          onClick={onManageToggle}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border p-2 transition sm:w-auto ${
            manageMode ? 'bg-white text-[#1b4f94]' : 'bg-[#1b4f94] text-white'
          }`}
        >
          <Power size={18} />
          Bật/Tắt món
        </button>

        {manageMode && (
          <div className="hidden gap-1 md:flex">
            <button
              disabled={bulkLoading}
              onClick={onBulkOn}
              className="rounded-lg bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
            >
              {bulkLoading ? 'Đang xử lý...' : 'ON'}
            </button>

            <button
              disabled={bulkLoading}
              onClick={onBulkOff}
              className="rounded-lg bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            >
              {bulkLoading ? 'Đang xử lý...' : 'OFF'}
            </button>

            <button
              onClick={onClearSelection}
              className="rounded-lg border border-gray-400 bg-white px-2 py-2 text-sm text-gray-500 hover:bg-gray-50"
            >
              Bỏ chọn
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:mt-4.5 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>

          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-[#1b4f94] focus:bg-white"
          />
        </div>

        {manageMode && (
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              onClick={onStatusAll}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
                statusFilter === 'all' ? 'bg-[#1b4f94] text-white' : 'bg-white text-gray-500'
              }`}
            >
              All
            </button>

            <button
              onClick={onStatusToggle}
              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm shadow-sm transition ${
                statusFilter === 'all'
                  ? 'border-gray-200 bg-white text-gray-500'
                  : statusFilter === 'on'
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-red-600 bg-red-600 text-white'
              }`}
            >
              <div
                className={`relative h-5 w-10 rounded-full transition ${
                  statusFilter === 'all' ? 'bg-gray-300' : 'bg-white/30'
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                    statusFilter === 'on' ? 'left-5' : 'left-1'
                  }`}
                />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
