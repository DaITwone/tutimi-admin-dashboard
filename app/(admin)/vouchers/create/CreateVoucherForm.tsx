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
      className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <Field label="Code" value={code} onChange={setCode} required />
      <Field label="Tiêu đề" value={title} onChange={setTitle} required />
      <Textarea label="Mô tả" value={description} onChange={setDescription} />

      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-2">Loại giảm</label>
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value as DiscountType)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2"
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

      <button
        type="button"
        onClick={onOpenPreview}
        className="w-full rounded-xl border border-brand-2 bg-card px-4 py-2 text-sm font-semibold text-brand-2 transition hover:bg-muted/50 lg:hidden"
      >
        Xem Preview
      </button>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-muted/50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-2 px-4 py-2 text-sm text-white transition hover:bg-brand-1 disabled:opacity-50"
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

function Field({ label, value, onChange, type = 'text', required }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-brand-2">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2"
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
      <label className="text-sm font-semibold text-brand-2">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2"
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
    <label className="flex items-center gap-2 text-sm font-semibold text-brand-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-brand-2"
      />
      {label}
    </label>
  );
}
