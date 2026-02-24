"use client";

import { useParams } from "next/navigation";
import { BulkInventoryPageView, type BulkType } from "@/app/features/inventory/bulk";

export default function BulkInventoryPage() {
  const params = useParams<{ type: string }>();
  const type = (params.type === "in" ? "in" : "out") as BulkType;

  return <BulkInventoryPageView type={type} />;
}
