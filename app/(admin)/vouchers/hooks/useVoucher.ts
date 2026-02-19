'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import type { Voucher } from '../types';

type UseVouchersReturn = {
    vouchers: Voucher[];
    loading: boolean;
    error: string | null;
    search: string;
    setSearch: (value: string) => void;

    deleteCode: string | null;
    deleting: boolean;
    openDelete: (code: string) => void;
    closeDelete: () => void;
    confirmDelete: () => Promise<void>;

    editingCode: string | null;
    openEdit: (code: string) => void;
    closeEdit: () => void;

    fetchVouchers: () => Promise<void>;
};

export function useVouchers(): UseVouchersReturn {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [deleteCode, setDeleteCode] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [editingCode, setEditingCode] = useState<string | null>(null);

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
            query = query.or(`code.ilike.%${search}%,title.ilike.%${search}%`);
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

    useEffect(() => {
        fetchVouchers();
    }, []);

    useEffect(() => {
        const delay = setTimeout(fetchVouchers, 400);
        return () => clearTimeout(delay);
    }, [search]);

    return {
        vouchers,
        loading,
        error,
        search,
        setSearch,

        deleteCode,
        deleting,
        openDelete: (code) => setDeleteCode(code),
        closeDelete: () => setDeleteCode(null),
        confirmDelete,

        editingCode,
        openEdit: (code) => setEditingCode(code),
        closeEdit: () => setEditingCode(null),

        fetchVouchers,
    };
}
