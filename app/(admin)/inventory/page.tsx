'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl } from '@/app/lib/storage';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProductsQuery } from '@/app/hooks/useProductsQuery';
import {
  InventoryActionDrawer,
  InventoryHistoryDrawer,
  useInventoryUI,
} from '@/app/features/inventory';

/* ===================== TYPES ===================== */
type Category = {
  id: string;
  title: string;
};

/* ===================== COMPONENT ===================== */
export default function InventoryPage() {
  const router = useRouter();
  const invUI = useInventoryUI();

  /* -------------------- STATE -------------------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const SKELETON_ROWS = 5;

  /* -------------------- SEARCH DEBOUNCE -------------------- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  /* -------------------- FETCH CATEGORIES -------------------- */
  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, title')
      .order('sort_order', { ascending: true });

    if (data) setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* -------------------- REACT QUERY: PRODUCTS -------------------- */
  const {
    data: products = [],
    isLoading: loading,
    error: productsError,
  } = useProductsQuery({
    categoryId: activeCategory,
    search: debouncedSearch,
  });

  const error = productsError ? 'Không thể tải danh sách sản phẩm' : null;

  /* ===================== UI ===================== */
  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div className="sticky top-0 z-10 -mx-6 bg-gray-50 px-6">
        <div className="flex gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${activeCategory === 'all'
              ? 'bg-[#1b4f94] text-white'
              : 'bg-gray-100 text-[#1c4273]'
              }`}
          >
            Tất cả
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${activeCategory === cat.id
                ? 'bg-[#1b4f94] text-white'
                : 'bg-gray-100 text-[#1c4273]'
                }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>}

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {/* Top Bar */}
        <div className="mx-4 mt-4.5 flex flex-wrap items-center justify-between gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/inventory/bulk/in')}
              className="rounded-lg bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273]"
            >
              Nhập hàng
            </button>

            <button
              onClick={() => router.push('/inventory/bulk/out')}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[#1c4273] font-semibold hover:bg-gray-50"
            >
              Xuất hàng
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* Search */}
            <div className="relative w-64">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </span>

              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none
                  focus:border-[#1b4f94] focus:bg-white"
              />
            </div>
          </div>
        </div>

        <table className="mt-2 w-full text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="w-72 pl-5 pr-2 py-3 text-left">Sản phẩm</th>
              <th className="w-40 px-4 py-3 text-left">Giá</th>
              <th className="w-44 px-4 py-3 text-left">Tồn kho</th>
              <th className="w-52 px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {/* Product */}
                  <td className="w-72 pl-5 pr-2 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-24 w-20 rounded-lg bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-40 rounded bg-gray-200" />
                        <div className="h-3 w-24 rounded bg-gray-200" />
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="w-40 px-4 py-4">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                  </td>

                  {/* Stock */}
                  <td className="w-44 px-4 py-4">
                    <div className="h-7 w-24 rounded-lg bg-gray-200" />
                  </td>

                  {/* Actions */}
                  <td className="w-52 px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="h-7 w-14 rounded bg-gray-200" />
                      <div className="h-7 w-14 rounded bg-gray-200" />
                      <div className="h-7 w-10 rounded bg-gray-200" />
                      <div className="h-7 w-16 rounded bg-gray-200" />
                    </div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Chưa có sản phẩm nào
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stock = product.stock_quantity ?? 0;
                const outOfStock = stock <= 0;

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {/* Product */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-24 w-20 overflow-hidden rounded-lg bg-gray-50">
                          {product.image ? (
                            <img
                              src={getPublicImageUrl('products', product.image) ?? ''}
                              alt={product.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-[#1c4f94] leading-snug">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="w-40 px-4 py-4">
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
                        <span>{product.price.toLocaleString()}đ</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="w-44 px-4 py-4">
                      {outOfStock ? (
                        <span className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700">
                          Hết hàng
                        </span>
                      ) : (
                        <span className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700">
                          Còn {stock}
                        </span>
                      )}
                    </td>

                    {/* Inventory Actions */}
                    <td className="w-52 px-4 py-4 text-right">
                      <div className="flex flex-nowrap justify-end gap-2 overflow-x-auto">
                        <button
                          onClick={() =>
                            invUI.openDrawer({
                              action: 'IN',
                              productId: product.id,
                              productName: product.name,
                              stockQuantity: product.stock_quantity ?? 0,
                            })
                          }
                          className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100"
                        >
                          Nhập
                        </button>

                        <button
                          onClick={() =>
                            invUI.openDrawer({
                              action: 'OUT',
                              productId: product.id,
                              productName: product.name,
                              stockQuantity: product.stock_quantity ?? 0,
                            })
                          }
                          className="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-1 text-sm text-yellow-700 hover:bg-yellow-100"
                        >
                          Xuất
                        </button>

                        <button
                          onClick={() =>
                            invUI.openDrawer({
                              action: 'ADJUST',
                              productId: product.id,
                              productName: product.name,
                              stockQuantity: product.stock_quantity ?? 0,
                            })
                          }
                          title="Điều chỉnh"
                          aria-label="Điều chỉnh"
                          className="rounded-md border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-700 hover:bg-purple-100"
                        >
                          <SlidersHorizontal size={16} />
                        </button>

                        <button
                          onClick={() =>
                            invUI.openHistory({
                              productId: product.id,
                              productName: product.name,
                            })
                          }
                          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Lịch sử
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Inventory drawers */}
        <InventoryActionDrawer />
        <InventoryHistoryDrawer />
      </div>
    </div>
  );
}
