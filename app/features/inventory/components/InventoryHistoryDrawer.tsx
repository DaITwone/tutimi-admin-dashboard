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
  if (type === 'IN') return 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/20 dark:text-blue-300';
  if (type === 'OUT') return 'border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-400/30 dark:bg-yellow-500/20 dark:text-yellow-300';
  return 'border-border bg-muted text-muted-foreground';
}

export default function InventoryHistoryDrawer() {
  const invUI = useInventoryUI();
  const productId = invUI.historyProductId;

  const [filter, setFilter] = useState<TxFilter>('ALL');

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') invUI.closeHistory();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [invUI]);

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
        .in('type', ['IN', 'OUT'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as InventoryTx[];
    },
    staleTime: 1000 * 10,
  });

  const filtered = useMemo(() => {
    if (filter === 'ALL') return transactions;
    return transactions.filter((x) => x.type === filter);
  }, [transactions, filter]);

  if (!invUI.historyOpen) return null;

  const isLoading = loadingProduct || loadingTx;
  const error = productError || txError;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={invUI.closeHistory} />

      <div className="animate-slide-in fixed right-0 top-0 z-50 h-full w-full border-l border-border bg-card shadow-2xl sm:w-[480px] lg:w-[560px]">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 pb-3 pt-3 sm:px-6">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-brand-1 dark:text-brand-2">LỊCH SỬ TỒN KHO</h2>
            </div>

            <button
              type="button"
              onClick={invUI.closeHistory}
              className="rounded-full p-2 text-foreground transition hover:bg-muted"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

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
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm transition ${
                    filter === item.value
                      ? 'bg-brand-2 text-white'
                      : 'bg-muted text-brand-1 dark:text-brand-2'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-md italic text-muted-foreground">{product?.name ?? '---'}</p>

            {isLoading && (
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                Đang tải lịch sử tồn kho...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/40 dark:bg-red-500/10">
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                  Không thể tải lịch sử tồn kho
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
                >
                  Thử tải lại
                </button>
              </div>
            )}

            {!isLoading && !error && product && (
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-foreground">
                Tồn hiện tại: <b>{product.stock_quantity}</b>
              </div>
            )}

            {!isLoading && !error && filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Chưa có giao dịch tồn kho nào.
              </div>
            )}

            {!isLoading &&
              !error &&
              filtered.map((tx) => {
                const isPlus = tx.delta > 0;
                const isZero = tx.delta === 0;

                return (
                  <div key={tx.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getTypeBadgeClass(
                              tx.type
                            )}`}
                          >
                            {getTypeLabel(tx.type)}
                          </span>

                          <span className="text-xs text-muted-foreground">{formatDateVN(tx.created_at)}</span>
                        </div>

                        <p className="text-sm text-foreground">
                          Số lượng yêu cầu: <b>{tx.requested_quantity}</b> - Áp dụng: <b>{tx.applied_quantity}</b>
                        </p>

                        {tx.note && <p className="text-xs text-muted-foreground">Ghi chú: {tx.note}</p>}
                      </div>

                      <div
                        className={`shrink-0 self-start rounded-lg px-3 py-2 text-sm font-bold sm:self-auto ${
                          isZero
                            ? 'bg-muted text-muted-foreground'
                            : isPlus
                              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
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

          <div className="border-t border-border px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={invUI.closeHistory}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-muted/50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
