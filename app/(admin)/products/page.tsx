'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl } from '@/app/lib/storage';
import { Search } from 'lucide-react';
import EditProductDrawer from '@/app/components/EditProductDrawer';
import ConfirmDeleteDrawer from '@/app/components/ConfirmDeleteDrawer';

/* ===================== TYPES ===================== */
type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  stats: string | null;
  is_best_seller: boolean;
  image: string | null;
};

type Category = {
  id: string;
  title: string;
};

/* ===================== COMPONENT ===================== */
export default function ProductsPage() {
  const router = useRouter();

  /* -------------------- STATE -------------------- */
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const SKELETON_ROWS = 5;


  /* -------------------- FETCH PRODUCTS -------------------- */
  const fetchProducts = async (
    categoryId: string = 'all'
  ) => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('products')
      .select(
        'id, name, price, image, sale_price, stats, is_best_seller'
      )
      .order('created_at', { ascending: false });

    if (categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    if (search.trim()) {
      query = query.ilike(
        'name',
        `%${search.trim()}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setError('Không thể tải danh sách sản phẩm');
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  /* -------------------- FETCH CATEGORIES -------------------- */
  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, title')
      .order('sort_order', {
        ascending: true,
      });

    if (data) {
      setCategories(data);
    }
  };

  /* -------------------- INITIAL LOAD -------------------- */
  useEffect(() => {
    fetchCategories();
    fetchProducts('all');
  }, []);

  /* -------------------- SEARCH DEBOUNCE -------------------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(activeCategory);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  /* -------------------- DELETE -------------------- */
  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteId);

    setDeleting(false);

    if (error) {
      alert('Xóa thất bại');
      return;
    }

    setDeleteId(null);
    fetchProducts(activeCategory);
  };

  /* ===================== UI ===================== */
  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div className="sticky top-0 z-10 -mx-6 bg-gray-50 px-6">
        <div className="flex gap-2 overflow-x-auto py-2">
          <button
            onClick={() => {
              setActiveCategory('all');
              fetchProducts('all');
            }}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${activeCategory === 'all'
                ? 'bg-[#1b4f94] text-white'
                : 'bg-white text-gray-500'
              }`}
          >
            Tất cả
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                fetchProducts(cat.id);
              }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${activeCategory === cat.id
                  ? 'bg-[#1b4f94] text-white'
                  : 'bg-white text-gray-500'
                }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="mx-4 mt-4.5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() =>
              router.push('/products/create')
            }
            className="rounded-lg bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273]"
          >
            + Thêm sản phẩm
          </button>

          <div className="relative w-64">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>

            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none
              focus:border-[#1b4f94] focus:bg-white"
            />
          </div>
        </div>

        <table className="mt-2 w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="p-4 text-left">
                Sản phẩm
              </th>
              <th className="p-4 text-left">
                Giá
              </th>
              <th className="p-4 text-left">
                Trạng thái
              </th>
              <th className="p-4 text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {/* Sản phẩm */}
                  <td className="px-3 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="h-24 w-20 rounded-lg bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-40 rounded bg-gray-200" />
                        <div className="h-3 w-24 rounded bg-gray-200" />
                      </div>
                    </div>
                  </td>

                  {/* Giá */}
                  <td className="p-4">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                  </td>

                  {/* Trạng thái */}
                  <td className="p-4">
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </td>

                  {/* Thao tác */}
                  <td className="px-8 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-7 w-12 rounded bg-gray-200" />
                      <div className="h-7 w-12 rounded bg-gray-200" />
                    </div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-500"
                >
                  Chưa có sản phẩm nào
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-3 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="h-24 w-20 overflow-hidden">
                        {product.image ? (
                          <img
                            src={
                              getPublicImageUrl(
                                'products',
                                product.image
                              ) ?? ''
                            }
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-[#1c4f94]">
                          {product.name}
                        </p>
                        {product.is_best_seller && (
                          <span className="mt-1 inline-block rounded-lg bg-green-300 px-2 py-0.5 text-xs text-white">
                            Best seller
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    {product.sale_price ? (
                      <div className="space-x-2">
                        <span className="font-semibold text-red-600">
                          {product.sale_price.toLocaleString()}đ
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {product.price.toLocaleString()}đ
                        </span>
                      </div>
                    ) : (
                      <span>
                        {product.price.toLocaleString()}đ
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-gray-500">
                    {product.stats || '—'}
                  </td>

                  <td className="px-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setEditingId(product.id)
                        }
                        className="rounded-md border border-gray-400 px-3 py-1 text-sm hover:bg-gray-50"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() =>
                          setDeleteId(product.id)
                        }
                        className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {editingId && (
          <EditProductDrawer
            productId={editingId}
            onClose={() => setEditingId(null)}
            onUpdated={() =>
              fetchProducts(activeCategory)
            }
          />
        )}

        <ConfirmDeleteDrawer
          open={!!deleteId}
          title="Xóa sản phẩm?"
          description="Sản phẩm sẽ bị xóa vĩnh viễn."
          loading={deleting}
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
