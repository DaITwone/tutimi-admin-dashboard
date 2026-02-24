import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBulkInventoryPageState } from "./useBulkInventoryPageState";

const { useRouterMock, useProductsQueryMock, rpcMock, backMock, pushMock } = vi.hoisted(
  () => {
    const push = vi.fn();
    const back = vi.fn();
    return {
      useRouterMock: vi.fn(() => ({ push, back })),
      useProductsQueryMock: vi.fn(),
      rpcMock: vi.fn(),
      backMock: back,
      pushMock: push,
    };
  }
);

vi.mock("next/navigation", () => ({
  useRouter: useRouterMock,
}));

vi.mock("@/app/hooks/useProductsQuery", () => ({
  useProductsQuery: useProductsQueryMock,
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    rpc: rpcMock,
  },
}));

describe("useBulkInventoryPageState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("alert", vi.fn());
    vi.stubGlobal("crypto", { randomUUID: () => "receipt-12345678" });
    useProductsQueryMock.mockReturnValue({
      data: [
        { id: "p1", stock_quantity: 20 },
        { id: "p2", stock_quantity: 1 },
      ],
      isLoading: false,
    });
    rpcMock.mockResolvedValue({ error: null });
  });

  it("submits inventory in and resets state on success", async () => {
    const { result } = renderHook(() => useBulkInventoryPageState("in"));

    act(() => {
      result.current.setRow("p1", { inputValue: "500", unit: "ML" });
    });

    expect(result.current.canSubmit).toBe(true);
    expect(result.current.selectedItems).toEqual([
      { productId: "p1", qty: 1, inputValue: 500, inputUnit: "ML" },
    ]);

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(rpcMock).toHaveBeenCalledWith(
      "create_inventory_in",
      expect.objectContaining({
        p_product_id: "p1",
        p_quantity: 1,
        p_receipt_id: "receipt-12345678",
      })
    );
    expect(result.current.result).toMatchObject({ success: 1, fail: 0 });
    expect(result.current.reasonPreset).toBe("Kho giao");
    expect(result.current.rowById).toEqual({});
  });

  it("blocks out submit when quantity exceeds stock", async () => {
    const { result } = renderHook(() => useBulkInventoryPageState("out"));

    act(() => {
      result.current.setRow("p2", { inputValue: "1", unit: "L" });
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(rpcMock).not.toHaveBeenCalledWith("create_inventory_out", expect.anything());
    expect(result.current.result).toMatchObject({ success: 0, fail: 1 });
    expect(result.current.lastReceiptId).toBeNull();
  });

  it("navigates for print and back actions", async () => {
    const { result } = renderHook(() => useBulkInventoryPageState("in"));

    act(() => {
      result.current.setRow("p1", { inputValue: "500", unit: "ML" });
    });
    await act(async () => {
      await result.current.handleSubmit();
    });

    act(() => {
      result.current.handlePrintReceipt();
      result.current.handleBack();
    });

    expect(pushMock).toHaveBeenCalledWith("/inventory/print/receipt-12345678?type=in");
    expect(backMock).toHaveBeenCalledTimes(1);
  });
});
