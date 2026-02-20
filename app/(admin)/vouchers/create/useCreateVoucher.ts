'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

type DiscountType = 'percent' | 'fixed';

export function useCreateVoucher() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState<DiscountType>('percent');
    const [discountValue, setDiscountValue] = useState<number | ''>('');
    const [minOrderValue, setMinOrderValue] = useState<number | ''>('');
    const [maxUsagePerUser, setMaxUsagePerUser] = useState<number | ''>('');
    const [forNewUser, setForNewUser] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase.from('vouchers').insert({
            code,
            title,
            description,
            discount_type: discountType,
            discount_value: discountValue,
            min_order_value: minOrderValue || null,
            max_usage_per_user: maxUsagePerUser || null,
            for_new_user: forNewUser,
            is_active: isActive,
        });

        setSaving(false);

        if (error) {
            alert('Táº¡o voucher tháº¥t báº¡i');
            return;
        }

        router.push('/vouchers');
    };

    const handleCancel = () => {
        router.back();
    };

    return {
        code,
        setCode,
        title,
        setTitle,
        description,
        setDescription,
        discountType,
        setDiscountType,
        discountValue,
        setDiscountValue,
        minOrderValue,
        setMinOrderValue,
        maxUsagePerUser,
        setMaxUsagePerUser,
        forNewUser,
        setForNewUser,
        isActive,
        setIsActive,
        saving,
        previewOpen,
        setPreviewOpen,
        handleSubmit,
        handleCancel,
    };
}
