'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { ArrowLeft, Printer, Search } from 'lucide-react';

type ReceiptRow = {
  receipt_id: string;
  type: 'IN' | 'OUT';
  created_at: string;
  total_lines: number;
  total_qty: number;
  note: string | null;
};

export default function InventoryHistoryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ReceiptRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'IN' | 'OUT'>('all');

  useEffect(() => {
    let mounted = true;

    const fetchReceipts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('inventory_receipts') // ✅ view
          .select('receipt_id, type, created_at, total_lines, total_qty, note')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!mounted) return;
        setRows((data ?? []) as ReceiptRow[]);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? 'Failed to fetch receipts');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchReceipts();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows
      .filter((r) => (filterType === 'all' ? true : r.type === filterType))
      .filter((r) => {
        if (!q) return true;
        return r.receipt_id.toLowerCase().includes(q);
      });
  }, [rows, filterType, search]);

  const handlePrint = (receipt: ReceiptRow) => {
    const typeParam = receipt.type === 'OUT' ? 'out' : 'in';
    router.push(`/inventory/print/${receipt.receipt_id}?type=${typeParam}`);
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1b4f94]/20 bg-[#1b4f94]/10 text-[#1b4f94] transition hover:bg-[#1b4f94]/15 active:scale-95"
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-[#1c4273]">Lịch sử phiếu</h1>
            <p className="text-sm text-gray-500">
              Xem và in lại các phiếu đã tạo (receipt history).
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-80">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo receipt_id..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-[#1b4f94] focus:bg-white"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            {(['all', 'IN', 'OUT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-full px-4 py-2 text-sm shadow-sm transition ${
                  filterType === t
                    ? 'bg-[#1b4f94] text-white'
                    : 'bg-gray-100 text-[#1c4273] hover:bg-gray-200'
                }`}
              >
                {t === 'all' ? 'Tất cả' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Chưa có phiếu nào</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Mã phiếu</th>
                <th className="px-4 py-3 text-left">Loại</th>
                <th className="px-4 py-3 text-left">Thời gian</th>
                <th className="px-4 py-3 text-right">Dòng</th>
                <th className="px-4 py-3 text-right">Tổng SL</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.receipt_id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-[#1c4273]">
                      {r.receipt_id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {r.receipt_id}
                    </div>
                    {r.note && (
                      <div className="mt-1 text-xs text-gray-500">
                        Lý do: <span className="font-medium">{r.note}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                        r.type === 'IN'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.type}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-gray-700">
                    {new Date(r.created_at).toLocaleString('vi-VN')}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-gray-900">
                    {r.total_lines}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-gray-900">
                    {r.total_qty}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handlePrint(r)}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#1b4f94] bg-white px-3 py-2 text-xs font-semibold text-[#1b4f94] hover:bg-blue-50"
                    >
                      <Printer size={14} />
                      In lại
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
