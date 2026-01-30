'use client';

import { useEffect, useMemo, useState } from 'react';
import { useInventoryUI } from '@/app/features/inventory/store/inventoryUI';
import { useInventoryTransactions } from '../hooks/useInventory';

type TxFilter = 'ALL' | 'IN' | 'OUT' | 'ADJUST';

function formatDateVN(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN');
  } catch {
    return iso;
  }
}

function getTypeLabel(type: 'IN' | 'OUT' | 'ADJUST') {
  if (type === 'IN') return 'Nhập kho';
  if (type === 'OUT') return 'Xuất kho';
  return 'Điều chỉnh';
}

function getTypeBadgeClass(type: 'IN' | 'OUT' | 'ADJUST') {
  if (type === 'IN') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (type === 'OUT') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-purple-100 text-purple-700 border-purple-200';
}

export default function InventoryHistoryDrawer() {
  const invUI = useInventoryUI();

  const productId = invUI.historyProductId;
  const productName = invUI.historyProductName;

  const [filter, setFilter] = useState<TxFilter>('ALL');

  const { data = [], isLoading, error, refetch } = useInventoryTransactions(productId);

  /* -------------------- ESC TO CLOSE -------------------- */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') invUI.closeHistory();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [invUI]);

  /* -------------------- FILTERED DATA -------------------- */
  const filtered = useMemo(() => {
    if (filter === 'ALL') return data;
    return data.filter((x) => x.type === filter);
  }, [data, filter]);

  /* -------------------- CLOSE ON OVERLAY -------------------- */
  if (!invUI.historyOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={invUI.closeHistory}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-100 bg-white shadow-2xl animate-slide-in">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 pt-3 pb-3">
            <div>
              <h2 className="text-lg font-semibold text-[#1c4273]">
                LỊCH SỬ TỒN KHO
              </h2>
              <p className="text-md italic text-gray-500">
                {productName ? `${productName}` : '---'}
              </p>
            </div>

            <button
              onClick={invUI.closeHistory}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Bộ lọc */}
          <div className="px-4 pt-4">
            <div className="flex flex-nowrap gap-2">
              <button
                onClick={() => setFilter('ALL')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
                  filter === 'ALL'
                    ? 'bg-[#1b4f94] text-white'
                    : 'bg-gray-100 text-[#1c4273]'
                }`}
              >
                Tất cả
              </button>

              <button
                onClick={() => setFilter('IN')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
                  filter === 'IN'
                    ? 'bg-[#1b4f94] text-white'
                    : 'bg-gray-100 text-[#1c4273]'
                }`}
              >
                Nhập kho
              </button>

              <button
                onClick={() => setFilter('OUT')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
                  filter === 'OUT'
                    ? 'bg-[#1b4f94] text-white'
                    : 'bg-gray-100 text-[#1c4273]'
                }`}
              >
                Xuất kho
              </button>

              <button
                onClick={() => setFilter('ADJUST')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
                  filter === 'ADJUST'
                    ? 'bg-[#1b4f94] text-white'
                    : 'bg-gray-100 text-[#1c4273]'
                }`}
              >
                Điều chỉnh
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            {/* Loading */}
            {isLoading && (
              <div className="rounded-xl border bg-white p-4 text-sm text-gray-500">
                Đang tải lịch sử tồn kho...
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">
                  Không thể tải lịch sử tồn kho
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  Thử tải lại
                </button>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !error && filtered.length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                Chưa có giao dịch tồn kho nào.
              </div>
            )}

            {/* List */}
            {!isLoading &&
              !error &&
              filtered.map((tx) => {
                const isPlus = tx.delta > 0;
                const isZero = tx.delta === 0;

                return (
                  <div key={tx.id} className="rounded-xl border bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        {/* Type + date */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getTypeBadgeClass(
                              tx.type
                            )}`}
                          >
                            {getTypeLabel(tx.type)}
                          </span>

                          <span className="text-xs text-gray-400">
                            {formatDateVN(tx.created_at)}
                          </span>
                        </div>

                        {/* Quantities */}
                        <p className="text-sm text-gray-700">
                          Số lượng yêu cầu: <b>{tx.requested_quantity}</b> — Áp dụng:{' '}
                          <b>{tx.applied_quantity}</b>
                        </p>

                        {/* Note */}
                        {tx.note && (
                          <p className="text-xs text-gray-500">
                            Ghi chú: {tx.note}
                          </p>
                        )}
                      </div>

                      {/* Delta */}
                      <div
                        className={`rounded-lg px-3 py-2 text-sm font-bold ${
                          isZero
                            ? 'bg-gray-100 text-gray-600'
                            : isPlus
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                        title="Số lượng thay đổi"
                      >
                        {isZero ? '0' : isPlus ? `+${tx.delta}` : tx.delta}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4">
            <button
              onClick={invUI.closeHistory}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
