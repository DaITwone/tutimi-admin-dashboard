'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl } from '@/app/lib/storage';
import { ArrowLeft, Printer } from 'lucide-react';

type TxRow = {
    id: string;
    type: 'IN' | 'OUT' | 'ADJUST';
    requested_quantity: number;
    applied_quantity: number;
    delta: number;
    note: string | null;
    input_value: number | null;
    input_unit: string | null;
    created_at: string;
    product_id: string;
    receipt_id?: string | null;
};

type ProductMini = {
    id: string;
    name: string;
    image: string | null;
};

export default function PrintReceiptPage() {
    const router = useRouter();
    const params = useParams<{ receiptId: string }>();
    const searchParams = useSearchParams();

    const receiptId = params.receiptId;
    const typeParam = searchParams.get('type'); // in | out
    const receiptType = typeParam === 'out' ? 'out' : 'in';

    const receiptCode = useMemo(
        () => receiptId?.slice(0, 8).toUpperCase(),
        [receiptId]
    );

    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<TxRow[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [productMap, setProductMap] = useState<Map<string, ProductMini>>(new Map());

    useEffect(() => {
        let mounted = true;

        const fetchReceipt = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data, error } = await supabase
                    .from('inventory_transactions')
                    .select(`
    id,
    type,
    requested_quantity,
    applied_quantity,
    delta,
    note,
    input_value,
    input_unit,
    created_at,
    product_id,
    receipt_id
  `)
                    .eq('receipt_id', receiptId)
                    .order('created_at', { ascending: true });

                if (error) throw error;

                const txRows = (data ?? []) as TxRow[];

                // ✅ fetch products theo ids
                const productIds = Array.from(new Set(txRows.map((r) => r.product_id)));

                if (productIds.length > 0) {
                    const { data: productsData, error: productsError } = await supabase
                        .from('products')
                        .select('id, name, image')
                        .in('id', productIds);

                    if (productsError) throw productsError;

                    const map = new Map<string, ProductMini>();
                    (productsData ?? []).forEach((p: any) => {
                        map.set(p.id, { id: p.id, name: p.name, image: p.image });
                    });

                    if (!mounted) return;
                    setProductMap(map);
                }

                if (!mounted) return;
                setRows(txRows);

            } catch (err: any) {
                if (!mounted) return;
                setError(err?.message ?? 'Failed to fetch receipt');
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        fetchReceipt();

        return () => {
            mounted = false;
        };
    }, [receiptId]);

    const createdAt = useMemo(() => {
        if (!rows?.length) return null;
        return rows[0]?.created_at ?? null;
    }, [rows]);

    const reasonText = useMemo(() => {
        // take note from first non-empty
        const found = rows.find((r) => r.note && r.note.trim().length > 0)?.note;
        return found ?? '';
    }, [rows]);

    const totalQty = useMemo(() => {
        return rows.reduce((sum, r) => sum + (r.applied_quantity ?? 0), 0);
    }, [rows]);

    const title = receiptType === 'in' ? 'PHIẾU NHẬP KHO' : 'PHIẾU XUẤT KHO';

    function formatDateVN(dateStr: string) {
        const d = new Date(dateStr);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        return `Ngày ${day} tháng ${month} năm ${year}`;
    }


    if (loading) {
        return (
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                <div className="animate-pulse space-y-3">
                    <div className="h-6 w-52 rounded bg-gray-200" />
                    <div className="h-4 w-80 rounded bg-gray-200" />
                    <div className="h-48 w-full rounded bg-gray-200" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow-sm">
                <div className="text-lg font-bold text-red-600">Lỗi</div>
                <p className="text-sm text-gray-600">{error}</p>

                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1b4f94] px-4 py-2 text-sm text-white hover:bg-[#1c4273]"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </button>
            </div>
        );
    }

    if (!rows || rows.length === 0) {
        return (
            <div className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow-sm">
                <div className="text-lg font-bold text-[#1c4273]">
                    Không tìm thấy phiếu
                </div>
                <p className="text-sm text-gray-600">
                    Phiếu này không có dữ liệu hoặc đã bị xoá.
                </p>

                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1b4f94] px-4 py-2 text-sm text-white hover:bg-[#1c4273]"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-4">
            {/* Actions (not printed) */}
            <div className="grid grid-cols-2 gap-2 print:hidden md:flex md:items-center md:justify-between md:gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#1b4f94]/20 bg-[#1b4f94]/10 px-4 py-2 text-sm font-semibold text-[#1b4f94] hover:bg-[#1b4f94]/15 active:scale-95"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </button>

                <button
                    onClick={() => window.print()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b4f94] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c4273] active:scale-95"
                >
                    <Printer size={16} />
                    In
                </button>
            </div>

            {/* ===== Word-like Document Preview Wrapper ===== */}
            <div className="min-h-screen bg-gray-100 px-3 py-6 md:px-0 md:py-10 print:bg-white print:py-0 print:px-0">                {/* Mobile: center + allow scroll if needed */}
                <div className="flex justify-center overflow-x-auto">
                    {/* Scale container */}
                    <div className="origin-top scale-[0.46] sm:scale-[0.62] md:scale-100 print:scale-100">
                        <div
                            className="mx-auto w-[210mm] min-h-[297mm] bg-white border border-gray-200 shadow-xl rounded-sm px-[14mm] py-[12mm]
                            print:w-auto print:min-h-0
                            print:border-none print:shadow-none print:rounded-none
                            print:px-0 print:py-0
                             "       
                        >
                            {/* Receipt */}
                            <div className="w-full">
                                {/* Top official heading (giống mẫu phiếu) */}
                                <div className="mb-3 flex items-start justify-between gap-4 pb-3 text-[11px] leading-[1.4] text-gray-700 print:text-[10px]">
                                    {/* Left: company info */}
                                    <div>
                                        <div className="text-base font-semibold uppercase text-gray-900">
                                            CÔNG TY CỔ PHẦN TTMI
                                        </div>
                                        <div>MST: 0317025010</div>
                                        <div>
                                            146 Bình Lợi, Phường 13, Quận Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam
                                        </div>
                                    </div>

                                    {/* Right: form / regulation */}
                                    <div className="min-w-57.5 text-center">
                                        <div className="text-sm font-semibold text-gray-900">Mẫu số: 01 - VT</div>
                                        <div className="italic">(Ban hành theo Thông tư số 133/2016/TT-BTC</div>
                                        <div className="italic">Ngày 26/08/2016 của Bộ Tài chính)</div>
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="mt-6">
                                    {/* Center title + date */}
                                    <div className="text-center space-y-0.5">
                                        <div className="text-3xl font-bold text-[#1c4273]">{title}</div>

                                        {createdAt && (
                                            <div className="text-sm text-gray-600 italic">{formatDateVN(createdAt)}</div>
                                        )}
                                    </div>

                                    {/* Meta info */}
                                    <div className="mt-3 space-y-1">
                                        <div className="text-xs text-gray-600">
                                            <span className="font-semibold text-gray-800">Mã phiếu:</span>{' '}
                                            <span className="font-mono text-[#1b4f94]">{receiptCode}</span>
                                        </div>

                                        {reasonText && (
                                            <div className="text-xs text-gray-600">
                                                <span className="font-semibold text-gray-800">Lý do:</span>{' '}
                                                <span className="text-[#1b4f94]">{reasonText}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="mt-4 overflow-hidden border print:rounded-none">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-600">
                                            <tr className="border-b">
                                                <th className="w-12 px-4 py-3 text-center">STT</th>
                                                <th className="px-4 py-3 text-left">Sản phẩm</th>
                                                <th className="px-4 py-3 text-center">Tổng định lượng/ĐVT</th>
                                                <th className="px-4 py-3 text-center">
                                                    {receiptType === 'in' ? 'Số lượng Nhập' : 'Số lượng Xuất'}
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {rows.map((r, i) => {
                                                const p = productMap.get(r.product_id) ?? null;
                                                const inputText =
                                                    r.input_value && r.input_unit ? `${r.input_value} ${r.input_unit}` : '-';

                                                return (
                                                    <tr key={r.id}>
                                                        <td className="px-4 py-3 text-center font-semibold text-gray-700">
                                                            {i + 1}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-12 w-12 overflow-hidden rounded-lg">
                                                                    {p?.image ? (
                                                                        <img
                                                                            src={getPublicImageUrl('products', p.image) ?? ''}
                                                                            alt={p?.name ?? 'product'}
                                                                            className="h-full w-full object-contain"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                                                            No image
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <div className="text-[#1b4f94] font-semibold">
                                                                        {p?.name ?? 'Unknown product'}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        ID: {r.product_id.slice(0, 8).toUpperCase()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-3 text-gray-700 text-center">{inputText}</td>

                                                        <td className="px-4 py-3 text-center">
                                                            <span className="inline-flex min-w-10 justify-center rounded-lg py-1.5 font-bold text-[#1b4f94]">
                                                                {r.applied_quantity}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="mt-6 border-t pt-4 text-sm">
                                    {/* Summary */}
                                    <div className="flex items-start justify-between gap-6 mr-5">
                                        <div />
                                        <div className="space-y-1 text-right text-gray-700">
                                            <div>
                                                Tổng số lượng: <span className="font-semibold text-gray-900">{totalQty}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signatures */}
                                    <div className="mt-10 grid grid-cols-4 gap-6 text-center print:mt-12">
                                        {['Người lập phiếu', 'Người giao hàng', 'Người nhận hàng', 'Người vận chuyển'].map(
                                            (label) => (
                                                <div key={label} className="text-xs text-gray-700">
                                                    <div className="font-semibold text-gray-900">{label}</div>
                                                    <div className="mt-0.5 text-[11px] italic text-gray-500">(Ký, họ tên)</div>

                                                    <div className="mt-12 border-t border-gray-400/60 pt-1 text-[10px] text-gray-400">
                                                        Ký tên
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
