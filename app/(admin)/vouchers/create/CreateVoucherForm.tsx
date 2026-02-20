'use client';

import React from 'react';

type DiscountType = 'percent' | 'fixed';

type CreateVoucherFormProps = {
    code: string;
    setCode: (value: string) => void;
    title: string;
    setTitle: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    discountType: DiscountType;
    setDiscountType: (value: DiscountType) => void;
    discountValue: number | '';
    setDiscountValue: (value: number | '') => void;
    minOrderValue: number | '';
    setMinOrderValue: (value: number | '') => void;
    maxUsagePerUser: number | '';
    setMaxUsagePerUser: (value: number | '') => void;
    forNewUser: boolean;
    setForNewUser: (value: boolean) => void;
    isActive: boolean;
    setIsActive: (value: boolean) => void;
    saving: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    onOpenPreview: () => void;
};

export default function CreateVoucherForm({
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
    onSubmit,
    onCancel,
    onOpenPreview,
}: CreateVoucherFormProps) {
    return (
        <form
            onSubmit={onSubmit}
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
                        setDiscountType(e.target.value as DiscountType)
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
                onChange={(v) => setDiscountValue(v === '' ? '' : Number(v))}
                required
            />

            <Field
                label="Đơn tối thiểu"
                type="number"
                value={minOrderValue}
                onChange={(v) => setMinOrderValue(v === '' ? '' : Number(v))}
            />

            <Field
                label="Giới hạn mỗi user"
                type="number"
                value={maxUsagePerUser}
                onChange={(v) => setMaxUsagePerUser(v === '' ? '' : Number(v))}
            />

            <Checkbox
                label="Chỉ áp dụng khách hàng mới"
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
                onClick={onOpenPreview}
                className="lg:hidden w-full rounded-xl border border-[#1b4f94] bg-white px-4 py-2 text-sm font-semibold text-[#1b4f94] hover:bg-blue-50"
            >
                Xem Preview
            </button>

            {/* ACTION */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
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

type TextareaProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
};

function Textarea({ label, value, onChange }: TextareaProps) {
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

type CheckboxProps = {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
};

function Checkbox({ label, checked, onChange }: CheckboxProps) {
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
