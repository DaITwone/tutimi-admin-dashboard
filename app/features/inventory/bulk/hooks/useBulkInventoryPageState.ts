"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { useProductsQuery } from "@/app/hooks/useProductsQuery";
import { convertToQty } from "../utils";
import type {
  BulkType,
  InputUnit,
  RowState,
  SelectedBulkItem,
  SortDirection,
  SubmitResult,
} from "../bulk.model";
import { REASON_PRESETS } from "../bulk.model";

export function useBulkInventoryPageState(type: BulkType) {
  const router = useRouter();
  const title = type === "in" ? "Nhập Hàng" : "Xuất Hàng";
  const [search, setSearch] = useState("");
  const { data: products = [], isLoading } = useProductsQuery({
    categoryId: "all",
    search,
  });

  const [rowById, setRowById] = useState<Record<string, RowState>>({});
  const [reasonPreset, setReasonPreset] = useState<(typeof REASON_PRESETS)[number]>("Kho giao");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [lastReceiptId, setLastReceiptId] = useState<string | null>(null);
  const [sortStock, setSortStock] = useState<SortDirection>(null);

  const reasonText = useMemo(() => {
    if (reasonPreset !== "Khác") return reasonPreset;
    return customReason.trim();
  }, [reasonPreset, customReason]);

  const selectedItems = useMemo<SelectedBulkItem[]>(() => {
    return Object.entries(rowById)
      .map(([productId, row]) => ({
        productId,
        qty: row.qty,
        inputValue: row.inputValue.trim() === "" ? null : Number(row.inputValue),
        inputUnit: row.unit,
      }))
      .filter((x) => x.qty > 0);
  }, [rowById]);

  const canSubmit = useMemo(() => {
    if (selectedItems.length === 0) return false;
    if (reasonPreset === "Khác") return customReason.trim().length > 0;
    return true;
  }, [selectedItems.length, reasonPreset, customReason]);

  const setRow = (productId: string, patch: Partial<RowState>) => {
    setRowById((prev) => {
      const current: RowState = prev[productId] ?? {
        inputValue: "",
        unit: "ML",
        qty: 0,
      };

      const next: RowState = { ...current, ...patch };
      if (next.inputValue.trim() === "") {
        return { ...prev, [productId]: { ...next, qty: 0 } };
      }

      const num = Number(next.inputValue);
      if (!Number.isFinite(num) || num <= 0) {
        return { ...prev, [productId]: { ...next, qty: 0 } };
      }

      const qty = convertToQty(num, next.unit);
      return { ...prev, [productId]: { ...next, qty } };
    });
  };

  const clearRow = (productId: string) => {
    setRowById((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const adjustInput = (productId: string, delta: number) => {
    setRowById((prev) => {
      const current = prev[productId] ?? {
        inputValue: "",
        unit: "ML" as InputUnit,
        qty: 0,
      };

      const currentValue = Number(current.inputValue || 0);
      const nextValue = Math.max(0, currentValue + delta);
      return {
        ...prev,
        [productId]: {
          ...current,
          inputValue: nextValue === 0 ? "" : String(nextValue),
        },
      };
    });
  };

  const toggleStockSort = () => {
    setSortStock((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const sortedProducts = useMemo(() => {
    if (!sortStock) return products;
    return [...products].sort((a, b) => {
      const stockA = a.stock_quantity ?? 0;
      const stockB = b.stock_quantity ?? 0;
      return sortStock === "asc" ? stockA - stockB : stockB - stockA;
    });
  }, [products, sortStock]);

  const handleSubmit = async () => {
    setResult(null);

    if (!canSubmit) {
      alert("Vui lòng nhập định lượng hợp lệ và chọn lý do.");
      return;
    }

    setSubmitting(true);

    const receiptId = crypto.randomUUID();
    setLastReceiptId(receiptId);

    const details: { productId: string; qty: number; error?: string }[] = [];

    for (const item of selectedItems) {
      try {
        if (type === "out") {
          const product = products.find((p) => p.id === item.productId);
          const stock = product?.stock_quantity ?? 0;
          if (item.qty > stock) {
            throw new Error(`Không thể xuất vượt tồn. Tồn hiện tại: ${stock}`);
          }
        }

        if (type === "in") {
          const { error } = await supabase.rpc("create_inventory_in", {
            p_product_id: item.productId,
            p_quantity: item.qty,
            p_note: reasonText || null,
            p_input_value: item.inputValue,
            p_input_unit: item.inputUnit,
            p_receipt_id: receiptId,
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.rpc("create_inventory_out", {
            p_product_id: item.productId,
            p_quantity: item.qty,
            p_note: reasonText || null,
            p_input_value: item.inputValue,
            p_input_unit: item.inputUnit,
            p_receipt_id: receiptId,
          });
          if (error) throw error;
        }

        details.push({ productId: item.productId, qty: item.qty });
      } catch (err: any) {
        details.push({
          productId: item.productId,
          qty: item.qty,
          error: err?.message ?? "Unknown error",
        });
      }
    }

    const success = details.filter((d) => !d.error).length;
    const fail = details.filter((d) => !!d.error).length;

    setResult({ success, fail, details });
    setSubmitting(false);

    if (success > 0) {
      setRowById({});
      setSearch("");
      setReasonPreset("Kho giao");
      setCustomReason("");
    }
    if (success === 0) setLastReceiptId(null);
  };

  const handlePrintReceipt = () => {
    if (!lastReceiptId) return;
    router.push(`/inventory/print/${lastReceiptId}?type=${type}`);
  };

  const handleBack = () => router.back();

  return {
    title,
    products,
    sortedProducts,
    isLoading,
    search,
    setSearch,
    rowById,
    reasonPreset,
    setReasonPreset,
    customReason,
    setCustomReason,
    reasonText,
    selectedItems,
    canSubmit,
    submitting,
    result,
    lastReceiptId,
    sortStock,
    setRow,
    clearRow,
    adjustInput,
    toggleStockSort,
    handleSubmit,
    handlePrintReceipt,
    handleBack,
  };
}
