'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

type ProductForm = {
  name: string;
  price: number;
  sale_price: number | null;
  stats: string;
  is_best_seller: boolean;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<ProductForm>({
    name: '',
    price: 0,
    sale_price: null,
    stats: '',
    is_best_seller: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------- FETCH PRODUCT -------------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('name, price, sale_price, stats, is_best_seller')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Không tìm thấy sản phẩm');
        setLoading(false);
        return;
      }

      setForm({
        name: data.name,
        price: data.price,
        sale_price: data.sale_price,
        stats: data.stats || '',
        is_best_seller: data.is_best_seller,
      });

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from('products')
      .update({
        name: form.name,
        price: form.price,
        sale_price: form.sale_price || null,
        stats: form.stats,
        is_best_seller: form.is_best_seller,
      })
      .eq('id', id);

    if (error) {
      setError('Cập nhật sản phẩm thất bại');
      setSaving(false);
      return;
    }

    router.push('/products');
    router.refresh();
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-xl space-y-6 mt-5">
      <h1 className="text-xl font-semibold">Sửa sản phẩm</h1>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Tên sản phẩm
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#1b4f94]"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Giá gốc
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#1b4f94]"
            required
          />
        </div>

        {/* Sale price */}
        <div>
          <label className="mb-1 block text-sm font-medium">
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
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#1b4f94]"
          />
        </div>

        {/* Stats */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Trạng thái
          </label>
          <input
            type="text"
            value={form.stats}
            onChange={(e) =>
              setForm({ ...form, stats: e.target.value })
            }
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#1b4f94]"
            placeholder="Còn hàng / Hết hàng..."
          />
        </div>

        {/* Best seller */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_best_seller}
            onChange={(e) =>
              setForm({
                ...form,
                is_best_seller: e.target.checked,
              })
            }
          />
          <label className="text-sm">Best seller</label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273] disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border px-4 py-2"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
