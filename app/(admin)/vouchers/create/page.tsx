'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import VoucherPreview from '@/app/components/VoucherPreview';

export default function CreateVoucherPage() {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
    const [discountValue, setDiscountValue] = useState<number | ''>('');
    const [minOrderValue, setMinOrderValue] = useState<number | ''>('');
    const [maxUsagePerUser, setMaxUsagePerUser] = useState<number | ''>('');
    const [forNewUser, setForNewUser] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('vouchers')
            .insert({
                code,
                title,
                description,
                discount_type: discountType,
                discount_value: discountValue,
                min_order_value: minOrderValue || null,
                max_usage_per_user:
                    maxUsagePerUser || null,
                for_new_user: forNewUser,
                is_active: isActive,
            });

        setSaving(false);

        if (error) {
            alert('Tạo voucher thất bại');
            return;
        }

        router.push('/vouchers');
    };

    return (
        <div className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-start">
                {/* LEFT FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
                >
                    <Field label="Code" value={code} onChange={setCode} required />
                    <Field label="Tiêu đề" value={title} onChange={setTitle} required />
                    <Textarea
                        label="Mô tả"
                        value={description}
                        onChange={setDescription}
                    />

                    {/* DISCOUNT */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#1b4f94]">
                            Loại giảm
                        </label>
                        <select
                            value={discountType}
                            onChange={(e) =>
                                setDiscountType(
                                    e.target.value as 'percent' | 'fixed'
                                )
                            }
                            className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
                        >
                            <option value="percent">%</option>
                            <option value="fixed">Số tiền</option>
                        </select>
                    </div>

                    <Field
                        label="Giá trị giảm"
                        type="number"
                        value={discountValue}
                        onChange={(v) =>
                            setDiscountValue(v === '' ? '' : Number(v))
                        }
                        required
                    />

                    <Field
                        label="Đơn tối thiểu"
                        type="number"
                        value={minOrderValue}
                        onChange={(v) =>
                            setMinOrderValue(v === '' ? '' : Number(v))
                        }
                    />

                    <Field
                        label="Giới hạn mỗi user"
                        type="number"
                        value={maxUsagePerUser}
                        onChange={(v) =>
                            setMaxUsagePerUser(v === '' ? '' : Number(v))
                        }
                    />

                    <Checkbox
                        label="Chỉ áp dụng cho khách mới"
                        checked={forNewUser}
                        onChange={setForNewUser}
                    />

                    <Checkbox
                        label="Kích hoạt voucher"
                        checked={isActive}
                        onChange={setIsActive}
                    />

                    {/* MOBILE PREVIEW BUTTON */}
                    <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="lg:hidden w-full rounded-xl border border-[#1b4f94] bg-white px-4 py-2 text-sm font-semibold text-[#1b4f94] hover:bg-blue-50"
                    >
                        Xem Preview
                    </button>

                    {/* ACTION */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-lg border px-4 py-2 text-sm"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-[#1b4f94] px-4 py-2 text-sm text-white disabled:opacity-50"
                        >
                            {saving ? 'Đang lưu...' : 'Tạo voucher'}
                        </button>
                    </div>
                </form>

                {/* RIGHT PREVIEW (Desktop only) */}
                <div className="hidden lg:block">
                    <VoucherPreview
                        code={code}
                        title={title}
                        description={description}
                        discountType={discountType}
                        discountValue={discountValue}
                        minOrderValue={minOrderValue}
                        maxUsagePerUser={maxUsagePerUser}
                        forNewUser={forNewUser}
                        isActive={isActive}
                    />
                </div>
            </div>
            {/* MOBILE PREVIEW MODAL */}
            {previewOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setPreviewOpen(false)}
                    />

                    {/* sheet */}
                    <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-[#F7F8FB] p-4 shadow-2xl">
                        <div className="flex justify-center">
                            <div className="h-1.5 w-10 rounded-full bg-gray-200" />
                        </div>
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-sm font-semibold text-[#1b4f94]">
                                Voucher
                            </div>

                            <button
                                onClick={() => setPreviewOpen(false)}
                                className="rounded-xl border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
                            >
                                X
                            </button>
                        </div>

                        <VoucherPreview
                            code={code}
                            title={title}
                            description={description}
                            discountType={discountType}
                            discountValue={discountValue}
                            minOrderValue={minOrderValue}
                            maxUsagePerUser={maxUsagePerUser}
                            forNewUser={forNewUser}
                            isActive={isActive}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

type FieldProps = {
    label: string;
    value: string | number | '';
    type?: 'text' | 'number';
    required?: boolean;
    onChange: (value: string) => void;
};

function Field({
    label,
    value,
    onChange,
    type = 'text',
    required,
}: FieldProps) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-semibold text-[#1b4f94]">
                {label}
            </label>
            <input
                type={type}
                value={value}
                required={required}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            />
        </div>
    );
}

function Textarea({
    label,
    value,
    onChange,
}: any) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-semibold text-[#1b4f94]">
                {label}
            </label>
            <textarea
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
            />
        </div>
    );
}

function Checkbox({
    label,
    checked,
    onChange,
}: any) {
    return (
        <label className="flex items-center gap-2 text-sm font-semibold text-[#1b4f94]">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="accent-[#1b4f94]"
            />
            {label}
        </label>
    );
}
