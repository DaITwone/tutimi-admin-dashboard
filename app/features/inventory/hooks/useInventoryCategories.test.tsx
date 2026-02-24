import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useInventoryCategories } from "./useInventoryCategories";

const { fromMock, selectMock, orderMock } = vi.hoisted(() => {
  const order = vi.fn();
  const select = vi.fn(() => ({ order }));
  const from = vi.fn(() => ({ select }));
  return { fromMock: from, selectMock: select, orderMock: order };
});

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

describe("useInventoryCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    orderMock.mockResolvedValue([
      {
        data: [
          { id: "c1", title: "Coffee" },
          { id: "c2", title: "Tea" },
        ],
      },
    ][0]);
  });

  it("fetches and exposes categories", async () => {
    const { result } = renderHook(() => useInventoryCategories());

    await waitFor(() => {
      expect(result.current.categories).toHaveLength(2);
    });

    expect(fromMock).toHaveBeenCalledWith("categories");
    expect(selectMock).toHaveBeenCalledWith("id, title");
    expect(orderMock).toHaveBeenCalledWith("sort_order", { ascending: true });
  });
});
