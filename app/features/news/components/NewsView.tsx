'use client';

import ConfirmDeleteDrawer from '@/app/components/ConfirmDeleteDrawer';
import EditNewsDrawer from '@/app/components/EditNewsDrawer';
import type { News } from '../types';
import NewsHeader from './NewsHeader';
import NewsMobileList from './NewsMobileList';
import NewsTable from './NewsTable';

type NewsViewProps = {
  news: News[];
  loading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;

  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;

  editingId: string | null;
  onCloseEdit: () => void;
  onUpdated: () => void;

  deleteOpen: boolean;
  deleting: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
};

export default function NewsView({
  news,
  loading,
  error,
  search,
  onSearchChange,
  onCreate,
  onEdit,
  onDelete,
  editingId,
  onCloseEdit,
  onUpdated,
  deleteOpen,
  deleting,
  onCancelDelete,
  onConfirmDelete,
}: NewsViewProps) {
  return (
    <div className="space-y-3 mt-6">
      {error && <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <NewsHeader search={search} onSearchChange={onSearchChange} onCreate={onCreate} />

        <NewsMobileList news={news} loading={loading} onEdit={onEdit} onDelete={onDelete} />

        <NewsTable news={news} loading={loading} onEdit={onEdit} onDelete={onDelete} skeletonRows={5} />
      </div>

      {editingId && <EditNewsDrawer newsId={editingId} onClose={onCloseEdit} onUpdated={onUpdated} />}

      <ConfirmDeleteDrawer
        open={deleteOpen}
        title="Xóa tin tức?"
        description="Tin tức sẽ bị xóa vĩnh viễn."
        loading={deleting}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
