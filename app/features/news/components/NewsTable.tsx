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
            <TableSkeleton rows={skeletonRows} />
          ) : news.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
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
    <tr className="hover:bg-gray-50">
      <td className="px-3 pt-3">
        <div className="flex gap-3">
          <div className="relative h-36 w-28 overflow-hidden rounded bg-gray-50">
            {item.image ? (
              <Image
                src={getPublicImageUrl('products', item.image) ?? ''}
                alt={item.title}
                fill
                className="object-cover"
                sizes="112px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-[#1c4f94]">{item.title}</p>

            {item.description && (
              <p className="max-w-lg text-sm text-gray-500 line-clamp-2">{item.description}</p>
            )}
          </div>
        </div>
      </td>

      <td className="p-4 text-gray-500">
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
            item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {item.is_active ? 'Đang hiển thị' : 'Ẩn'}
        </span>
      </td>

      <td className="px-8 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            className="rounded-md border border-gray-400 px-3 py-1 text-sm hover:bg-gray-50"
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
            <div className="h-7 w-20 rounded bg-gray-200 ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

