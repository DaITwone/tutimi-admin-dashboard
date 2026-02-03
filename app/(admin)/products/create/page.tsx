'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { uploadImageUnified } from '@/app/lib/storage';
import ProductPreview from '@/app/components/ProductPreview';

export default function CreateProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | null>(null);
  const [stats, setStats] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);
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

    /* 1. tạo product trước */
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        price,
        sale_price: salePrice,
        stats,
        is_best_seller: isBestSeller,
        image: null,
      })
      .select()
      .single();

    if (error || !product) {
      alert('Tạo sản phẩm thất bại');
      setSaving(false);
      return;
    }

    /* 2. upload image */
    const fileName = `product-${product.id}.png`;

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
        .from('products')
        .update({ image: imagePath })
        .eq('id', product.id);
    }

    setSaving(false);
    router.push('/products');
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-start">
        {/* LEFT: FORM */}
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
              {/* TYPE */}
              <div className="flex gap-6 text-sm font-semibold text-[#1b4f94]">
                <label className="flex items-center gap-2 cursor-pointer">
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

                <label className="flex items-center gap-2 cursor-pointer">
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

              {/* PREVIEW */}
              <div className="flex gap-4">
                <div
                  className="
                h-28 w-28
                overflow-hidden
                rounded-xl
                border border-dashed border-gray-400
                bg-gray-50
                flex items-center justify-center
              "
                >
                  {imageType === 'upload' &&
                    newImage ? (
                    <img
                      src={URL.createObjectURL(
                        newImage
                      )}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  ) : imageType === 'link' &&
                    imageLink ? (
                    <img
                      src={imageLink}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
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
                    inline-block
                    cursor-pointer
                    rounded-lg
                    border border-gray-400
                    px-4 py-2
                    text-sm
                    hover:bg-gray-50
                  "
                    >
                      Chọn ảnh
                      <input
                        type="file"
                        accept="image/*"
                        hidden
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
                        setImageLink(
                          e.target.value
                        )
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

            {/* NAME */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#1b4f94]">
                Tên sản phẩm
              </label>
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                className="
              w-full rounded-lg border border-gray-400
              px-3 py-2 text-sm
              focus:border-[#1b4f94]
              focus:outline-none
              focus:ring-2 focus:ring-[#1b4f94]/20
            "
              />
            </div>

            {/* PRICE */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#1b4f94]">
                Giá gốc
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  const value =
                    e.target.value;
                  setPrice(
                    value === ''
                      ? ''
                      : Number(value)
                  );
                }}
                required
                className="
              w-full rounded-lg border border-gray-400
              px-3 py-2 text-sm
              focus:ring-2 focus:ring-[#1b4f94]/20
            "
              />
            </div>

            {/* SALE */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#1b4f94]">
                Giá khuyến mãi
              </label>
              <input
                type="number"
                value={salePrice ?? ''}
                onChange={(e) =>
                  setSalePrice(
                    e.target.value
                      ? Number(e.target.value)
                      : null
                  )
                }
                className="
              w-full rounded-lg border border-gray-400
              px-3 py-2 text-sm
              focus:ring-2 focus:ring-[#1b4f94]/20
            "
              />
            </div>

            {/* STATS */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-[#1b4f94]">
                Trạng thái
              </label>
              <input
                value={stats}
                onChange={(e) =>
                  setStats(e.target.value)
                }
                placeholder="VD: 5k+ đã bán"
                className="
              w-full rounded-lg border border-gray-400
              px-3 py-2 text-sm
              focus:ring-2 focus:ring-[#1b4f94]/20
            "
              />
            </div>

            {/* BEST SELLER */}
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1b4f94]">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) =>
                  setIsBestSeller(
                    e.target.checked
                  )
                }
                className="accent-[#1b4f94]"
              />
              Best seller
            </label>

            {/* MOBILE PREVIEW BUTTON */}
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="lg:hidden w-full rounded-xl border border-[#1b4f94] bg-white px-4 py-2 text-sm font-semibold text-[#1b4f94] hover:bg-blue-50"
            >
              Xem preview
            </button>

            {/* ACTION */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-gray-400 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#1c4273] px-4 py-2 text-sm font-medium text-white hover:bg-[#1b4f94] disabled:opacity-50"
              >
                {saving
                  ? 'Đang lưu...'
                  : 'Tạo sản phẩm'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: PREVIEW (Desktop only) */}
        <div className="hidden lg:block">
          <ProductPreview
            name={name}
            price={price}
            salePrice={salePrice}
            image={newImage || imageLink}
            stats={stats}
            isBestSeller={isBestSeller}
          />
        </div>
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
                Trang sản phẩm 
              </div>

              <button
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
              >
                X
              </button>
            </div>

            <ProductPreview
              name={name}
              price={price}
              salePrice={salePrice}
              image={newImage || imageLink}
              stats={stats}
              isBestSeller={isBestSeller}
            />
          </div>
        </div>
      )}
    </div>
  );
}
