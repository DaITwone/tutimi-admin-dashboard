'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl } from '@/app/lib/storage';
import { Power, Search } from 'lucide-react';
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
  is_active: boolean | null;
};

type Category = {
  id: string;
  title: string;
};

type StatusFilter = 'all' | 'on' | 'off';

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

  // ✅ Manage Mode (UI progressive disclosure)
  const [manageMode, setManageMode] = useState(false);

  // ✅ Bulk mode states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [bulkLoading, setBulkLoading] = useState(false);

  const SKELETON_ROWS = 5;

  /* -------------------- DERIVED -------------------- */
  const hasSelection = selectedIds.length > 0;

  const isAllChecked = useMemo(() => {
    if (!manageMode) return false;
    if (products.length === 0) return false;
    return selectedIds.length === products.length;
  }, [manageMode, products.length, selectedIds.length]);

  const colSpan = manageMode ? 5 : 4;

  /* -------------------- HELPERS -------------------- */
  const resetManageTools = () => {
    setSelectedIds([]);
    setStatusFilter('all');
  };

  const toggleManageMode = () => {
    setManageMode((prev) => {
      const next = !prev;
      if (!next) resetManageTools(); // turning OFF manageMode
      return next;
    });
  };

  /* -------------------- FETCH CATEGORIES -------------------- */
  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, title')
      .order('sort_order', { ascending: true });

    if (data) setCategories(data);
  };

  /* -------------------- FETCH PRODUCTS -------------------- */
  const fetchProducts = async (categoryId: string = 'all') => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('products')
      .select('id, name, price, image, sale_price, stats, is_best_seller, is_active')
      .order('created_at', { ascending: false });

    // category filter
    if (categoryId !== 'all') query = query.eq('category_id', categoryId);

    // ✅ status filter only matters in manage mode
    if (manageMode) {
      if (statusFilter === 'on') query = query.eq('is_active', true);
      if (statusFilter === 'off') query = query.eq('is_active', false);
    }

    // search
    if (search.trim()) query = query.ilike('name', `%${search.trim()}%`);

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

  /* -------------------- INITIAL LOAD -------------------- */
  useEffect(() => {
    fetchCategories();
    fetchProducts('all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------- RELOAD WHEN manageMode/status changes -------------------- */
  useEffect(() => {
    // khi bật/tắt manage mode thì reload list theo logic tương ứng
    setSelectedIds([]);
    fetchProducts(activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageMode, statusFilter]);

  /* -------------------- SEARCH DEBOUNCE -------------------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      setSelectedIds([]);
      fetchProducts(activeCategory);
    }, 400);

    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /* -------------------- DELETE -------------------- */
  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);

    const { error } = await supabase.from('products').delete().eq('id', deleteId);

    setDeleting(false);

    if (error) {
      alert('Xóa thất bại');
      return;
    }

    setDeleteId(null);
    fetchProducts(activeCategory);
  };

  /* -------------------- BULK UPDATE ACTIVE -------------------- */
  const bulkUpdateActive = async (nextActive: boolean) => {
    if (!hasSelection) return;

    setBulkLoading(true);

    const { error } = await supabase
      .from('products')
      .update({ is_active: nextActive })
      .in('id', selectedIds);

    setBulkLoading(false);

    if (error) {
      console.error(error);
      alert('Cập nhật hàng loạt thất bại');
      return;
    }

    // optimistic UI
    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, is_active: nextActive } : p))
    );

    setSelectedIds([]);
  };

  /* -------------------- SELECT HANDLERS -------------------- */
  const handleToggleSelectAll = (checked: boolean) => {
    if (!manageMode) return;

    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectOne = (id: string, checked: boolean) => {
    if (!manageMode) return;

    if (checked) setSelectedIds((prev) => [...prev, id]);
    else setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div className="sticky top-0 z-10 -mx-6 bg-gray-50 px-6">
        <div className="flex gap-2 overflow-x-auto py-2">
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedIds([]);
              fetchProducts('all');
            }}
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
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedIds([]);
                fetchProducts(cat.id);
              }}
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
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
      )}

      {/* MAIN CARD */}
      <div className="rounded-xl bg-white shadow-sm">
        {/* Top Bar */}
        <div className="mx-4 mt-4.5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* LEFT */}
          <div className="flex flex-col mt-4.5 gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Add */}
            <button
              onClick={() => router.push('/products/create')}
              className="w-full sm:w-auto border border-[#1b4f94] rounded-lg bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273]"
            >
              + Thêm sản phẩm
            </button>

            {/* Manage mode toggle */}
            <button
              onClick={toggleManageMode}
              className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border p-2 transition ${manageMode ? 'bg-white text-[#1b4f94]' : 'bg-[#1b4f94] text-white'
                }`}
            >
              <Power size={18} />
              Bật/Tắt món
            </button>

            {/* Bulk Action Bar (desktop legacy) */}
            {manageMode && (
              <div className="hidden md:flex gap-1">
                <button
                  disabled={bulkLoading}
                  onClick={() => bulkUpdateActive(true)}
                  className="rounded-lg bg-green-600 px-2 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {bulkLoading ? 'Đang xử lý...' : 'ON'}
                </button>

                <button
                  disabled={bulkLoading}
                  onClick={() => bulkUpdateActive(false)}
                  className="rounded-lg bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {bulkLoading ? 'Đang xử lý...' : 'OFF'}
                </button>

                <button
                  onClick={() => setSelectedIds([])}
                  className="rounded-lg border border-gray-400 bg-white px-2 py-2 text-sm text-gray-500 hover:bg-gray-50"
                >
                  Bỏ chọn
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col sm:mt-4.5 gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </span>

              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-[#1b4f94] focus:bg-white"
              />
            </div>

            {/* Status Filter (only in Manage Mode) */}
            {manageMode && (
              <div className="flex items-center justify-between sm:justify-end gap-2">
                {/* ALL */}
                <button
                  onClick={() => {
                    setSelectedIds([]);
                    setStatusFilter('all');
                  }}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${statusFilter === 'all'
                    ? 'bg-[#1b4f94] text-white'
                    : 'bg-white text-gray-500'
                    }`}
                >
                  All
                </button>

                {/* SWITCH ON/OFF */}
                <button
                  onClick={() => {
                    setSelectedIds([]);
                    setStatusFilter((prev) => (prev === 'on' ? 'off' : 'on'));
                  }}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm shadow-sm transition ${statusFilter === 'all'
                    ? 'bg-white text-gray-500 border-gray-200'
                    : statusFilter === 'on'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-red-600 text-white border-red-600'
                    }`}
                >
                  <div
                    className={`relative h-5 w-10 rounded-full transition ${statusFilter === 'all' ? 'bg-gray-300' : 'bg-white/30'
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${statusFilter === 'on' ? 'left-5' : 'left-1'
                        }`}
                    />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===================== MOBILE: CARDS ===================== */}
        <div className="md:hidden px-4 pb-4 pt-3 space-y-3">
          {loading ? (
            <ProductsMobileSkeleton count={5} manageMode={manageMode} />
          ) : products.length === 0 ? (
            <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">
              Chưa có sản phẩm nào
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                manageMode={manageMode}
                checked={selectedIds.includes(product.id)}
                onToggleChecked={(checked) =>
                  handleToggleSelectOne(product.id, checked)
                }
                onEdit={() => setEditingId(product.id)}
                onDelete={() => setDeleteId(product.id)}
              />
            ))
          )}
        </div>

        {/* ===================== DESKTOP: TABLE ===================== */}
        <div className="hidden md:block">
          <table className="mt-2 w-full text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="w-12 pl-6 pr-2 py-3 text-left">
                  {manageMode ? (
                    <input
                      type="checkbox"
                      className="accent-[#1b4f94] scale-125"
                      checked={isAllChecked}
                      onChange={(e) => handleToggleSelectAll(e.target.checked)}
                    />
                  ) : (
                    <span>STT</span>
                  )}
                </th>

                <th className="pl-5 pr-2 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span>Sản phẩm</span>

                    {manageMode && (
                      <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs text-blue-700">
                        Đã chọn {selectedIds.length}
                      </span>
                    )}
                  </div>
                </th>

                <th className="w-40 px-4 py-3 text-left">Giá</th>
                <th className="w-60 px-4 py-3 text-left">Chỉ số</th>
                <th className="w-40 px-4 py-3 text-left">Trạng thái</th>
                <th className="w-44 px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="w-12 pl-6 pr-2 py-4">
                      {manageMode ? (
                        <div className="h-4 w-4 rounded bg-gray-200" />
                      ) : (
                        <div className="h-4 w-6 rounded bg-gray-200" />
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="h-20 w-16 rounded-lg bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-40 rounded bg-gray-200" />
                          <div className="h-3 w-24 rounded bg-gray-200" />
                        </div>
                      </div>
                    </td>

                    <td className="w-40 px-4 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </td>

                    <td className="w-60 px-4 py-4">
                      <div className="h-4 w-44 rounded bg-gray-200" />
                    </td>

                    <td className="w-40 px-4 py-4">
                      <div className="h-4 w-20 rounded bg-gray-200" />
                    </td>

                    <td className="w-44 px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="h-7 w-12 rounded bg-gray-200" />
                        <div className="h-7 w-12 rounded bg-gray-200" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="p-6 text-center text-gray-500">
                    Chưa có sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="w-12 pl-6 pr-2 py-3 text-sm text-center font-semibold text-gray-400">
                      {manageMode ? (
                        <input
                          type="checkbox"
                          className="accent-[#1b4f94] scale-125"
                          checked={selectedIds.includes(product.id)}
                          onChange={(e) =>
                            handleToggleSelectOne(product.id, e.target.checked)
                          }
                        />
                      ) : (
                        <span className="text-center">{index + 1}</span>
                      )}
                    </td>

                    {/* Product */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-24 w-20 overflow-hidden rounded-lg bg-gray-50">
                          {product.image ? (
                            <img
                              src={
                                getPublicImageUrl('products', product.image) ?? ''
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

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-[#1c4f94] leading-snug">
                              {product.name}
                            </p>

                            {product.is_best_seller && (
                              <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                                Best seller
                              </span>
                            )}
                          </div>
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

                    {/* Stats */}
                    <td className="w-60 px-4 py-4">
                      {product.stats ? (
                        <p className="text-xs text-gray-500">{product.stats}</p>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    {/* Active status */}
                    <td className="w-40 px-4 py-4">
                      {product.is_active ? (
                        <span className="rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-500">
                          Tạm tắt
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="w-44 px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(product.id)}
                          className="rounded-md border border-gray-400 px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => setDeleteId(product.id)}
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
        </div>
      </div>

      {/* ✅ ===================== MOBILE BULK BAR (sticky bottom) ===================== */}
      {manageMode && (
        <div className="md:hidden sticky bottom-0 z-20 -mx-4 bg-[#F7F8FB] px-4 pb-3 pt-2">
          <div className="rounded-2xl bg-white shadow-lg border border-gray-200 p-3 flex items-center justify-between gap-3">
            <div className="text-sm text-gray-700">
              Đã chọn <b>{selectedIds.length}</b>
            </div>

            <div className="flex gap-2">
              <button
                disabled={bulkLoading || selectedIds.length === 0}
                onClick={() => bulkUpdateActive(true)}
                className="rounded-xl bg-green-600 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                {bulkLoading ? '...' : 'ON'}
              </button>

              <button
                disabled={bulkLoading || selectedIds.length === 0}
                onClick={() => bulkUpdateActive(false)}
                className="rounded-xl bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
              >
                {bulkLoading ? '...' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Edit */}
      {editingId && (
        <EditProductDrawer
          productId={editingId}
          onClose={() => setEditingId(null)}
          onUpdated={() => fetchProducts(activeCategory)}
        />
      )}

      {/* Drawer Delete */}
      <ConfirmDeleteDrawer
        open={!!deleteId}
        title="Xóa sản phẩm?"
        description="Sản phẩm sẽ bị xóa vĩnh viễn."
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function ProductsMobileSkeleton({
  count = 5,
  manageMode,
}: {
  count?: number;
  manageMode: boolean;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="flex items-start gap-3">
            {manageMode && (
              <div className="mt-1 h-4 w-4 rounded bg-gray-200" />
            )}

            <div className="h-20 w-16 rounded-xl bg-gray-200" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-6 w-24 rounded-lg bg-gray-200" />
          </div>

          {!manageMode && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-10 rounded-xl bg-gray-200" />
              <div className="h-10 rounded-xl bg-gray-200" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProductCard({
  product,
  manageMode,
  checked,
  onToggleChecked,
  onEdit,
  onDelete,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    sale_price: number | null;
    stats: string | null;
    is_best_seller: boolean;
    image: string | null;
    is_active: boolean | null;
  };
  manageMode: boolean;
  checked: boolean;
  onToggleChecked: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const price = product.sale_price ?? product.price;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      {/* Top row */}
      <div className="flex items-start gap-3">
        {manageMode && (
          <input
            type="checkbox"
            className="mt-1 accent-[#1b4f94] scale-125"
            checked={checked}
            onChange={(e) => onToggleChecked(e.target.checked)}
          />
        )}

        {/* image */}
        <div className="h-20 w-16 overflow-hidden rounded-xl bg-gray-50 shrink-0">
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

        {/* info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-[#1c4f94] leading-snug line-clamp-2">
              {product.name}
            </p>

            {product.is_best_seller && (
              <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                Best seller
              </span>
            )}
          </div>

          {/* stats */}
          {product.stats ? (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {product.stats}
            </p>
          ) : null}
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-3 flex flex-col gap-2">
        {/* price + status */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            {product.sale_price ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-red-600">
                  {product.sale_price.toLocaleString()}đ
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {product.price.toLocaleString()}đ
                </span>
              </div>
            ) : (
              <span className="font-semibold text-gray-800">
                {price.toLocaleString()}đ
              </span>
            )}
          </div>

          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${product.is_active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
              }`}
          >
            {product.is_active ? 'Đang hoạt động' : 'Tạm tắt'}
          </span>
        </div>

        {/* actions */}
        {!manageMode && (
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onEdit}
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            >
              Sửa
            </button>

            <button
              onClick={onDelete}
              className="flex-1 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
