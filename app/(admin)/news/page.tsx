'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl } from '@/app/lib/storage';
import { Search } from 'lucide-react';
import ConfirmDeleteDrawer from '@/app/components/ConfirmDeleteDrawer';
import EditNewsDrawer from '@/app/components/EditNewsDrawer';

type News = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  type: string | null;
  is_active: boolean;
  hashtag: string | null;
  created_at: string;
};

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const SKELETON_ROWS = 5;

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('news')
      .select(
        'id, title, description, type, image, is_active, hashtag, created_at'
      )
      .order('created_at', { ascending: false });

    if (search.trim()) {
      query = query.ilike('title', `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setError('Không thể tải danh sách tin tức');
      setNews([]);
    } else {
      setNews(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  /* -------------------- SEARCH DEBOUNCE -------------------- */
  useEffect(() => {
    const delay = setTimeout(fetchNews, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', deleteId);

    setDeleting(false);

    if (error) {
      alert('Xóa thất bại');
      return;
    }

    setDeleteId(null);
    fetchNews();
  };

  /* ===================== UI ===================== */
  return (
    <div className="space-y-3 mt-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {/* Header */}
        <div className="mx-4 mt-4.5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => router.push('/news/create')}
            className="w-full md:w-auto rounded-lg bg-[#1b4f94] px-4 py-2 text-white hover:bg-[#1c4273]"
          >
            + Thêm tin tức
          </button>

          <div className="relative w-full md:w-72">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tin tức..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm outline-none
              focus:border-[#1b4f94] focus:bg-white"
            />
          </div>
        </div>

        {/* ===================== MOBILE: CARDS ===================== */}
        <div className="md:hidden px-4 pb-4 pt-3 space-y-3">
          {loading ? (
            <NewsMobileSkeleton count={5} />
          ) : news.length === 0 ? (
            <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">
              Chưa có tin tức nào
            </div>
          ) : (
            news.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                onEdit={() => setEditingId(item.id)}
                onDelete={() => setDeleteId(item.id)}
              />
            ))
          )}
        </div>

        {/* ===================== DESKTOP: TABLE ===================== */}
        <div className="hidden md:block">
          <table className="mt-2 mb-3 w-full text-sm">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-4 text-left">Tin tức</th>
                <th className="p-4 text-left">Loại tin</th>
                <th className="p-4 text-left">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 pt-3">
                      <div className="flex gap-3">
                        <div className="h-20 w-28 rounded bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 rounded bg-gray-200" />
                          <div className="h-3 w-32 rounded bg-gray-200" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-20 rounded bg-gray-200" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </td>
                    <td className="px-8 text-right">
                      <div className="h-7 w-20 rounded bg-gray-200" />
                    </td>
                  </tr>
                ))
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    Chưa có tin tức nào
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 pt-3">
                      <div className="flex gap-3">
                        <div className="h-36 w-28 overflow-hidden rounded">
                          {item.image ? (
                            <img
                              src={getPublicImageUrl('products', item.image) ?? ''}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold text-[#1c4f94]">
                            {item.title}
                          </p>

                          {item.description && (
                            <p className="max-w-lg text-sm text-gray-500 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-500">
                      {item.type && (
                        <span
                          className={`inline-block rounded-lg px-2 py-0.5 text-sm text-white ${item.type === 'Khuyến Mãi'
                            ? 'bg-yellow-400'
                            : 'bg-blue-500'
                            }`}
                        >
                          {item.type}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-lg px-3 py-1 text-sm ${item.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-500'
                          }`}
                      >
                        {item.is_active ? 'Đang hiển thị' : 'Ẩn'}
                      </span>
                    </td>



                    <td className="px-8 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(item.id)}
                          className="rounded-md border border-gray-400 px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => setDeleteId(item.id)}
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

        {editingId && (
          <EditNewsDrawer
            newsId={editingId}
            onClose={() => setEditingId(null)}
            onUpdated={fetchNews}
          />
        )}

        <ConfirmDeleteDrawer
          open={!!deleteId}
          title="Xóa tin tức?"
          description="Tin tức sẽ bị xóa vĩnh viễn."
          loading={deleting}
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}

function NewsCard({
  item,
  onEdit,
  onDelete,
}: {
  item: {
    id: string;
    title: string;
    description: string | null;
    image: string | null;
    type: string | null;
    is_active: boolean;
    hashtag: string | null;
    created_at: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex gap-3">
        {/* IMAGE */}
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
          {item.image ? (
            <img
              src={getPublicImageUrl('products', item.image) ?? ''}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#1c4f94] leading-snug line-clamp-2">
            {item.title}
          </p>

          {item.description ? (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {item.description}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {item.type ? (
              <span
                className={`inline-flex rounded-lg px-2 py-0.5 text-xs text-white ${item.type === 'Khuyến Mãi'
                    ? 'bg-yellow-400'
                    : 'bg-blue-500'
                  }`}
              >
                {item.type}
              </span>
            ) : null}

            <span
              className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-medium ${item.is_active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-500'
                }`}
            >
              {item.is_active ? 'Đang hiển thị' : 'Ẩn'}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onEdit}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
        >
          Sửa
        </button>

        <button
          onClick={onDelete}
          className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

function NewsMobileSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="flex gap-3">
            <div className="h-24 w-20 rounded-xl bg-gray-200 shrink-0" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />

              <div className="mt-2 flex gap-2">
                <div className="h-5 w-16 rounded bg-gray-200" />
                <div className="h-5 w-20 rounded bg-gray-200" />
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="h-10 rounded-xl bg-gray-200" />
            <div className="h-10 rounded-xl bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
