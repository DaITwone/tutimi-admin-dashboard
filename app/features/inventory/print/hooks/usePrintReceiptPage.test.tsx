import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProductMini, TxRow } from "@/app/features/inventory/print/types";
import { getReceiptTitle } from "@/app/features/inventory/print/utils/format";
import { usePrintReceiptPage } from "./usePrintReceiptPage";

type TxResponse = {
  data: TxRow[] | null;
  error: { message: string } | null;
};

type ProductsResponse = {
  data: ProductMini[] | null;
  error: { message: string } | null;
};

const { fromMock, txSelectMock, txEqMock, txOrderMock, productsSelectMock, productsInMock } =
  vi.hoisted(() => {
    const txOrder = vi.fn();
    const txEq = vi.fn(() => ({ order: txOrder }));
    const txSelect = vi.fn(() => ({ eq: txEq }));

    const productsIn = vi.fn();
    const productsSelect = vi.fn(() => ({ in: productsIn }));

    const from = vi.fn();

    return {
      fromMock: from,
      txSelectMock: txSelect,
      txEqMock: txEq,
      txOrderMock: txOrder,
      productsSelectMock: productsSelect,
      productsInMock: productsIn,
    };
  });

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

describe("usePrintReceiptPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches receipt rows, product map and computes derived fields", async () => {
    const rows: TxRow[] = [
      {
        id: "tx1",
        type: "IN",
        requested_quantity: 2,
        applied_quantity: 2,
        delta: 2,
        note: "  ",
        input_value: 500,
        input_unit: "ML",
        created_at: "2026-02-24T09:00:00.000Z",
        product_id: "p1",
        receipt_id: "abcdef123456",
      },
      {
        id: "tx2",
        type: "IN",
        requested_quantity: 3,
        applied_quantity: 3,
        delta: 3,
        note: "Dieu chinh ton kho",
        input_value: 1,
        input_unit: "L",
        created_at: "2026-02-24T09:05:00.000Z",
        product_id: "p2",
        receipt_id: "abcdef123456",
      },
    ];

    const products: ProductMini[] = [
      { id: "p1", name: "Milk", image: null },
      { id: "p2", name: "Tea", image: "tea.png" },
    ];

    txOrderMock.mockResolvedValue({
      data: rows,
      error: null,
    } as TxResponse);
    productsInMock.mockResolvedValue({
      data: products,
      error: null,
    } as ProductsResponse);

    fromMock.mockImplementation((table: string) => {
      if (table === "inventory_transactions") return { select: txSelectMock };
      if (table === "products") return { select: productsSelectMock };
      return { select: vi.fn() };
    });

    const { result } = renderHook(() =>
      usePrintReceiptPage({ receiptId: "abcdef123456", receiptType: "in" })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.rows).toHaveLength(2);
    expect(result.current.createdAt).toBe("2026-02-24T09:00:00.000Z");
    expect(result.current.reasonText).toBe("Dieu chinh ton kho");
    expect(result.current.totalQty).toBe(5);
    expect(result.current.receiptCode).toBe("ABCDEF12");
    expect(result.current.title).toBe(getReceiptTitle("in"));
    expect(result.current.productMap.get("p2")?.name).toBe("Tea");

    expect(fromMock).toHaveBeenCalledWith("inventory_transactions");
    expect(txEqMock).toHaveBeenCalledWith("receipt_id", "abcdef123456");
    expect(fromMock).toHaveBeenCalledWith("products");
    expect(productsInMock).toHaveBeenCalledWith("id", ["p1", "p2"]);
  });

  it("sets error when receipt query fails", async () => {
    txOrderMock.mockResolvedValue({
      data: null,
      error: { message: "boom" },
    } as TxResponse);

    fromMock.mockImplementation((table: string) => {
      if (table === "inventory_transactions") return { select: txSelectMock };
      return { select: productsSelectMock };
    });

    const { result } = renderHook(() =>
      usePrintReceiptPage({ receiptId: "abcdef123456", receiptType: "out" })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("boom");
    expect(result.current.rows).toEqual([]);
    expect(productsInMock).not.toHaveBeenCalled();
  });
});
