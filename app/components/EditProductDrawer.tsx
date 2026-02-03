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

export default function EditProductDrawer({
    productId,
    onClose,
    onUpdated,
}: Props) {
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
                .select(
                    'name, price, sale_price, stats, is_best_seller, image'
                )
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

        let imagePath = form.image; // mặc định giữ ảnh cũ

        try {
            const hasNewUpload =
                imageType === 'upload' && newImage;

            const hasNewLink =
                imageType === 'link' && imageLink.trim();

            if (hasNewUpload || hasNewLink) {
                const fileName = `product-${productId}`;

                imagePath = await uploadImageUnified(
                    'products',
                    hasNewUpload ? newImage : imageLink,
                    fileName
                );
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
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className="
                    fixed z-50 bg-white shadow-2xl
                    animate-slide-in
                    inset-x-0 bottom-0 h-[92vh] w-full rounded-t-3xl
                    md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[420px] md:rounded-none
                "
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-4 py-3 md:px-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[#1c4273]">
                                CẬP NHẬT SẢN PHẨM
                            </h2>
                        </div>

                        <button
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-gray-100"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div
                        className={`flex-1 space-y-6 overflow-y-auto px-4 py-4 md:px-6 md:py-5
                            ${loading
                                ? 'opacity-50 pointer-events-none'
                                : ''
                            }`}
                    >
                        {loading ? (
                            <p className="text-sm text-gray-500">
                                Đang tải...
                            </p>
                        ) : (
                            <>
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
                                    <div className="flex gap-3">
                                        <div
                                            className="h-28 w-28 overflow-hidden rounded-xl border border-gray-400 border-dashed bg-gray-50 flex items-center justify-center"
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
                                            ) : form.image ? (
                                                <img
                                                    src={
                                                        getPublicImageUrl(
                                                            'products',
                                                            form.image
                                                        ) ?? ''
                                                    }
                                                    className="h-full w-full object-cover transition-transform hover:scale-105"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    No image
                                                </span>
                                            )}
                                        </div>

                                        {/* INPUT */}
                                        <div className="flex-1">
                                            {imageType === 'upload' ? (
                                                <label className="inline-block cursor-pointer rounded-lg border border-gray-400 px-4 py-2 text-sm hover:bg-gray-50">
                                                    Chọn ảnh mới
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
                                                        setImageLink(e.target.value)
                                                    }
                                                    placeholder="https://..."
                                                    className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:border-[#1b4f94] focus:outline-none focus:ring-2 focus:ring-[#1b4f94]/20"
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
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:border-[#1b4f94] focus:outline-none focus:ring-2 focus:ring-[#1b4f94]/20"
                                    />
                                </div>

                                {/* PRICE */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-[#1b4f94]">
                                        Giá gốc
                                    </label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                price: Number(e.target.value),
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-[#1b4f94]/20"
                                    />
                                </div>

                                {/* SALE */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-[#1b4f94]">
                                        Giá khuyến mãi
                                    </label>
                                    <input
                                        type="number"
                                        value={form.sale_price ?? ''}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                sale_price: e.target.value
                                                    ? Number(e.target.value)
                                                    : null,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-[#1b4f94]/20"
                                    />
                                </div>

                                {/* STATS */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-[#1b4f94]">
                                        Trạng thái
                                    </label>
                                    <input
                                        value={form.stats}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                stats: e.target.value,
                                            })
                                        }
                                        placeholder="VD: 5k+ đã bán"
                                        className="w-full rounded-lg border border-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-[#1b4f94]/20"
                                    />
                                </div>

                                {/* BEST SELLER */}
                                <label className="flex items-center gap-2 text-sm font-semibold text-[#1b4f94]">
                                    <input
                                        type="checkbox"
                                        checked={form.is_best_seller}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                is_best_seller:
                                                    e.target.checked,
                                            })
                                        }
                                        className="accent-[#1b4f94]"
                                    />
                                    Best seller
                                </label>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 border-t px-4 py-4 md:px-6">
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex-1 rounded-full bg-[#163f78] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1b4f94] disabled:opacity-50"
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
