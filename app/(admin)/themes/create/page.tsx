// app/(admin)/themes/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { uploadImageUnified } from '@/app/lib/storage';
import ThemePreview from '@/app/components/ThemePreview';

export default function CreateThemePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [imageType, setImageType] = useState<'upload' | 'link'>('upload');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // 0) validate
    if (!name.trim()) {
      alert('Vui lòng nhập tên theme');
      setSaving(false);
      return;
    }

    if (imageType === 'upload' && !newImage) {
      alert('Vui lòng chọn ảnh nền');
      setSaving(false);
      return;
    }

    if (imageType === 'link' && !imageLink.trim()) {
      alert('Vui lòng dán link ảnh nền');
      setSaving(false);
      return;
    }

    try {
      /* 1) upload background trước */
      const tempFileName = `theme-${Date.now()}.png`;

      const imagePath = await uploadImageUnified(
        'products',
        imageType === 'upload' ? newImage : imageLink,
        tempFileName
      );

      if (!imagePath) {
        alert('Upload ảnh thất bại');
        setSaving(false);
        return;
      }

      /* 2) insert theme (background_uri NOT NULL) */
      const { data: theme, error } = await supabase
        .from('app_themes')
        .insert({
          name,
          is_active: false,
          background_uri: imagePath, // ✅ bắt buộc có
        })
        .select()
        .single();

      if (error || !theme) {
        console.error('Insert theme error:', error);
        alert('Tạo theme thất bại');
        setSaving(false);
        return;
      }

      /* 3) nếu bật active -> tắt theme khác rồi bật theme này */
      if (isActive) {
        await supabase
          .from('app_themes')
          .update({ is_active: false })
          .neq('id', '');

        await supabase
          .from('app_themes')
          .update({ is_active: true })
          .eq('id', theme.id);
      }

      setSaving(false);
      router.push('/themes');
    } catch (err) {
      console.error(err);
      alert('Tạo theme thất bại');
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-start">
      {/* LEFT FORM */}
      <div className="mt-6">
        <div className="max-w-150">
          <form
            onSubmit={handleSubmit}
            className="
              space-y-6
              rounded-2xl
              bg-white
              p-6
              shadow-sm
            "
          >
            {/* IMAGE */}
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
                <div
                  className="
                    h-40 w-28
                    flex items-center justify-center
                    overflow-hidden
                    rounded-xl
                    border border-dashed border-gray-400
                    bg-gray-50
                  "
                >
                  {imageType === 'upload' && newImage ? (
                    <img
                      src={URL.createObjectURL(newImage)}
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
                    <label
                      className="
                        inline-block cursor-pointer
                        rounded-lg border border-gray-400
                        px-4 py-2 text-sm
                        hover:bg-gray-50
                      "
                    >
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
                      className="
                        w-full rounded-lg border border-gray-400
                        px-3 py-2 text-sm
                        focus:border-[#1b4f94]
                        focus:outline-none
                        focus:ring-2 focus:ring-[#1b4f94]/20
                      "
                    />
                  )}
                </div>
              </div>
            </div>

            {/* NAME */}
            <Field label="Tên theme" value={name} onChange={setName} required />

            {/* ACTIVE */}
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1b4f94]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-[#1b4f94]"
              />
              Kích hoạt theme
            </label>

            {/* MOBILE PREVIEW BUTTON */}
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="lg:hidden w-full rounded-xl border border-[#1b4f94] bg-white px-4 py-2 text-sm font-semibold text-[#1b4f94] hover:bg-blue-50"
            >
              Xem Preview
            </button>


            {/* ACTION */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="
                  rounded-lg border border-gray-400
                  px-4 py-2 text-sm
                  hover:bg-gray-50
                "
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  rounded-lg
                  bg-[#1c4273]
                  px-4 py-2
                  text-sm font-medium
                  text-white
                  hover:bg-[#1b4f94]
                  disabled:opacity-50
                "
              >
                {saving ? 'Đang lưu...' : 'Tạo theme'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT PREVIEW (Desktop only) */}
      <div className="hidden lg:block">
        <ThemePreview
          name={name}
          image={imageType === 'upload' ? newImage : imageLink}
        />
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
                Create new theme
              </div>

              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
              >
                X
              </button>
            </div>

            <ThemePreview
              name={name}
              image={imageType === 'upload' ? newImage : imageLink}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== SMALL FIELD ===================== */
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
        className="
          w-full rounded-lg border border-gray-400
          px-3 py-2 text-sm
          focus:ring-2 focus:ring-[#1b4f94]/20
        "
      />
    </div>
  );
}
