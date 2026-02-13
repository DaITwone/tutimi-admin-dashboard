'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/app/lib/supabase';
import { useInventoryUI } from '@/app/features/inventory/store/inventoryUI';

type TxFilter = 'ALL' | 'IN' | 'OUT';

type ProductLite = {
  id: string;
  name: string;
  stock_quantity: number;
  measure_value: number | null;
  measure_unit: string | null;
};

type InventoryTx = {
  id: string;
  product_id: string;
  receipt_id: string | null;
  type: 'IN' | 'OUT' | 'ADJUST';
  requested_quantity: number;
  applied_quantity: number;
  delta: number;
  note: string | null;
  input_value: number | null;
  input_unit: string | null;
  created_at: string;
};

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
  return 'Khác';
}

function getTypeBadgeClass(type: 'IN' | 'OUT' | 'ADJUST') {
  if (type === 'IN') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (type === 'OUT') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
}


export default function InventoryHistoryDrawer() {
  const invUI = useInventoryUI();
  const productId = invUI.historyProductId;

  const [filter, setFilter] = useState<TxFilter>('ALL');

  /* -------------------- ESC TO CLOSE -------------------- */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') invUI.closeHistory();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [invUI]);

  /* ===================== QUERY: PRODUCT INFO ===================== */
  const {
    data: product,
    isLoading: loadingProduct,
    error: productError,
  } = useQuery({
    queryKey: ['inventory-product', productId],
    enabled: !!productId && invUI.historyOpen,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id,name,stock_quantity,measure_value,measure_unit')
        .eq('id', productId!)
        .single();

      if (error) throw error;
      return data as ProductLite;
    },
    staleTime: 1000 * 20,
  });

  /* ===================== QUERY: TRANSACTIONS ===================== */
  const {
    data: transactions = [],
    isLoading: loadingTx,
    error: txError,
    refetch,
  } = useQuery({
    queryKey: ['inventory-transactions', productId],
    enabled: !!productId && invUI.historyOpen,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select(
          'id,product_id,receipt_id,type,requested_quantity,applied_quantity,delta,note,input_value,input_unit,created_at'
        )
        .eq('product_id', productId!)
        .in('type', ['IN', 'OUT']) // ✅ remove ADJUST from results
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as InventoryTx[];
    },
    staleTime: 1000 * 10,
  });

  /* -------------------- FILTERED DATA -------------------- */
  const filtered = useMemo(() => {
    if (filter === 'ALL') return transactions;
    return transactions.filter((x) => x.type === filter);
  }, [transactions, filter]);

  /* -------------------- CLOSE ON OVERLAY -------------------- */
  if (!invUI.historyOpen) return null;

  const isLoading = loadingProduct || loadingTx;
  const error = productError || txError;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={invUI.closeHistory}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full sm:w-105w-[480px] lg:w-140 bg-white shadow-2xl animate-slide-in">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 sm:px-6 pt-3 pb-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[#1c4273]">
                LỊCH SỬ TỒN KHO
              </h2>
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
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
              {([
                { value: 'ALL', label: 'Tất cả' },
                { value: 'IN', label: 'Nhập kho' },
                { value: 'OUT', label: 'Xuất kho' },
              ] as const).map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${filter === item.value
                    ? 'bg-[#1b4f94] text-white'
                    : 'bg-gray-100 text-[#1c4273]'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-3">
            <p className="text-md text-gray-500 italic">
              {product?.name ?? '---'}
            </p>
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

            {/* Current stock */}
            {!isLoading && !error && product && (
              <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
                Tồn hiện tại: <b>{product.stock_quantity}</b>
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
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
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

                        <p className="text-sm text-gray-700">
                          Số lượng yêu cầu: <b>{tx.requested_quantity}</b> — Áp dụng:{' '}
                          <b>{tx.applied_quantity}</b>
                        </p>

                        {tx.note && (
                          <p className="text-xs text-gray-500">Ghi chú: {tx.note}</p>
                        )}
                      </div>

                      <div
                        className={`shrink-0 self-start sm:self-auto rounded-lg px-3 py-2 text-sm font-bold ${isZero
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
          <div className="border-t px-4 sm:px-6 py-4">
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
