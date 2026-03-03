'use client';

import type { FormEvent } from 'react';
import type { ImageInputType, NewsType } from './types';

type CreateNewsFormProps = {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  hashtag: string;
  setHashtag: (value: string) => void;
  type: NewsType;
  setType: (value: NewsType) => void;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  imageType: ImageInputType;
  setImageType: (value: ImageInputType) => void;
  setNewImage: (value: File | null) => void;
  imageLink: string;
  setImageLink: (value: string) => void;
  previewImage: string | null;
  saving: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onOpenPreview: () => void;
};

export default function CreateNewsForm({
  title,
  setTitle,
  description,
  setDescription,
  content,
  setContent,
  hashtag,
  setHashtag,
  type,
  setType,
  isActive,
  setIsActive,
  imageType,
  setImageType,
  setNewImage,
  imageLink,
  setImageLink,
  previewImage,
  saving,
  onSubmit,
  onCancel,
  onOpenPreview,
}: CreateNewsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-3">
        <div className="flex gap-6 text-sm font-semibold text-brand-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              checked={imageType === 'upload'}
              onChange={() => setImageType('upload')}
              className="accent-brand-2"
            />
            Upload ảnh
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              checked={imageType === 'link'}
              onChange={() => setImageType('link')}
              className="accent-brand-2"
            />
            Dán link
          </label>
        </div>

        <div className="flex gap-4">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
            {previewImage ? (
              <img src={previewImage} className="h-full w-full object-cover" alt="news-preview" />
            ) : (
              <span className="text-xs text-muted-foreground">No image</span>
            )}
          </div>

          <div className="flex-1">
            {imageType === 'upload' ? (
              <label className="inline-block cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-muted/50">
                Chọn ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
                />
              </label>
            ) : (
              <input
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2 focus:ring-2 focus:ring-brand-2/20"
              />
            )}
          </div>
        </div>
      </div>

      <Field label="Tiêu đề" value={title} required onChange={setTitle} />

      <Field label="Mô tả ngắn" value={description} onChange={setDescription} />

      <div className="space-y-1">
        <label className="text-sm font-semibold text-brand-2">Nội dung</label>
        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2 focus:ring-2 focus:ring-brand-2/20"
        />
      </div>

      <Field label="Hashtag" value={hashtag} placeholder="VD: sale, update" onChange={setHashtag} />

      <div className="space-y-1">
        <label className="text-sm font-semibold text-brand-2">Loại tin</label>
        <div className="flex gap-4 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setType('Tin Tức')}
            className={`rounded-lg border px-4 py-2 transition ${
              type === 'Tin Tức'
                ? 'border-brand-2 bg-brand-2/10 text-brand-2'
                : 'border-border text-muted-foreground hover:bg-muted/50'
            }`}
          >
            Tin tức
          </button>

          <button
            type="button"
            onClick={() => setType('Khuyến Mãi')}
            className={`rounded-lg border px-4 py-2 transition ${
              type === 'Khuyến Mãi'
                ? 'border-brand-2 bg-brand-2/10 text-brand-2'
                : 'border-border text-muted-foreground hover:bg-muted/50'
            }`}
          >
            Khuyến mãi
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-brand-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="accent-brand-2"
        />
        Hiển thị tin tức
      </label>

      <button
        type="button"
        onClick={onOpenPreview}
        className="w-full rounded-xl border border-brand-2 bg-card px-4 py-2 text-sm font-semibold text-brand-2 transition hover:bg-muted/50 lg:hidden"
      >
        Xem Preview
      </button>

      <div className="flex justify-end gap-3">
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
          className="rounded-lg bg-brand-1 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-2 disabled:opacity-50"
        >
          {saving ? 'Đang lưu...' : 'Tạo tin tức'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-brand-2">{label}</label>
      <input
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2 focus:ring-2 focus:ring-brand-2/20"
      />
    </div>
  );
}
