'use client';

import Image from 'next/image';
import { getPublicImageUrl } from '@/app/lib/storage';
import type { News } from '../types';

type NewsTableProps = {
  news: News[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  skeletonRows?: number;
};

export default function NewsTable({
  news,
  loading,
  onEdit,
  onDelete,
  skeletonRows = 5,
}: NewsTableProps) {
  return (
    <div className="hidden md:block">
      <table className="mt-2 mb-3 w-full text-sm">
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th className="p-4 text-left">Tin tức</th>
            <th className="p-4 text-left">Loại tin</th>
            <th className="p-4 text-left">Trạng thái</th>
            <th className="p-4 text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <TableSkeleton rows={skeletonRows} />
          ) : news.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-muted-foreground">
                Chưa có tin tức nào
              </td>
            </tr>
          ) : (
            news.map((item) => (
              <NewsRow
                key={item.id}
                item={item}
                onEdit={() => onEdit(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function NewsRow({
  item,
  onEdit,
  onDelete,
}: {
  item: News;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-muted/30">
      <td className="px-3 pt-3">
        <div className="flex gap-3">
          <div className="relative h-36 w-28 overflow-hidden rounded bg-muted/30">
            {item.image ? (
              <Image
                src={getPublicImageUrl('products', item.image) ?? ''}
                alt={item.title}
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-brand-2">{item.title}</p>

            {item.description && (
              <p className="max-w-lg text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            )}
          </div>
        </div>
      </td>

      <td className="p-4 text-foreground/80">
        {item.type && (
          <span
            className={`inline-block rounded-lg px-2 py-0.5 text-sm text-white ${
              item.type.toLowerCase().includes('khuy') ? 'bg-yellow-400' : 'bg-blue-500'
            }`}
          >
            {item.type}
          </span>
        )}
      </td>

      <td className="p-4">
        <span
          className={`rounded-lg px-3 py-1 text-sm ${
            item.is_active
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {item.is_active ? 'Đang hiển thị' : 'Ẩn'}
        </span>
      </td>

      <td className="px-8 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            className="rounded-md border border-border px-3 py-1 text-sm text-foreground transition hover:bg-muted/50"
          >
            Sửa
          </button>

          <button
            onClick={onDelete}
            className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
          >
            Xóa
          </button>
        </div>
      </td>
    </tr>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-3 pt-3">
            <div className="flex gap-3">
              <div className="h-20 w-28 rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-48 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
              </div>
            </div>
          </td>
          <td className="p-4">
            <div className="h-4 w-20 rounded bg-muted" />
          </td>
          <td className="p-4">
            <div className="h-4 w-24 rounded bg-muted" />
          </td>
          <td className="px-8 text-right">
            <div className="ml-auto h-7 w-20 rounded bg-muted" />
          </td>
        </tr>
      ))}
    </>
  );
}

