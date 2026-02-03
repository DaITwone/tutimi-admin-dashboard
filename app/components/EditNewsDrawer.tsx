'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl, uploadImageUnified } from '@/app/lib/storage';

type Props = {
  newsId: string;
  onClose: () => void;
  onUpdated: () => void;
};

type NewsForm = {
  title: string;
  description: string;
  content: string;
  type: string;
  hashtag: string;
  is_active: boolean;
  image: string | null;
};

export default function EditNewsDrawer({
  newsId,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<NewsForm>({
    title: '',
    description: '',
    content: '',
    hashtag: '',
    is_active: true,
    image: null,
    type: 'Tin Tức',
  });

  const [imageType, setImageType] = useState<'upload' | 'link'>('upload');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('news')
        .select(
          'title, description, content, type, hashtag, is_active, image'
        )
        .eq('id', newsId)
        .single();

      if (data) {
        setForm({
          title: data.title,
          description: data.description || '',
          content: data.content || '',
          hashtag: data.hashtag || '',
          type: data.type || 'Tin Tức',
          is_active: data.is_active,
          image: data.image,
        });
      }

      setLoading(false);
    };

    fetchNews();
  }, [newsId]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const handleSubmit = async () => {
    setSaving(true);

    let imagePath = form.image; // mặc định giữ ảnh cũ

    try {
      const hasNewUpload =
        imageType === 'upload' && newImage;

      const hasNewLink =
        imageType === 'link' && imageLink.trim();

      if (hasNewUpload || hasNewLink) {
        const fileName = `news-${newsId}`;

        imagePath = await uploadImageUnified(
          'products',
          hasNewUpload ? newImage : imageLink,
          fileName
        );
      }

      const { error } = await supabase
        .from('news')
        .update({
          title: form.title,
          description: form.description,
          content: form.content,
          hashtag: form.hashtag || null,
          is_active: form.is_active,
          image: imagePath,
          type: form.type,
        })
        .eq('id', newsId);

      if (error) throw error;

      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Cập nhật tin tức thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
          fixed z-50 bg-white shadow-2xl animate-slide-in
          inset-x-0 bottom-0 h-[92vh] w-full rounded-t-3xl
          md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-130 md:rounded-none
        "
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 md:px-6">
            <h2 className="text-lg font-semibold text-[#1c4273]">
              CẬP NHẬT TIN TỨC
            </h2>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div
            className={`flex-1 space-y-6 overflow-y-auto px-4 py-4 md:px-6 md:py-5 ${loading ? 'pointer-events-none opacity-50' : ''}`}
          >
            {loading ? (
              <p className="text-sm text-gray-500">
                Đang tải...
              </p>
            ) : (
              <>
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

                  <div className="flex gap-3">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-400 bg-gray-50">
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
                      ) : form.image ? (
                        <img
                          src={
                            getPublicImageUrl(
                              'products',
                              form.image
                            ) ?? ''
                          }
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
                        <label className="inline-block cursor-pointer rounded-lg border border-gray-400 px-4 py-2 text-sm hover:bg-gray-50">
                          Chọn ảnh mới
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
                          className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* TITLE */}
                <Input
                  label="Tiêu đề"
                  value={form.title}
                  onChange={(v) =>
                    setForm({ ...form, title: v })
                  }
                />

                {/* DESCRIPTION */}
                <Input
                  label="Mô tả ngắn"
                  value={form.description}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      description: v,
                    })
                  }
                />

                {/* CONTENT */}
                <Textarea
                  label="Nội dung"
                  value={form.content}
                  onChange={(v) =>
                    setForm({ ...form, content: v })
                  }
                />

                {/* HASHTAG */}
                <Input
                  label="Hashtag"
                  value={form.hashtag}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      hashtag: v,
                    })
                  }
                  placeholder="VD: sale, update"
                />

                {/* TYPE */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1b4f94]">
                    Loại tin
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, type: 'Tin Tức' })
                      }
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold
                        border-gray-300 text-gray-500 hover:bg-gray-50
                        ${form.type === 'Tin Tức' &&
                        'border-[#1b4f94] bg-[#1b4f94]/10 text-[#1b4f94]'}
                      `}
                    >
                      Tin tức
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, type: 'Khuyến Mãi' })
                      }
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition
                        border-gray-300 text-gray-500 hover:bg-gray-50
                        ${form.type === 'Khuyến Mãi' &&
                        'border-[#1b4f94] bg-[#1b4f94]/10 text-[#1b4f94]'}
                      `}
                    >
                      Khuyến mãi
                    </button>
                  </div>
                </div>


                {/* ACTIVE */}
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1b4f94]">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        is_active: e.target.checked,
                      })
                    }
                    className="accent-[#1b4f94]"
                  />
                  Hiển thị tin tức
                </label>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t px-4 py-4 md:px-6">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 rounded-lg bg-[#163f78] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b4f94] disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>

            <button
              onClick={onClose}
              className="flex-1 md:flex-none rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
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
type InputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

function Input({
  label,
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-[#1b4f94]">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
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
        value={value}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm"
      />
    </div>
  );
}
