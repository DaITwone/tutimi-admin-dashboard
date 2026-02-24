"use client";

import { useRouter } from "next/navigation";
import {
  InventoryHistoryDrawer,
  useInventoryUI,
} from "@/app/features/inventory";
import { InventoryPageView } from "@/app/features/inventory/components/InventoryPageView";
import { useInventoryPage } from "@/app/features/inventory/hooks/useInventoryPage";

export default function InventoryPage() {
  const router = useRouter();
  const invUI = useInventoryUI();
  const {
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
  } = useInventoryPage();

  return (
    <>
      <InventoryPageView
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        error={error}
        loading={loading}
        rows={rows}
        search={search}
        onSearchChange={setSearch}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onToggleSort={toggleSort}
        onBulkIn={() => router.push("/inventory/bulk/in")}
        onBulkOut={() => router.push("/inventory/bulk/out")}
        onOpenHistoryPage={() => router.push("/inventory/history")}
        onOpenHistory={(productId) => invUI.openHistory({ productId })}
      />
      <InventoryHistoryDrawer />
    </>
  );
}
