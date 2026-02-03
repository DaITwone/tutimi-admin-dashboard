// app\(admin)\news\create\page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { uploadImageUnified } from '@/app/lib/storage';
import NewsPreview from '@/app/components/NewPreview';

export default function CreateNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [type, setType] = useState<'Tin Tức' | 'Khuyến Mãi'>('Tin Tức');
  const [isActive, setIsActive] = useState(true);
  const [imageType, setImageType] = useState<'upload' | 'link'>('upload');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setSaving(true);

    /* 1. create news first */
    const { data: news, error } = await supabase
      .from('news')
      .insert({
        title,
        description,
        content,
        hashtag: hashtag || null,
        is_active: isActive,
        image: null,
        type,
      })
      .select()
      .single();

    if (error || !news) {
      alert('Tạo tin tức thất bại');
      setSaving(false);
      return;
    }

    /* 2. upload image */
    const fileName = `news-${news.id}.png`;

    const imagePath = await uploadImageUnified(
      'products',
      imageType === 'upload'
        ? newImage
        : imageLink,
      fileName
    );

    /* 3. update image */
    if (imagePath) {
      await supabase
        .from('news')
        .update({ image: imagePath })
        .eq('id', news.id);
    }

    setSaving(false);
    router.push('/news');
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
                    onChange={() =>
                      setImageType('upload')
                    }
                    className="accent-[#1b4f94]"
                  />
                  Upload ảnh
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    checked={imageType === 'link'}
                    onChange={() =>
                      setImageType('link')
                    }
                    className="accent-[#1b4f94]"
                  />
                  Dán link
                </label>
              </div>

              <div className="flex gap-4">
                <div
                  className="
                  h-28 w-28
                  flex items-center justify-center
                  overflow-hidden
                  rounded-xl
                  border border-dashed border-gray-400
                  bg-gray-50
                "
                >
                  {imageType === 'upload' &&
                    newImage ? (
                    <img
                      src={URL.createObjectURL(
                        newImage
                      )}
                      className="h-full w-full object-cover"
                    />
                  ) : imageType === 'link' &&
                    imageLink ? (
                    <img
                      src={imageLink}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">
                      No image
                    </span>
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
                      onChange={(e) =>
                        setImageLink(e.target.value)
                      }
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

            {/* TITLE */}
            <Field
              label="Tiêu đề"
              value={title}
              required
              onChange={setTitle}
            />

            {/* DESCRIPTION */}
            <Field
              label="Mô tả ngắn"
              value={description}
              onChange={setDescription}
            />

            {/* CONTENT */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#1b4f94]">
                Nội dung
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                className="
                w-full rounded-lg border border-gray-400
                px-3 py-2 text-sm
                focus:ring-2 focus:ring-[#1b4f94]/20
              "
              />
            </div>

            {/* HASHTAG */}
            <Field
              label="Hashtag"
              value={hashtag}
              placeholder="VD: sale, update"
              onChange={setHashtag}
            />

            {/* TYPE */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#1b4f94]">
                Loại tin
              </label>

              {/* TYPE */}
              <div className="space-y-2">

                <div className="flex gap-4 text-sm font-semibold">
                  <button
                    type="button"
                    onClick={() => setType('Tin Tức')}
                    className={`rounded-lg border px-4 py-2
                      ${type === 'Tin Tức'
                        ? 'border-[#1b4f94] bg-[#1b4f94]/10 text-[#1b4f94]'
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                      }
                    `}
                  >
                    Tin tức
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('Khuyến Mãi')}
                    className={`rounded-lg border px-4 py-2
                      ${type === 'Khuyến Mãi'
                        ? 'border-[#1b4f94] bg-[#1b4f94]/10 text-[#1b4f94]'
                        : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                      }
                    `}
                  >
                    Khuyến mãi
                  </button>
                </div>
              </div>

            </div>

            {/* ACTIVE */}
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1b4f94]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(e.target.checked)
                }
                className="accent-[#1b4f94]"
              />
              Hiển thị tin tức
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
                {saving
                  ? 'Đang lưu...'
                  : 'Tạo tin tức'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT PREVIEW (Desktop only) */}
      <div className="hidden lg:block">
        <NewsPreview
          title={title}
          description={description}
          content={content}
          hashtag={hashtag}
          type={type}
          image={newImage || imageLink}
          createdAt={new Date().toLocaleDateString('vi-VN')}
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
                Tin Tức - Ưu đãi
              </div>

              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
              >
                X
              </button>
            </div>

            <NewsPreview
              title={title}
              description={description}
              content={content}
              hashtag={hashtag}
              type={type}
              image={newImage || imageLink}
              createdAt={new Date().toLocaleDateString('vi-VN')}
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
      <label className="text-sm font-semibold text-[#1b4f94]">
        {label}
      </label>
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
