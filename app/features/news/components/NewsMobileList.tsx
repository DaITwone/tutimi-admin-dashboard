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
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex gap-3">
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
          {item.image ? (
            <Image
              src={getPublicImageUrl('products', item.image) ?? ''}
              alt={item.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#1c4f94] leading-snug line-clamp-2">{item.title}</p>

          {item.description ? (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
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
                item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
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

