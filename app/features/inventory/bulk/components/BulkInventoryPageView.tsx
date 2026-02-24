"use client";

import type { BulkType } from "../bulk.model";
import { useBulkInventoryPageState } from "../hooks/useBulkInventoryPageState";
import { BulkInventoryHeader } from "./BulkInventoryHeader";
import { BulkProductsMobileList } from "./BulkProductsMobileList";
import { BulkProductsTable } from "./BulkProductsTable";
import { BulkReasonSection } from "./BulkReasonSection";
import { BulkSearchSection } from "./BulkSearchSection";

export function BulkInventoryPageView({ type }: { type: BulkType }) {
  const state = useBulkInventoryPageState(type);

  return (
    <div className="mt-6 space-y-4">
      <BulkInventoryHeader
        title={state.title}
        lastReceiptId={state.lastReceiptId}
        successCount={state.result?.success ?? 0}
        submitting={state.submitting}
        canSubmit={state.canSubmit}
        onBack={state.handleBack}
        onPrint={state.handlePrintReceipt}
        onSubmit={state.handleSubmit}
      />

      <BulkReasonSection
        reasonPreset={state.reasonPreset}
        customReason={state.customReason}
        onChangePreset={state.setReasonPreset}
        onChangeCustomReason={state.setCustomReason}
      />

      <BulkSearchSection
        search={state.search}
        selectedCount={state.selectedItems.length}
        onChangeSearch={state.setSearch}
      />

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <BulkProductsMobileList
          type={type}
          products={state.sortedProducts}
          rowById={state.rowById}
          isLoading={state.isLoading}
          setRow={state.setRow}
          clearRow={state.clearRow}
          adjustInput={state.adjustInput}
        />

        <BulkProductsTable
          type={type}
          products={state.sortedProducts}
          rowById={state.rowById}
          isLoading={state.isLoading}
          sortStock={state.sortStock}
          onToggleStockSort={state.toggleStockSort}
          setRow={state.setRow}
          clearRow={state.clearRow}
          adjustInput={state.adjustInput}
        />
      </div>
    </div>
  );
}
