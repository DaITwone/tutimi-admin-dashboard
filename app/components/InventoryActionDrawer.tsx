'use client';

import { useMemo, useState } from 'react';
import { useInventoryUI } from '@/app/store/inventoryUI';
import {
  useCreateInventoryAdjust,
  useCreateInventoryIn,
  useCreateInventoryOut,
} from '@/app/hooks/useInventory';

export default function InventoryActionDrawer() {
  const { open, closeDrawer, action, productId, productName } = useInventoryUI();

  const [qty, setQty] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [direction, setDirection] = useState<'INCREASE' | 'DECREASE'>('INCREASE');

  const createIn = useCreateInventoryIn();
  const createOut = useCreateInventoryOut();
  const createAdjust = useCreateInventoryAdjust();

  const title = useMemo(() => {
    if (action === 'IN') return 'NHẬP HÀNG';
    if (action === 'OUT') return 'XUẤT HÀNG';
    return 'ĐIỀU CHỈNH TỒN';
  }, [action]);

  const saving = createIn.isPending || createOut.isPending || createAdjust.isPending;

  const handleSubmit = async () => {
    if (!productId) return;
    if (!qty || Number(qty) <= 0) {
      alert('Số lượng phải > 0');
      return;
    }

    try {
      if (action === 'IN') {
        await createIn.mutateAsync({
          productId,
          quantity: Number(qty),
          note,
        });
      }

      if (action === 'OUT') {
        await createOut.mutateAsync({
          productId,
          quantity: Number(qty),
          note,
        });
      }

      if (action === 'ADJUST') {
        await createAdjust.mutateAsync({
          productId,
          direction,
          quantity: Number(qty),
          note,
        });
      }

      setQty('');
      setNote('');
      setDirection('INCREASE');

      closeDrawer();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Thao tác thất bại');
    }
  };

  if (!open) return null;
    
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={closeDrawer} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-100 bg-white shadow-2xl animate-slide-in">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 pt-3">
            <div>
              <h2 className="text-lg font-semibold text-[#1c4273]">{title}</h2>
              <p className="text-xs text-gray-500 mt-1">{productName}</p>
            </div>

            <button onClick={closeDrawer} className="rounded-full p-2 hover:bg-gray-100">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {/* Adjust direction */}
            {action === 'ADJUST' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1b4f94]">Loại điều chỉnh</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDirection('INCREASE')}
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm font-semibold ${
                      direction === 'INCREASE'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    Tăng
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection('DECREASE')}
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm font-semibold ${
                      direction === 'DECREASE'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    Giảm
                  </button>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#1b4f94]">Số lượng</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-[#1b4f94]/20"
                placeholder="VD: 10"
              />
            </div>

            {/* Note */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#1b4f94]">Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-22 w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-[#1b4f94]/20"
                placeholder="VD: Nhập hàng từ kho..."
              />
            </div>

            {/* Info */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Lưu ý: nếu xuất/giảm vượt tồn, hệ thống sẽ tự đưa về <b>0</b>.
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t px-6 py-4">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 rounded-lg bg-[#163f78] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b4f94] disabled:opacity-50"
            >
              {saving ? 'Đang xử lý...' : 'Xác nhận'}
            </button>

            <button onClick={closeDrawer} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
