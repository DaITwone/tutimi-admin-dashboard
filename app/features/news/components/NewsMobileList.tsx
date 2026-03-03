'use client';

import Image from 'next/image';
import { getPublicImageUrl } from '@/app/lib/storage';
import type { News } from '../types';

type NewsMobileListProps = {
  news: News[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function NewsMobileList({
  news,
  loading,
  onEdit,
  onDelete,
}: NewsMobileListProps) {
  return (
    <div className="space-y-3 px-4 pb-4 pt-3 md:hidden">
      {loading ? (
        <NewsMobileSkeleton count={5} />
      ) : news.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-sm">
          Chưa có tin tức nào
        </div>
      ) : (
        news.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            onEdit={() => onEdit(item.id)}
            onDelete={() => onDelete(item.id)}
          />
        ))
      )}
    </div>
  );
}

function NewsCard({
  item,
  onEdit,
  onDelete,
}: {
  item: News;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/30">
          {item.image ? (
            <Image
              src={getPublicImageUrl('products', item.image) ?? ''}
              alt={item.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-brand-2 leading-snug line-clamp-2">{item.title}</p>

          {item.description ? (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {item.type ? (
              <span
                className={`inline-flex rounded-lg px-2 py-0.5 text-xs text-white ${
                  item.type.toLowerCase().includes('khuy') ? 'bg-yellow-400' : 'bg-blue-500'
                }`}
              >
                {item.type}
              </span>
            ) : null}

            <span
              className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-medium ${
                item.is_active
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {item.is_active ? 'Đang hiển thị' : 'Ẩn'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onEdit}
          className="rounded-xl border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted/50"
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
          className="animate-pulse rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex gap-3">
            <div className="h-24 w-20 rounded-xl bg-muted shrink-0" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-2/3 rounded bg-muted" />

              <div className="mt-2 flex gap-2">
                <div className="h-5 w-16 rounded bg-muted" />
                <div className="h-5 w-20 rounded bg-muted" />
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="h-10 rounded-xl bg-muted" />
            <div className="h-10 rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

