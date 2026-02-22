'use client';

import { useRouter } from 'next/navigation';
import { NewsView, useNews } from '@/app/features/news';

export default function NewsPage() {
  const router = useRouter();
  const {
    news,
    loading,
    error,
    search,
    setSearch,

    deleteId,
    deleting,
    openDelete,
    closeDelete,
    confirmDelete,

    editingId,
    openEdit,
    closeEdit,

    fetchNews,
  } = useNews();

  return (
    <NewsView
      news={news}
      loading={loading}
      error={error}
      search={search}
      onSearchChange={setSearch}
      onCreate={() => router.push('/news/create')}
      onEdit={openEdit}
      onDelete={openDelete}
      editingId={editingId}
      onCloseEdit={closeEdit}
      onUpdated={fetchNews}
      deleteOpen={!!deleteId}
      deleting={deleting}
      onCancelDelete={closeDelete}
      onConfirmDelete={confirmDelete}
    />
  );
}
