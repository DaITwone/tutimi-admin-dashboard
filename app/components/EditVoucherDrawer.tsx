'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

/* ===================== TYPES ===================== */
type Props = {
    code: string;
    onClose: () => void;
    onUpdated: () => void;
};

type VoucherForm = {
    code: string;
    title: string;
    description: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number | '';
    min_order_value: number | '';
    max_usage_per_user: number | '';
    for_new_user: boolean;
    is_active: boolean;
};

/* ===================== COMPONENT ===================== */
export default function EditVoucherDrawer({
    code,
    onClose,
    onUpdated,
}: Props) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState<VoucherForm>({
        code: '',
        title: '',
        description: '',
        discount_type: 'percent',
        discount_value: '',
        min_order_value: '',
        max_usage_per_user: '',
        for_new_user: false,
        is_active: true,
    });

    /* -------------------- FETCH -------------------- */
    useEffect(() => {
        const fetchVoucher = async () => {
            const { data } = await supabase
                .from('vouchers')
                .select(`
          code,
          title,
          description,
          discount_type,
          discount_value,
          min_order_value,
          max_usage_per_user,
          for_new_user,
          is_active
        `)
                .eq('code', code)
                .single();

            if (data) {
                setForm({
                    code: data.code,
                    title: data.title,
                    description: data.description || '',
                    discount_type: data.discount_type,
                    discount_value: data.discount_value,
                    min_order_value: data.min_order_value ?? '',
                    max_usage_per_user:
                        data.max_usage_per_user ?? '',
                    for_new_user: data.for_new_user,
                    is_active: data.is_active,
                });
            }

            setLoading(false);
        };

        fetchVoucher();
    }, [code]);

    /* -------------------- ESC TO CLOSE -------------------- */
    useEffect(() => {
        const esc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', esc);
        return () =>
            window.removeEventListener('keydown', esc);
    }, [onClose]);

    /* -------------------- SUBMIT -------------------- */
    const handleSubmit = async () => {
        setSaving(true);

        const { error } = await supabase
            .from('vouchers')
            .update({
                title: form.title,
                description: form.description,
                discount_type: form.discount_type,
                discount_value: form.discount_value,
                min_order_value:
                    form.min_order_value || null,
                max_usage_per_user:
                    form.max_usage_per_user || null,
                for_new_user: form.for_new_user,
                is_active: form.is_active,
            })
            .eq('code', code);

        setSaving(false);

        if (error) {
            alert('Cập nhật voucher thất bại');
            return;
        }

        onUpdated();
        onClose();
    };

    /* ===================== UI ===================== */
    return (
        <>
            {/* OVERLAY */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* DRAWER */}
            <div className="fixed right-0 top-0 z-50 h-full w-120 bg-white shadow-2xl animate-slide-in">
                <div
                    className={`h-full overflow-y-auto px-6 py-5 ${loading ? 'pointer-events-none opacity-50' : ''
                        }`}
                >
                    {/* HEADER */}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#1c4273]">
                            CẬP NHẬT VOUCHER
                        </h2>

                        <button
                            onClick={onClose}
                            className="rounded-full px-2 py-1 text-lg hover:bg-gray-100"
                        >
                            ✕
                        </button>
                    </div>

                    {/* FORM */}
                    <div className="space-y-4">
                        <Field
                            label="Code"
                            value={form.code}
                            disabled
                            onChange={() => { }}
                        />

                        <Field
                            label="Tiêu đề"
                            value={form.title}
                            onChange={(v) =>
                                setForm({ ...form, title: v })
                            }
                        />

                        <Textarea
                            label="Mô tả"
                            value={form.description}
                            onChange={(v) =>
                                setForm({ ...form, description: v })
                            }
                        />

                        {/* DISCOUNT TYPE */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-[#1b4f94]">
                                Loại giảm
                            </label>
                            <select
                                value={form.discount_type}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        discount_type: e.target.value as
                                            | 'percent'
                                            | 'fixed',
                                    })
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
                            value={form.discount_value}
                            onChange={(v) =>
                                setForm({
                                    ...form,
                                    discount_value:
                                        v === '' ? '' : Number(v),
                                })
                            }
                        />

                        <Field
                            label="Đơn tối thiểu"
                            type="number"
                            value={form.min_order_value}
                            onChange={(v) =>
                                setForm({
                                    ...form,
                                    min_order_value:
                                        v === '' ? '' : Number(v),
                                })
                            }
                        />

                        <Field
                            label="Giới hạn mỗi user"
                            type="number"
                            value={form.max_usage_per_user}
                            onChange={(v) =>
                                setForm({
                                    ...form,
                                    max_usage_per_user:
                                        v === '' ? '' : Number(v),
                                })
                            }
                        />

                        <Checkbox
                            label="Chỉ áp dụng cho khách mới"
                            checked={form.for_new_user}
                            onChange={(v) =>
                                setForm({
                                    ...form,
                                    for_new_user: v,
                                })
                            }
                        />

                        <Checkbox
                            label="Kích hoạt voucher"
                            checked={form.is_active}
                            onChange={(v) =>
                                setForm({
                                    ...form,
                                    is_active: v,
                                })
                            }
                        />
                    </div>

                    {/* ACTION */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex-1 rounded-lg bg-[#1b4f94] px-4 py-2 text-sm text-white hover:bg-[#1c4273] disabled:opacity-50"
                        >
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>

                        <button
                            onClick={onClose}
                            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

}

/* ===================== SMALL UI ===================== */
type FieldProps = {
    label: string;
    value: string | number | '';
    type?: 'text' | 'number';
    disabled?: boolean;
    onChange: (value: string) => void;
};

function Field({
    label,
    value,
    onChange,
    type = 'text',
    disabled,
}: FieldProps) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-semibold text-[#1b4f94]">
                {label}
            </label>
            <input
                type={type}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm disabled:bg-gray-100"
            />
        </div>
    );
}

type TextareaProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
};

function Textarea({
    label,
    value,
    onChange,
}: TextareaProps) {
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

function Checkbox({
    label,
    checked,
    onChange,
}: CheckboxProps) {
    return (
        <label className="flex items-center gap-2 text-sm font-semibold text-[#1b4f94]">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) =>
                    onChange(e.target.checked)
                }
                className="accent-[#1b4f94]"
            />
            {label}
        </label>
    );
}
