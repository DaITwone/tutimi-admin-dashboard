import { create } from 'zustand';

type InventoryAction = 'IN' | 'OUT' | 'ADJUST';

type InventoryUIState = {
  // ===== Action Drawer =====
  open: boolean;
  action: InventoryAction;
  productId: string | null;
  productName: string | null;

  // ✅ NEW: tồn kho hiện tại
  stockQuantity: number;

  openDrawer: (payload: {
    action: InventoryAction;
    productId: string;
    productName: string;
    stockQuantity: number; // ✅ NEW
  }) => void;

  closeDrawer: () => void;

  // ===== History Drawer =====
  historyOpen: boolean;
  historyProductId: string | null;
  historyProductName: string | null;

  openHistory: (payload: { productId: string; productName: string }) => void;
  closeHistory: () => void;
};

export const useInventoryUI = create<InventoryUIState>((set) => ({
  // ===== Action Drawer init =====
  open: false,
  action: 'IN',
  productId: null,
  productName: null,

  // ✅ NEW init
  stockQuantity: 0,

  openDrawer: ({ action, productId, productName, stockQuantity }) =>
    set({
      open: true,
      action,
      productId,
      productName,
      stockQuantity, // ✅ NEW
    }),

  closeDrawer: () =>
    set({
      open: false,
      productId: null,
      productName: null,
      stockQuantity: 0, // ✅ NEW reset
    }),

  // ===== History Drawer init =====
  historyOpen: false,
  historyProductId: null,
  historyProductName: null,

  openHistory: ({ productId, productName }) =>
    set({
      historyOpen: true,
      historyProductId: productId,
      historyProductName: productName,
    }),

  closeHistory: () =>
    set({
      historyOpen: false,
      historyProductId: null,
      historyProductName: null,
    }),
}));
