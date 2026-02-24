import { describe, it, expect, beforeEach } from "vitest";
import { useInventoryUI } from "./inventoryUI";

describe("useInventoryUI store", () => {
  beforeEach(() => {
    useInventoryUI.setState({ historyOpen: false, historyProductId: null });
  });

  it("openHistory", () => {
    useInventoryUI.getState().openHistory({ productId: "p1" });
    expect(useInventoryUI.getState().historyOpen).toBe(true);
    expect(useInventoryUI.getState().historyProductId).toBe("p1");
  });

  it("closeHistory", () => {
    useInventoryUI.setState({ historyOpen: true, historyProductId: "p1" });
    useInventoryUI.getState().closeHistory();
    expect(useInventoryUI.getState().historyOpen).toBe(false);
    expect(useInventoryUI.getState().historyProductId).toBeNull();
  });
});
