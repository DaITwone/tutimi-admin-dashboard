"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import type {
  PrintReceiptViewModel,
  ProductMini,
  ReceiptType,
  TxRow,
} from "@/app/features/inventory/print/types";
import { getReceiptTitle } from "@/app/features/inventory/print/utils/format";

type UsePrintReceiptPageParams = {
  receiptId: string;
  receiptType: ReceiptType;
};

export function usePrintReceiptPage({
  receiptId,
  receiptType,
}: UsePrintReceiptPageParams): PrintReceiptViewModel {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TxRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [productMap, setProductMap] = useState<Map<string, ProductMini>>(new Map());

  useEffect(() => {
    let mounted = true;

    const fetchReceipt = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: txError } = await supabase
          .from("inventory_transactions")
          .select(
            `
              id,
              type,
              requested_quantity,
              applied_quantity,
              delta,
              note,
              input_value,
              input_unit,
              created_at,
              product_id,
              receipt_id
            `
          )
          .eq("receipt_id", receiptId)
          .order("created_at", { ascending: true });

        if (txError) throw txError;

        const txRows = (data ?? []) as TxRow[];
        const productIds = Array.from(new Set(txRows.map((row) => row.product_id)));

        let nextProductMap = new Map<string, ProductMini>();
        if (productIds.length > 0) {
          const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select("id, name, image")
            .in("id", productIds);

          if (productsError) throw productsError;

          nextProductMap = new Map<string, ProductMini>();
          (productsData ?? []).forEach((product: ProductMini) => {
            nextProductMap.set(product.id, product);
          });
        }

        if (!mounted) return;
        setRows(txRows);
        setProductMap(nextProductMap);
      } catch (fetchError: unknown) {
        if (!mounted) return;
        const message =
          fetchError && typeof fetchError === "object" && "message" in fetchError
            ? String(fetchError.message)
            : "Failed to fetch receipt";
        setError(message);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchReceipt();

    return () => {
      mounted = false;
    };
  }, [receiptId]);

  const createdAt = useMemo(() => rows[0]?.created_at ?? null, [rows]);

  const reasonText = useMemo(() => {
    const found = rows.find((row) => row.note?.trim())?.note;
    return found ?? "";
  }, [rows]);

  const totalQty = useMemo(
    () => rows.reduce((sum, row) => sum + (row.applied_quantity ?? 0), 0),
    [rows]
  );

  const receiptCode = useMemo(() => receiptId.slice(0, 8).toUpperCase(), [receiptId]);

  const title = useMemo(() => getReceiptTitle(receiptType), [receiptType]);

  return {
    loading,
    error,
    rows,
    productMap,
    createdAt,
    reasonText,
    totalQty,
    title,
    receiptCode,
  };
}

