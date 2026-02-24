"use client";

import { getPublicImageUrl } from "@/app/lib/storage";
import type { Product } from "@/app/features/inventory/types";

type InventoryMobileListProps = {
  loading: boolean;
  rows: Product[];
  onOpenHistory: (productId: string) => void;
};

export function InventoryMobileList({
  loading,
  rows,
  onOpenHistory,
}: InventoryMobileListProps) {
  return (
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
            onOpenHistory={() => onOpenHistory(product.id)}
          />
        ))
      )}
    </div>
  );
}

function InventoryCard({
  product,
  index,
  onOpenHistory,
}: {
  product: Product;
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
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
          {product.image ? (
            <img
              src={getPublicImageUrl("products", product.image) ?? ""}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>

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
                  className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${
                    outOfStock
                      ? "bg-red-100 text-red-700"
                      : lowStock
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {outOfStock ? "Hết hàng" : stock}
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
