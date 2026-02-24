"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PrintReceiptPageView } from "@/app/features/inventory/print/components/PrintReceiptPageView";
import { usePrintReceiptPage } from "@/app/features/inventory/print/hooks/usePrintReceiptPage";
import type { ReceiptType } from "@/app/features/inventory/print/types";

export default function PrintReceiptPage() {
  const router = useRouter();
  const params = useParams<{ receiptId: string }>();
  const searchParams = useSearchParams();

  const receiptId = params.receiptId;
  const receiptType: ReceiptType = searchParams.get("type") === "out" ? "out" : "in";

  const viewModel = usePrintReceiptPage({ receiptId, receiptType });

  return (
    <PrintReceiptPageView
      {...viewModel}
      receiptType={receiptType}
      onBack={() => router.back()}
      onPrint={() => window.print()}
    />
  );
}

