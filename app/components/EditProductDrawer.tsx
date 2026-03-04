'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl, uploadImageUnified } from '@/app/lib/storage';

type Props = {
  productId: string;
  onClose: () => void;
  onUpdated: () => void;
};

type ProductForm = {
  name: string;
  price: number;
  sale_price: number | null;
  stats: string;
  is_best_seller: boolean;
  image: string | null;
};

export default function EditProductDrawer({ productId, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    price: 0,
    sale_price: null,
    stats: '',
    is_best_seller: false,
    image: null,
  });

  const [imageType, setImageType] = useState<'upload' | 'link'>('upload');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imageLink, setImageLink] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select('name, price, sale_price, stats, is_best_seller, image')
        .eq('id', productId)
        .single();

      if (data) {
        setForm({
          name: data.name,
          price: data.price,
          sale_price: data.sale_price,
          stats: data.stats || '',
          is_best_seller: data.is_best_seller,
          image: data.image,
        });
      }

      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const handleSubmit = async () => {
    setSaving(true);
    let imagePath = form.image;

    try {
      const hasNewUpload = imageType === 'upload' && newImage;
      const hasNewLink = imageType === 'link' && imageLink.trim();

      if (hasNewUpload || hasNewLink) {
        const fileName = `product-${productId}`;
        imagePath = await uploadImageUnified('products', hasNewUpload ? newImage : imageLink, fileName);
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: form.name,
          price: form.price,
          sale_price: form.sale_price,
          stats: form.stats,
          is_best_seller: form.is_best_seller,
          image: imagePath,
        })
        .eq('id', productId);

      if (error) throw error;

      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Cập nhật sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        className="
          fixed z-50 border border-border bg-card text-card-foreground shadow-2xl animate-slide-in
          inset-x-0 bottom-0 h-[92vh] w-full rounded-t-3xl
          md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-105 md:rounded-none md:border-l
        "
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
            <h2 className="text-lg font-semibold text-brand-1 dark:text-brand-2">CẬP NHẬT SẢN PHẨM</h2>

            <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition hover:bg-muted/60">
              ✕
            </button>
          </div>

          <div
            className={`flex-1 space-y-6 overflow-y-auto px-4 py-4 md:px-6 md:py-5 ${
              loading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {loading ? (
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            ) : (
              <>
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

                  <div className="flex gap-3">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
                      {imageType === 'upload' && newImage ? (
                        <img src={URL.createObjectURL(newImage)} className="h-full w-full object-cover transition-transform hover:scale-105" />
                      ) : imageType === 'link' && imageLink ? (
                        <img src={imageLink} className="h-full w-full object-cover transition-transform hover:scale-105" />
                      ) : form.image ? (
                        <img
                          src={getPublicImageUrl('products', form.image) ?? ''}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">No image</span>
                      )}
                    </div>

                    <div className="flex-1">
                      {imageType === 'upload' ? (
                        <label className="inline-block cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-muted/50">
                          Chọn ảnh mới
                          <input
                            type="file"
                            accept="image/*"
                            hidden
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

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-brand-2">Tên sản phẩm</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2 focus:ring-2 focus:ring-brand-2/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-brand-2">Giá gốc</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2 focus:ring-2 focus:ring-brand-2/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-brand-2">Giá khuyến mãi</label>
                  <input
                    type="number"
                    value={form.sale_price ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sale_price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2 focus:ring-2 focus:ring-brand-2/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-brand-2">Trạng thái</label>
                  <input
                    value={form.stats}
                    onChange={(e) => setForm({ ...form, stats: e.target.value })}
                    placeholder="VD: 5k+ đã bán"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand-2 focus:ring-2 focus:ring-brand-2/20"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm font-semibold text-brand-2">
                  <input
                    type="checkbox"
                    checked={form.is_best_seller}
                    onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })}
                    className="accent-brand-2"
                  />
                  Best seller
                </label>
              </>
            )}
          </div>

          <div className="flex gap-3 border-t border-border px-4 py-4 md:px-6">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 rounded-full bg-brand-1 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-2 disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>

            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-muted/50 md:flex-none"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
