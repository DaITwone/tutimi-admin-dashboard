'use client';

import { useEffect, useState } from 'react';
import ThemePreview from '@/app/components/ThemePreview';
import type { ThemeImageType } from '../hooks/useCreateTheme';

type CreateThemeViewProps = {
  name: string;
  setName: (value: string) => void;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  imageType: ThemeImageType;
  setImageType: (value: ThemeImageType) => void;
  newImage: File | null;
  setNewImage: (file: File | null) => void;
  imageLink: string;
  setImageLink: (value: string) => void;
  saving: boolean;
  previewOpen: boolean;
  setPreviewOpen: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  handleCancel: () => void;
};

export default function CreateThemeView({
  name,
  setName,
  isActive,
  setIsActive,
  imageType,
  setImageType,
  newImage,
  setNewImage,
  imageLink,
  setImageLink,
  saving,
  previewOpen,
  setPreviewOpen,
  handleSubmit,
  handleCancel,
}: CreateThemeViewProps) {
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState('');

  useEffect(() => {
    if (!newImage) {
      setUploadPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(newImage);
    setUploadPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [newImage]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-start">
      <div className="mt-6">
        <div className="max-w-150">
          <form
            onSubmit={handleSubmit}
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
                <div className="h-40 w-28 flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-400 bg-gray-50">
                  {imageType === 'upload' && uploadPreviewUrl ? (
                    <img
                      src={uploadPreviewUrl}
                      className="h-full w-full object-cover"
                      alt="theme-preview"
                    />
                  ) : imageType === 'link' && imageLink ? (
                    <img
                      src={imageLink}
                      className="h-full w-full object-cover"
                      alt="theme-preview"
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
                          setNewImage(e.target.files ? e.target.files[0] : null)
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

            <Field label="Tên theme" value={name} onChange={setName} required />

            <label className="flex items-center gap-2 text-sm font-semibold text-[#1b4f94]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-[#1b4f94]"
              />
              Kích hoạt theme
            </label>

            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="lg:hidden w-full rounded-xl border border-[#1b4f94] bg-white px-4 py-2 text-sm font-semibold text-[#1b4f94] hover:bg-blue-50"
            >
              Xem Preview
            </button>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-gray-400 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#1c4273] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b4f94] disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Tạo theme'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block">
        <ThemePreview name={name} image={imageType === 'upload' ? newImage : imageLink} />
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPreviewOpen(false)}
          />

          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-[#F7F8FB] p-4 shadow-2xl">
            <div className="flex justify-center">
              <div className="h-1.5 w-10 rounded-full bg-gray-200" />
            </div>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-[#1b4f94]">Create new theme</div>

              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
              >
                X
              </button>
            </div>

            <ThemePreview name={name} image={imageType === 'upload' ? newImage : imageLink} />
          </div>
        </div>
      )}
    </div>
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
      <label className="text-sm font-semibold text-[#1b4f94]">{label}</label>
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


