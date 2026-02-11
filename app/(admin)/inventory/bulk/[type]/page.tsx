'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl } from '@/app/lib/storage';
import { useProductsQuery } from '@/app/hooks/useProductsQuery';
import { ArrowLeft, ChevronDown, ChevronsUpDown, ChevronUp, Save, Search, Lightbulb } from 'lucide-react';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";


type BulkType = 'in' | 'out';

type SortDirection = 'asc' | 'desc' | null;

const REASON_PRESETS = [
    'Kho giao',
    'Luân chuyển cửa hàng',
    'Bổ sung tồn kho',
    'Hàng đổi trả',
    'Khác',
] as const;

/** Units admin can select */
const INPUT_UNITS = ['ML', 'L', 'G', 'Kg', 'Cái', 'Lốc'] as const;

type InputUnit = (typeof INPUT_UNITS)[number];

/**
 * Conversion rules (as user described):
 * 500ml -> 1
 * 1 cái -> 1
 * 1 lốc -> 6
 * 100g -> 1
 * 1kg -> 10
 */
function convertToQty(inputValue: number, unit: InputUnit) {
    if (!Number.isFinite(inputValue) || inputValue <= 0) return 0;

    switch (unit) {
        case 'ML':
            return Math.floor(inputValue / 500);
        case 'L':
            return Math.floor((inputValue * 1000) / 500);
        case 'G':
            return Math.floor(inputValue / 100);
        case 'Kg':
            return Math.floor(inputValue * 10);
        case 'Cái':
            return Math.floor(inputValue);
        case 'Lốc':
            return Math.floor(inputValue * 6);
        default:
            return 0;
    }
}

type RowState = {
    inputValue: string; // giữ string để UI nhập mượt
    unit: InputUnit;
    qty: number; // qty quy đổi (applied quantity)
};

export default function BulkInventoryPage() {
    const router = useRouter();
    const params = useParams<{ type: string }>();
    const type = (params.type === 'in' ? 'in' : 'out') as BulkType;
    const title = type === 'in' ? 'Nhập Hàng' : 'Xuất Hàng';
    const [search, setSearch] = useState('');
    const { data: products = [], isLoading } = useProductsQuery({
        categoryId: 'all',
        search,
    });
    // row state per product
    const [rowById, setRowById] = useState<Record<string, RowState>>({});

    // reason
    const [reasonPreset, setReasonPreset] = useState<
        (typeof REASON_PRESETS)[number]
    >('Kho giao');
    const [customReason, setCustomReason] = useState('');

    const reasonText = useMemo(() => {
        if (reasonPreset !== 'Khác') return reasonPreset;
        return customReason.trim();
    }, [reasonPreset, customReason]);

    const selectedItems = useMemo(() => {
        return Object.entries(rowById)
            .map(([productId, row]) => ({
                productId,
                qty: row.qty,
                inputValue: row.inputValue.trim() === '' ? null : Number(row.inputValue),
                inputUnit: row.unit,
            }))
            .filter((x) => x.qty > 0);
    }, [rowById]);

    const canSubmit = useMemo(() => {
        if (selectedItems.length === 0) return false;
        if (reasonPreset === 'Khác') return customReason.trim().length > 0;
        return true;
    }, [selectedItems.length, reasonPreset, customReason]);

    const setRow = (productId: string, patch: Partial<RowState>) => {
        setRowById((prev) => {
            const current: RowState = prev[productId] ?? {
                inputValue: '',
                unit: 'ML',
                qty: 0,
            };

            const next: RowState = { ...current, ...patch };


            if (next.inputValue.trim() === '') {
                return { ...prev, [productId]: { ...next, qty: 0 } };
            }

            const num = Number(next.inputValue);
            if (!Number.isFinite(num) || num <= 0) {
                // giữ row để user thấy input, qty = 0
                return { ...prev, [productId]: { ...next, qty: 0 } };
            }

            const qty = convertToQty(num, next.unit);

            return { ...prev, [productId]: { ...next, qty } };
        });
    };

    const clearRow = (productId: string) => {
        setRowById((prev) => {
            const copy = { ...prev };
            delete copy[productId];
            return copy;
        });
    };

    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<null | {
        success: number;
        fail: number;
        details: { productId: string; qty: number; error?: string }[];
    }>(null);
    const [lastReceiptId, setLastReceiptId] = useState<string | null>(null);

    const handleSubmit = async () => {
        setResult(null);

        if (!canSubmit) {
            alert('Vui lòng nhập định lượng hợp lệ và chọn lý do.');
            return;
        }

        setSubmitting(true);

        const receiptId = crypto.randomUUID();
        setLastReceiptId(receiptId);

        const details: { productId: string; qty: number; error?: string }[] = [];

        for (const item of selectedItems) {
            try {
                if (type === 'out') {
                    // validate OUT not exceed stock
                    const product = products.find((p) => p.id === item.productId);
                    const stock = product?.stock_quantity ?? 0;
                    if (item.qty > stock) {
                        throw new Error(`Không thể xuất vượt tồn. Tồn hiện tại: ${stock}`);
                    }
                }

                if (type === 'in') {
                    const { error } = await supabase.rpc('create_inventory_in', {
                        p_product_id: item.productId,
                        p_quantity: item.qty,
                        p_note: reasonText || null,
                        p_input_value: item.inputValue,
                        p_input_unit: item.inputUnit,
                        p_receipt_id: receiptId,
                    });
                    if (error) throw error;
                } else {
                    const { error } = await supabase.rpc('create_inventory_out', {
                        p_product_id: item.productId,
                        p_quantity: item.qty,
                        p_note: reasonText || null,
                        p_input_value: item.inputValue,
                        p_input_unit: item.inputUnit,
                        p_receipt_id: receiptId,
                    });
                    if (error) throw error;
                }

                details.push({ productId: item.productId, qty: item.qty });
            } catch (err: any) {
                details.push({
                    productId: item.productId,
                    qty: item.qty,
                    error: err?.message ?? 'Unknown error',
                });
            }
        }

        const success = details.filter((d) => !d.error).length;
        const fail = details.filter((d) => !!d.error).length;

        setResult({ success, fail, details });
        setSubmitting(false);
        if (success > 0) {
            setRowById({});
            setSearch('');
            setReasonPreset('Kho giao');
            setCustomReason('');
        }
        if (success === 0) setLastReceiptId(null);
    };

    const handlePrintReceipt = () => {
        if (!lastReceiptId) return;
        router.push(`/inventory/print/${lastReceiptId}?type=${type}`);
    };

    const [sortStock, setSortStock] = useState<SortDirection>(null);

    const toggleStockSort = () => {
        setSortStock((prev) => {
            if (prev === null) return 'asc';
            if (prev === 'asc') return 'desc';
            return null;
        });
    };

    const sortedProducts = useMemo(() => {
        if (!sortStock) return products;

        return [...products].sort((a, b) => {
            const stockA = a.stock_quantity ?? 0;
            const stockB = b.stock_quantity ?? 0;

            return sortStock === 'asc' ? stockA - stockB : stockB - stockA;
        })
    }, [products, sortStock]);

    const adjustInput = (productId: string, delta: number) => {
        setRowById((prev) => {
            const current = prev[productId] ?? {
                inputValue: '',
                unit: 'ML',
                qty: 0,
            };

            const currentValue = Number(current.inputValue || 0);
            const nextValue = Math.max(0, currentValue + delta);

            return {
                ...prev,
                [productId]: {
                    ...current,
                    inputValue: nextValue === 0 ? '' : String(nextValue),
                },
            };
        });
    };

    return (
        <div className="mt-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1b4f94]/20 bg-[#1b4f94]/10 text-[#1b4f94] transition hover:bg-[#1b4f94]/15 active:scale-95"
                        aria-label="Quay lại"
                        title="Quay lại"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-xl font-bold text-[#1c4273]">{title}</h1>
                        <p className="text-sm text-gray-500">
                            Ghi nhận phiếu nhập/xuất. Cập nhật tồn kho.
                        </p>
                    </div>
                </div>

                <div className="w-full sm:w-auto space-y-2">
                    {/* ✅ Receipt code badge */}
                    {lastReceiptId && (result?.success ?? 0) > 0 && (
                        <div className="w-full flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-3.5 sm:w-auto">
                            <span className="text-xs text-gray-500">Mã phiếu</span>
                            <span className="text-sm font-semibold text-[#1c4273]">
                                {lastReceiptId.slice(0, 8).toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Buttons row */}
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                        <button
                            disabled={!lastReceiptId || (result?.success ?? 0) === 0}
                            onClick={handlePrintReceipt}
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#1b4f94] bg-white px-4 py-2 text-[#1b4f94] hover:bg-blue-50 disabled:opacity-40 sm:w-auto"
                            title={!lastReceiptId ? 'Chưa có phiếu mới để in' : 'In phiếu vừa tạo'}
                        >
                            In phiếu
                        </button>

                        <button
                            disabled={submitting || !canSubmit}
                            onClick={handleSubmit}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273] disabled:opacity-50 sm:w-auto"
                        >
                            <Save size={18} />
                            {submitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </div>

            </div>

            {/* Reason */}
            <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-[#1c4273]">
                    Lý do Nhập/Xuất
                </div>

                <div className="flex flex-wrap gap-2">
                    {REASON_PRESETS.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setReasonPreset(opt)}
                            className={`rounded-full px-4 py-2 text-sm shadow-sm transition ${reasonPreset === opt
                                ? 'bg-[#1b4f94] text-white'
                                : 'bg-gray-100 text-[#1c4273] hover:bg-gray-200'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                {reasonPreset === 'Khác' && (
                    <input
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Nhập lý do phát sinh..."
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#1b4f94] focus:bg-white"
                    />
                )}
            </div>

            {/* Search */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={16} />
                        </span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm sản phẩm..."
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-[#1b4f94] focus:bg-white"
                        />
                    </div>

                    {/* Total */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Tổng sản phẩm:</span>
                        <span className="rounded-lg bg-blue-50 px-3 py-1 text-md font-semibold text-[#1b4f94]">
                            {selectedItems.length}
                        </span>
                        <div className="sm:hidden">
                            <QuantityHintPopover side="bottom" align="center" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Products table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {/* ===================== MOBILE: CARDS ===================== */}
                <div className="md:hidden p-4 space-y-3">
                    {isLoading ? (
                        <BulkMobileSkeleton count={6} />
                    ) : products.length === 0 ? (
                        <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">
                            Không có sản phẩm
                        </div>
                    ) : (
                        products.map((p) => {
                            const stock = p.stock_quantity ?? 0;
                            const row = rowById[p.id];
                            const qty = row?.qty ?? 0;
                            const inputValue = row?.inputValue ?? '';
                            const unit = row?.unit ?? 'ML';

                            return (
                                <BulkInventoryCard
                                    key={p.id}
                                    type={type}
                                    product={p}
                                    stock={stock}
                                    qty={qty}
                                    inputValue={inputValue}
                                    unit={unit}
                                    onChangeValue={(val) => setRow(p.id, { inputValue: val })}
                                    onChangeUnit={(u) => setRow(p.id, { unit: u })}
                                    onClear={() => clearRow(p.id)}
                                    adjustInput={adjustInput}
                                />
                            );
                        })
                    )}
                </div>

                <div className='hidden md:block'>
                    <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50 text-gray-600">
                            <tr>
                                <th className="w-105 px-4 py-3 text-left">Sản phẩm</th>
                                <th
                                    onClick={toggleStockSort}
                                    className='group w-72 cursor-pointer select-none px-4 py-3 text-left text-gray-600 hover:text-[#1b4f94]'
                                >
                                    <div className='inline-flex items-center gap-1'>
                                        <span>Tồn hiện tại</span>
                                        <span className='flex h-4 w-4 items-center justify-center'>
                                            {sortStock === null && <ChevronsUpDown size={14} className='opacity-50 transition-opacity group-hover:opacity-100' />}
                                            {sortStock === 'asc' && <ChevronUp size={14} />}
                                            {sortStock === 'desc' && <ChevronDown size={14} />}

                                        </span>

                                    </div>
                                </th>
                                <th className='w-32 px-4 py-3 text-left'>
                                    <div className='inline-flex items-center gap-1'>
                                        <span>Số lượng</span>
                                        <QuantityHintPopover />
                                    </div>
                                </th>
                                <th className="w-48 px-4 py-3 text-right">
                                    {type === 'in' ? 'Nhập' : 'Xuất'} kho ({type === 'in' ? 'IN' : 'OUT'})
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {/* product */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-20 w-20 rounded-lg bg-gray-200" />
                                                <div className="min-w-0 flex-1 space-y-2">
                                                    <div className="h-4 w-48 rounded bg-gray-200" />
                                                    <div className="h-3 w-28 rounded bg-gray-200" />
                                                </div>
                                            </div>
                                        </td>

                                        {/* stock */}
                                        <td className="px-4 py-6">
                                            <div className="h-9 w-28 rounded-lg bg-gray-200" />
                                        </td>

                                        {/* input measurement */}
                                        <td className="px-4 py-4">
                                            <div className="flex w-72 items-center gap-2">
                                                <div className="h-9 w-14 rounded-lg bg-gray-200" />
                                                <div className="h-9 w-20 rounded-lg bg-gray-200" />
                                                <div className="h-9 w-16 rounded-lg bg-gray-200" />
                                            </div>
                                        </td>

                                        {/* qty */}
                                        <td className="pr-4 py-4 text-right">
                                            <div className="ml-auto h-9 w-14 rounded-lg bg-gray-200" />
                                        </td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        Không có sản phẩm
                                    </td>
                                </tr>
                            ) : (
                                sortedProducts.map((p) => {
                                    const stock = p.stock_quantity ?? 0;
                                    const row = rowById[p.id];
                                    const qty = row?.qty ?? 0;
                                    const inputValue = row?.inputValue ?? '';
                                    const unit = row?.unit ?? 'ML';

                                    return (
                                        <tr
                                            key={p.id}
                                            className={qty > 0 ? 'bg-blue-50/30' : 'hover:bg-gray-50'}
                                        >
                                            {/* product */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-50">
                                                        {p.image ? (
                                                            <img
                                                                src={getPublicImageUrl('products', p.image) ?? ''}
                                                                alt={p.name}
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="font-bold text-[#1c4273]">{p.name}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* stock */}
                                            <td className="px-4 py-6">
                                                {stock <= 0 ? (
                                                    <span className="rounded-lg bg-red-100 px-3 py-2.5 text-xs font-semibold text-red-700">
                                                        Out of stock
                                                    </span>
                                                ) : (
                                                    <span className="rounded-lg bg-blue-100 px-3 py-2.5 text-xs font-semibold text-blue-700">
                                                        Còn {stock}
                                                    </span>
                                                )}
                                            </td>

                                            {/* input measurement */}
                                            <td className="px-4">
                                                <div className="flex w-72 items-center gap-2">
                                                    <button
                                                        onClick={() => adjustInput(p.id, -1)}
                                                        className="h-9 w-9 rounded-lg border bg-gray-50 text-lg hover:bg-gray-100"
                                                    >
                                                        −
                                                    </button>

                                                    <input
                                                        value={inputValue}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
                                                            setRow(p.id, { inputValue: val });
                                                        }}
                                                        placeholder='0'
                                                        inputMode='decimal'
                                                        className="w-12 rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-center text-sm outline-none focus:border-[#1b4f94]"
                                                    />

                                                    <button
                                                        onClick={() => adjustInput(p.id, 1)}
                                                        className="h-9 w-9 rounded-lg border bg-gray-50 text-lg hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>

                                                    <select
                                                        value={unit}
                                                        onChange={(e) =>
                                                            setRow(p.id, { unit: e.target.value as InputUnit })
                                                        }
                                                        className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#1b4f94]"
                                                    >
                                                        {INPUT_UNITS.map((u) => (
                                                            <option key={u} value={u}>
                                                                {u}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        onClick={() => clearRow(p.id)}
                                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>

                                            {/* selected qty column */}
                                            <td className="pr-4.5 py-4 text-right">
                                                {qty > 0 ? (
                                                    <span className="rounded-lg bg-[#1b4f94] px-3 py-2 text-sm font-semibold text-white">
                                                        {qty}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function BulkInventoryCard({
    type,
    product,
    stock,
    qty,
    inputValue,
    unit,
    onChangeValue,
    onChangeUnit,
    onClear,
    adjustInput,
}: {
    type: BulkType;
    product: any;
    stock: number;
    qty: number;
    inputValue: string;
    unit: InputUnit;
    onChangeValue: (v: string) => void;
    onChangeUnit: (u: InputUnit) => void;
    onClear: () => void;
    adjustInput: (productId: string, delta: number) => void;
}) {

    return (
        <div className={`rounded-2xl border bg-white p-4 shadow-sm ${qty > 0 ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
            }`}>
            <div className="flex gap-3">
                {/* Image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    {product.image ? (
                        <img
                            src={getPublicImageUrl('products', product.image) ?? ''}
                            alt={product.name}
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No image
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#1c4273] line-clamp-2">
                        {product.name}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        {stock <= 0 ? (
                            <span className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                Out of stock
                            </span>
                        ) : (
                            <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                Còn {stock}
                            </span>
                        )}

                        {qty > 0 ? (
                            <span className="rounded-lg bg-[#1b4f94] px-3 py-1 text-xs font-semibold text-white">
                                {type === 'in' ? 'Nhập' : 'Xuất'}: {qty}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">Chưa chọn</span>
                        )}
                    </div>
                </div>
            </div>

            {/* input */}
            <div className="mt-3 grid grid-cols-4 gap-2 items-center">
                {/* minus */}
                <button
                    onClick={() => adjustInput(product.id, -1)}
                    className="h-10 rounded-lg border bg-gray-50 text-lg font-semibold hover:bg-gray-100"
                >
                    −
                </button>

                {/* input */}
                <input
                    value={inputValue}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
                        onChangeValue(val);
                    }}
                    placeholder="0"
                    inputMode="decimal"
                    className="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 text-center text-sm outline-none focus:border-[#1b4f94]"
                />

                {/* plus */}
                <button
                    onClick={() => adjustInput(product.id, 1)}
                    className="h-10 rounded-lg border bg-gray-50 text-lg font-semibold hover:bg-gray-100"
                >
                    +
                </button>

                {/* unit */}
                <select
                    value={unit}
                    onChange={(e) => onChangeUnit(e.target.value as InputUnit)}
                    className="h-10 rounded-lg border border-gray-300 bg-white px-2 text-sm outline-none focus:border-[#1b4f94]"
                >
                    {INPUT_UNITS.map((u) => (
                        <option key={u} value={u}>
                            {u}
                        </option>
                    ))}
                </select>
            </div>

            {/* delete */}
            <button
                onClick={onClear}
                className="mt-2 w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
                Xóa
            </button>

        </div>
    );
}

function BulkMobileSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm animate-pulse"
                >
                    <div className="flex gap-3">
                        <div className="h-20 w-20 rounded-xl bg-gray-200 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 rounded bg-gray-200" />
                            <div className="h-3 w-1/2 rounded bg-gray-200" />
                            <div className="h-6 w-32 rounded bg-gray-200" />
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="h-10 rounded-lg bg-gray-200" />
                        <div className="h-10 rounded-lg bg-gray-200" />
                        <div className="h-10 rounded-lg bg-gray-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function QuantityHintPopover({
  side = 'right',
  align = 'end',
}: {
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#1b4f94]"
        >
          <Lightbulb size={14} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side={side}
        align={align}
        sideOffset={12} // khoảng cách giữa trigger & ...
        className="w-40 max-w-[calc(100vw-2rem)] text-sm"
      >
        <div className="space-y-1">
          <div className="font-bold text-blue2">
            Quy đổi số lượng
          </div>
          <div>500 ML = <b>1</b></div>
          <div>1 L = <b>2</b></div>
          <div>100 G = <b>1</b></div>
          <div>1 Kg = <b>10</b></div>
          <div>1 Cái = <b>1</b></div>
          <div>1 Lốc = <b>6</b></div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
