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
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="space-y-3">
        <div className="flex gap-6 text-sm font-semibold text-[#1b4f94]">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              checked={imageType === 'upload'}
              onChange={() => setImageType('upload')}
              className="accent-[#1b4f94]"
            />
            Upload ảnh
          </label>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              checked={imageType === 'link'}
              onChange={() => setImageType('link')}
              className="accent-[#1b4f94]"
            />
            Dán link
          </label>
        </div>

        <div className="flex gap-4">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-400 bg-gray-50">
            {previewImage ? (
              <img
                src={previewImage}
                className="h-full w-full object-cover"
                alt="news-preview"
              />
            ) : (
              <span className="text-xs text-gray-400">No image</span>
            )}
          </div>

          <div className="flex-1">
            {imageType === 'upload' ? (
              <label className="inline-block cursor-pointer rounded-lg border border-gray-400 px-4 py-2 text-sm hover:bg-gray-50">
                Chọn ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    setNewImage(
                      e.target.files
                        ? e.target.files[0]
                        : null
                    )
                  }
                />
              </label>
            ) : (
              <input
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:border-[#1b4f94] focus:outline-none focus:ring-2 focus:ring-[#1b4f94]/20"
              />
            )}
          </div>
        </div>
      </div>

      <Field
        label="Tiêu đề"
        value={title}
        required
        onChange={setTitle}
      />

      <Field
        label="Mô tả ngắn"
        value={description}
        onChange={setDescription}
      />

      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#1b4f94]">
          Nội dung
        </label>
        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-[#1b4f94]/20"
        />
      </div>

      <Field
        label="Hashtag"
        value={hashtag}
        placeholder="VD: sale, update"
        onChange={setHashtag}
      />

      <div className="space-y-1">
        <label className="text-sm font-semibold text-[#1b4f94]">
          Loại tin
        </label>
        <div className="flex gap-4 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setType('Tin Tức')}
            className={`rounded-lg border px-4 py-2 ${
              type === 'Tin Tức'
                ? 'border-[#1b4f94] bg-[#1b4f94]/10 text-[#1b4f94]'
                : 'border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
          >
            Tin tức
          </button>

          <button
            type="button"
            onClick={() => setType('Khuyến Mãi')}
            className={`rounded-lg border px-4 py-2 ${
              type === 'Khuyến Mãi'
                ? 'border-[#1b4f94] bg-[#1b4f94]/10 text-[#1b4f94]'
                : 'border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
          >
            Khuyến mãi
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-[#1b4f94]">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="accent-[#1b4f94]"
        />
        Hiển thị tin tức
      </label>

      <button
        type="button"
        onClick={onOpenPreview}
        className="w-full rounded-xl border border-[#1b4f94] bg-white px-4 py-2 text-sm font-semibold text-[#1b4f94] hover:bg-blue-50 lg:hidden"
      >
        Xem Preview
      </button>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-400 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Hủy
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#1c4273] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b4f94] disabled:opacity-50"
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
      <label className="text-sm font-semibold text-[#1b4f94]">
        {label}
      </label>
      <input
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-[#1b4f94]/20"
      />
    </div>
  );
}
