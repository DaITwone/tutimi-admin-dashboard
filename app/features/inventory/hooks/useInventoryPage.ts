"use client";

import { useEffect, useMemo, useState } from "react";
import { useProductsQuery } from "@/app/hooks/useProductsQuery";
import { useInventoryCategories } from "@/app/features/inventory/hooks/useInventoryCategories";
import type { Product, SortKey, SortOrder } from "@/app/features/inventory/types";

export function useInventoryPage() {
  const { categories } = useInventoryCategories();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const {
    data: products = [],
    isLoading: loading,
    error: productsError,
  } = useProductsQuery({
    categoryId: activeCategory,
    search: debouncedSearch,
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortOrder("asc");
  };

  const rows = useMemo(() => {
    if (!sortKey) return products as Product[];

    return [...(products as Product[])].sort((a, b) => {
      if (sortKey === "stock") {
        const aValue = a.stock_quantity ?? 0;
        const bValue = b.stock_quantity ?? 0;

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }

      const aValue = a.name?.toLowerCase() ?? "";
      const bValue = b.name?.toLowerCase() ?? "";

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, sortKey, sortOrder]);

  const error = productsError ? "Không thể tải danh sách sản phẩm" : null;

  return {
    categories,
    activeCategory,
    setActiveCategory,
    search,
    setSearch,
    loading,
    error,
    rows,
    sortKey,
    sortOrder,
    toggleSort,
  };
}
