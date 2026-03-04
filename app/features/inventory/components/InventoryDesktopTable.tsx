"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { getPublicImageUrl } from "@/app/lib/storage";
import type { Product, SortKey, SortOrder } from "@/app/features/inventory/types";

type InventoryDesktopTableProps = {
  loading: boolean;
  rows: Product[];
  sortKey: SortKey | null;
  sortOrder: SortOrder;
  onToggleSort: (key: SortKey) => void;
  onOpenHistory: (productId: string) => void;
  skeletonRows?: number;
};

export function InventoryDesktopTable({
  loading,
  rows,
  sortKey,
  sortOrder,
  onToggleSort,
  onOpenHistory,
  skeletonRows = 5,
}: InventoryDesktopTableProps) {
  return (
    <div className="hidden md:block">
      <table className="mt-2 w-full text-sm">
        <thead className="border-b border-border bg-muted/40 text-muted-foreground">
          <tr>
            <th className="w-16 py-3 pl-5 pr-2 text-center">STT</th>
            <th
              onClick={() => onToggleSort("name")}
              className="group cursor-pointer select-none px-4 py-3 text-left text-muted-foreground transition hover:text-brand-2"
            >
              <div className="inline-flex items-center gap-1">
                <span>Sản phẩm</span>
                <span className="flex h-4 w-4 items-center justify-center">
                  {sortKey !== "name" && (
                    <ChevronsUpDown
                      size={14}
                      className="opacity-50 transition-opacity group-hover:opacity-100"
                    />
                  )}

                  {sortKey === "name" && sortOrder === "asc" && <ChevronUp size={14} />}

                  {sortKey === "name" && sortOrder === "desc" && <ChevronDown size={14} />}
                </span>
              </div>
            </th>

            <th
              onClick={() => onToggleSort("stock")}
              className="group cursor-pointer select-none px-4 py-3 text-center text-muted-foreground transition hover:text-brand-2"
            >
              <div className="inline-flex items-center justify-center gap-1">
                <span>Tồn kho</span>
                <span className="flex h-4 w-4 items-center justify-center">
                  {sortKey !== "stock" && (
                    <ChevronsUpDown
                      size={14}
                      className="opacity-50 transition-opacity group-hover:opacity-100"
                    />
                  )}

                  {sortKey === "stock" && sortOrder === "asc" && <ChevronUp size={14} />}

                  {sortKey === "stock" && sortOrder === "desc" && <ChevronDown size={14} />}
                </span>
              </div>
            </th>

            <th className="w-56 px-4 py-3 text-center">Tổng định lượng/ĐVT</th>
            <th className="w-40 px-4 py-3 text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-4 pl-5 pr-2">
                  <div className="h-4 w-8 rounded bg-muted" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-24 w-20 rounded-lg bg-muted" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-muted" />
                      <div className="h-3 w-24 rounded bg-muted" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="mx-auto h-7 w-24 rounded-lg bg-muted" />
                </td>
                <td className="px-4 py-4">
                  <div className="mx-auto h-7 w-36 rounded-lg bg-muted" />
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="ml-auto h-7 w-20 rounded bg-muted" />
                </td>
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-muted-foreground">
                Chưa có sản phẩm nào
              </td>
            </tr>
          ) : (
            rows.map((product, idx) => {
              const stock = product.stock_quantity ?? 0;
              const outOfStock = stock <= 0;
              const lowStock = stock > 0 && stock <= 5;

              return (
                <tr key={product.id} className="transition hover:bg-muted/40">
                  <td className="py-4 pl-5 pr-2 text-center text-muted-foreground">{idx + 1}</td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-24 w-20 overflow-hidden rounded-lg bg-muted/50">
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

                      <div className="min-w-0">
                        <p className="leading-snug font-bold text-brand-2">{product.name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                        outOfStock
                          ? "bg-red-100 text-red-700"
                          : lowStock
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {outOfStock ? "Hết hàng" : stock}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-foreground">
                      {product.measure_unit}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => onOpenHistory(product.id)}
                      className="rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground transition hover:bg-muted/50"
                    >
                      Lịch sử
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
