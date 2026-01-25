'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmDeleteDrawer from '@/app/components/ConfirmDeleteDrawer';
import EditVoucherDrawer from '@/app/components/EditVoucherDrawer';

/* ===================== TYPES ===================== */
type Voucher = {
    code: string;
    title: string;
    description: string | null;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    min_order_value: number | null;
    for_new_user: boolean;
    max_usage_per_user: number | null;
    is_active: boolean;
};

/* ===================== COMPONENT ===================== */
export default function VouchersPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [deleteCode, setDeleteCode] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editingCode, setEditingCode] = useState<string | null>(null);
    const SKELETON_ROWS = 5;

    /* -------------------- FETCH -------------------- */
    const fetchVouchers = async () => {
        setLoading(true);
        setError(null);

        let query = supabase
            .from('vouchers')
            .select(`
        code,
        title,
        description,
        discount_type,
        discount_value,
        min_order_value,
        for_new_user,
        max_usage_per_user,
        is_active
      `)
            .order('created_at', { ascending: false });

        if (search.trim()) {
            query = query.or(
                `code.ilike.%${search}%,title.ilike.%${search}%`
            );
        }

        const { data, error } = await query;

        if (error) {
            console.error(error);
            setError('Không thể tải danh sách voucher');
            setVouchers([]);
        } else {
            setVouchers(data || []);
        }

        setLoading(false);
    };

    const confirmDelete = async () => {
        if (!deleteCode) return;

        setDeleting(true);

        const { error } = await supabase
            .from('vouchers')
            .delete()
            .eq('code', deleteCode);

        setDeleting(false);

        if (error) {
            alert('Xóa voucher thất bại');
            return;
        }

        setDeleteCode(null);
        fetchVouchers();
    };

    /* -------------------- INIT -------------------- */
    useEffect(() => {
        fetchVouchers();
    }, []);

    /* -------------------- SEARCH -------------------- */
    useEffect(() => {
        const delay = setTimeout(fetchVouchers, 400);
        return () => clearTimeout(delay);
    }, [search]);

    /* ===================== UI ===================== */
    return (
        <div className="space-y-3 mt-6">
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {/* HEADER */}
                <div className="mx-4 mt-4.5 flex flex-wrap items-center justify-between gap-3">
                    <button
                        onClick={() => router.push('/vouchers/create')}
                        className="rounded-lg bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273]"
                    >
                        + Thêm voucher
                    </button>

                    <div className="relative w-64">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={16} />
                        </span>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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

                {/* TABLE */}
                <table className="mt-3 w-full text-sm">
                    <thead className="border-b text-gray-500">
                        <tr>
                            <th className="p-4 text-left">Code</th>
                            <th className="p-4 text-left">Tiêu đề</th>
                            <th className="p-4 text-left">Giảm</th>
                            <th className="p-4 text-left">Đơn tối thiểu</th>
                            <th className="p-4 text-left">Giới hạn</th>
                            <th className="p-4 text-left">Đối tượng</th>
                            <th className="p-4 text-left">Trạng thái</th>
                            <th className="px-4.5 text-right">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {/* CODE */}
                                    <td className="p-4">
                                        <div className="h-4 w-24 rounded bg-gray-200" />
                                    </td>

                                    {/* TITLE */}
                                    <td className="p-4 space-y-2">
                                        <div className="h-4 w-40 rounded bg-gray-200" />
                                        <div className="h-3 w-28 rounded bg-gray-200" />
                                    </td>

                                    {/* DISCOUNT */}
                                    <td className="p-4">
                                        <div className="h-4 w-16 rounded bg-gray-200" />
                                    </td>

                                    {/* MIN ORDER */}
                                    <td className="p-4">
                                        <div className="h-4 w-20 rounded bg-gray-200" />
                                    </td>

                                    {/* LIMIT */}
                                    <td className="p-4">
                                        <div className="h-4 w-12 rounded bg-gray-200" />
                                    </td>

                                    {/* TARGET */}
                                    <td className="p-4">
                                        <div className="h-6 w-20 rounded-full bg-gray-200" />
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-4">
                                        <div className="h-6 w-20 rounded-full bg-gray-200" />
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <div className="h-7 w-12 rounded bg-gray-200" />
                                            <div className="h-7 w-12 rounded bg-gray-200" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )
                            : vouchers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        Chưa có voucher nào
                                    </td>
                                </tr>
                            ) : (
                                vouchers.map((v) => (
                                    <tr
                                        key={v.code}
                                        className="border-t border-gray-300 hover:bg-gray-50"
                                    >
                                        {/* CODE */}
                                        <td className="p-4 font-mono font-extrabold text-[#1c4273]">
                                            {v.code}
                                        </td>

                                        {/* TITLE */}
                                        <td className="p-4">
                                            <p className="font-bold text-[#1b4f94]">{v.title}</p>
                                            {v.description && (
                                                <p className="text-xs text-gray-400">
                                                    {v.description}
                                                </p>
                                            )}
                                        </td>

                                        {/* DISCOUNT */}
                                        <td className="p-4">
                                            {v.discount_type === 'percent'
                                                ? `${v.discount_value}%`
                                                : `${v.discount_value.toLocaleString()}đ`}
                                        </td>

                                        {/* MIN ORDER */}
                                        <td className="p-4">
                                            {v.min_order_value
                                                ? `${v.min_order_value.toLocaleString()}đ`
                                                : '—'}
                                        </td>

                                        {/* LIMIT */}
                                        <td className="p-4">
                                            {v.max_usage_per_user ?? '—'}
                                        </td>

                                        {/* TARGET */}
                                        <td className="p-4">
                                            {v.for_new_user ? (
                                                <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700">
                                                    Khách mới
                                                </span>
                                            ) : (
                                                <span className="rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-600">
                                                    Tất cả
                                                </span>
                                            )}
                                        </td>

                                        {/* STATUS */}
                                        <td className="p-4">
                                            <span
                                                className={`rounded-lg px-3 py-1 text-sm ${v.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-200 text-gray-500'
                                                    }`}
                                            >
                                                {v.is_active ? 'Hoạt động' : 'Tắt'}
                                            </span>
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingCode(v.code)}
                                                    className="rounded-md border border-gray-400 px-3 py-1 text-sm hover:bg-gray-50"
                                                >
                                                    Sửa
                                                </button>

                                                <button
                                                    onClick={() => setDeleteCode(v.code)}
                                                    className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                    </tbody>
                </table>
            </div>
            {editingCode && (
                <EditVoucherDrawer
                    code={editingCode}
                    onClose={() => setEditingCode(null)}
                    onUpdated={fetchVouchers}
                />
            )}

            <ConfirmDeleteDrawer
                open={!!deleteCode}
                title="Xóa voucher?"
                description="Voucher sẽ bị xóa vĩnh viễn."
                loading={deleting}
                onCancel={() => setDeleteCode(null)}
                onConfirm={confirmDelete}
            />
        </div>

    );
}
