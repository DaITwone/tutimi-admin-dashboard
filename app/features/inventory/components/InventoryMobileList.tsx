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
    <div className="space-y-3 px-4 pb-4 pt-3 md:hidden">
      {loading ? (
        <InventoryMobileSkeleton count={5} />
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-sm">
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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/50">
          {product.image ? (
            <img
              src={getPublicImageUrl("products", product.image) ?? ""}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="line-clamp-2 text-sm font-bold text-brand-2">{product.name}</p>

            <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="text-xs text-muted-foreground">Tồn kho</div>
              <div className="mt-1">
                <span
                  className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${
                    outOfStock
                      ? "bg-red-100 text-red-700"
                      : lowStock
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {outOfStock ? "Hết hàng" : stock}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-3">
              <div className="text-xs text-muted-foreground">Tổng định lượng</div>
              <div className="mt-1">
                <span className="inline-flex rounded-lg bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                  {totalText}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenHistory}
            className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:bg-muted/50"
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
          className="animate-pulse rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="h-24 w-20 shrink-0 rounded-xl bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-16 rounded-xl bg-muted" />
                <div className="h-16 rounded-xl bg-muted" />
              </div>

              <div className="mt-3 h-10 rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
