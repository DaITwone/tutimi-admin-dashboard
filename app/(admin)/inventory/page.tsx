'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl } from '@/app/lib/storage';
import { ChevronDown, ChevronsUpDown, ChevronUp, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProductsQuery } from '@/app/hooks/useProductsQuery';
import { InventoryHistoryDrawer, useInventoryUI } from '@/app/features/inventory';

type Category = {
  id: string;
  title: string;
};

type SortKey = 'name' | 'stock';

export default function InventoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]); // lấy danh mục sản phẩm (Cà phê, matcha, milo,...)
  const [activeCategory, setActiveCategory] = useState<string>('all'); // category filter
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // giảm số lần gọi API khi người dùng đang gõ search.
  const SKELETON_ROWS = 5;
  const invUI = useInventoryUI();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }

  // Debounce giá trị search 
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t); // user gõ liên tục -> timeout liên tục bị hủy -> user ngừng gõ chờ đủ 400ms -> update setDebouncedSearch (giúp giữ lại timeout cuối cùng)
  }, [search]);

  /* -------------------- FETCH CATEGORIES -------------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, title')
        .order('sort_order', { ascending: true });

      if (data) setCategories(data);
    };

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

  const rows = useMemo(() => {
    if (!sortKey) return products;

    return [...products].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortKey === 'stock') {
        aValue = a.stock_quantity ?? 0;
        bValue = b.stock_quantity ?? 0;
      }

      if (sortKey === 'name') {
        aValue = a.name?.toLowerCase() ?? '';
        bValue = b.name?.toLowerCase() ?? '';
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1; // a đứng trước b
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1; // b đứng trước a

      return 0; // giữ nguyên
    });
  }, [products, sortKey, sortOrder]);

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
        <div className="mx-4 mt-4.5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* LEFT (✅ giữ nguyên 3 nút) */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={() => router.push('/inventory/bulk/in')}
              className="w-full sm:w-auto rounded-lg bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273]"
            >
              Nhập Hàng
            </button>

            <button
              onClick={() => router.push('/inventory/bulk/out')}
              className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-[#1c4273] font-semibold hover:bg-gray-50"
            >
              Xuất Hàng
            </button>

            <button
              onClick={() => router.push('/inventory/history')}
              className="col-span-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-[#1c4273] hover:bg-gray-50 sm:col-span-1 sm:w-auto"
            >
              Phiếu In
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* Search */}
            <div className="relative w-full md:w-72">
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

        {/* ===================== MOBILE: CARDS ===================== */}
        <div className="md:hidden px-4 pb-4 pt-3 space-y-3">
          {loading ? (
            <InventoryMobileSkeleton count={5} />
          ) : rows.length === 0 ? (
            <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">
              Chưa có sản phẩm nào
            </div>
          ) : (
            rows.map((product, idx) => (
              <InventoryCard
                key={product.id}
                index={idx}
                product={product}
                onOpenHistory={() => invUI.openHistory({ productId: product.id, })}
              />
            ))
          )}
        </div>
        <div className='hidden md:block'>
          <table className="mt-2 w-full text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="w-16 pl-5 pr-2 py-3 text-center">STT</th>
                <th
                  onClick={() => toggleSort('name')}
                  className="group cursor-pointer select-none px-4 py-3 text-left text-gray-600 hover:text-[#1b4f94]"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Sản phẩm</span>

                    {/* Icon */}
                    <span className="flex h-4 w-4 items-center justify-center">
                      {sortKey !== 'name' && (
                        <ChevronsUpDown
                          size={14}
                          className="opacity-50 transition-opacity group-hover:opacity-100"
                        />
                      )}

                      {sortKey === 'name' && sortOrder === 'asc' && (
                        <ChevronUp size={14} />
                      )}

                      {sortKey === 'name' && sortOrder === 'desc' && (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  </div>
                </th>

                <th
                  onClick={() => toggleSort('stock')}
                  className="group cursor-pointer select-none px-4 py-3 text-center text-gray-600 hover:text-[#1b4f94]"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <span>Tồn kho</span>

                    {/* Sort icon */}
                    <span className="flex h-4 w-4 items-center justify-center">
                      {sortKey !== 'stock' && (
                        <ChevronsUpDown
                          size={14}
                          className="opacity-50 transition-opacity group-hover:opacity-100"
                        />
                      )}

                      {sortKey === 'stock' && sortOrder === 'asc' && (
                        <ChevronUp size={14} />
                      )}

                      {sortKey === 'stock' && sortOrder === 'desc' && (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  </div>
                </th>

                <th className="w-56 px-4 py-3 text-center">Tổng định lượng/ĐVT</th>
                <th className="w-40 px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {/* STT */}
                    <td className="pl-5 pr-2 py-4">
                      <div className="h-4 w-8 rounded bg-gray-200" />
                    </td>

                    {/* Product */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-24 w-20 rounded-lg bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-40 rounded bg-gray-200" />
                          <div className="h-3 w-24 rounded bg-gray-200" />
                        </div>
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4">
                      <div className="mx-auto h-7 w-24 rounded-lg bg-gray-200" />
                    </td>

                    {/* Total measurement */}
                    <td className="px-4 py-4">
                      <div className="mx-auto h-7 w-36 rounded-lg bg-gray-200" />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <div className="ml-auto h-7 w-20 rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              ) : (
                rows.map((product, idx) => {
                  const stock = product.stock_quantity ?? 0;
                  const outOfStock = stock <= 0;
                  const lowStock = stock > 0 && stock <= 5;
                  const totalText = product.measure_unit;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      {/* STT */}
                      <td className="pl-5 pr-2 py-4 text-gray-600 text-center">{idx + 1}</td>

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
                            <p className="font-bold text-[#1c4f94] leading-snug">{product.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`rounded-lg px-3 py-2 text-xs font-semibold ${outOfStock
                            ? 'bg-red-100 text-red-700'
                            : lowStock
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-blue-100 text-blue-700'
                            }`}
                        >
                          {outOfStock ? 'Hết hàng' : stock}
                        </span>
                      </td>

                      {/* Total measurement */}
                      <td className="px-4 py-4 text-center">
                        <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
                          {totalText}
                        </span>
                      </td>

                      {/* Actions (ONLY History) */}
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() =>
                            invUI.openHistory({
                              productId: product.id,
                            })
                          }
                          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Lịch sử
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Keep drawer if your /inventory/[id] page uses it; otherwise can remove */}
        <InventoryHistoryDrawer />
      </div>
    </div>
  );
}

function InventoryCard({
  product,
  index,
  onOpenHistory,
}: {
  product: any;
  index: number;
  onOpenHistory: () => void;
}) {
  const stock = product.stock_quantity ?? 0;
  const outOfStock = stock <= 0;
  const lowStock = stock > 0 && stock <= 5;
  const totalText = product.measure_unit;


  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        {/* IMAGE */}
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
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

        {/* INFO */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-[#1c4f94] line-clamp-2">
              {product.name}
            </p>

            <span className="text-xs font-semibold text-gray-400">
              #{index + 1}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Tồn kho</div>
              <div className="mt-1">
                <span
                  className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${outOfStock
                      ? 'bg-red-100 text-red-700'
                      : lowStock
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                >
                  {outOfStock ? 'Hết hàng' : stock}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-xs text-gray-500">Tổng định lượng</div>
              <div className="mt-1">
                <span className="inline-flex rounded-lg bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                  {totalText}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenHistory}
            className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Lịch sử
          </button>
        </div>
      </div>
    </div>
  );
}

function InventoryMobileSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="h-24 w-20 rounded-xl bg-gray-200 shrink-0" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-16 rounded-xl bg-gray-200" />
                <div className="h-16 rounded-xl bg-gray-200" />
              </div>

              <div className="h-10 rounded-xl bg-gray-200 mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}