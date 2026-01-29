import { create } from 'zustand';

type InventoryAction = 'IN' | 'OUT' | 'ADJUST';

type InventoryUIState = {
  // ===== Action Drawer =====
  open: boolean;
  action: InventoryAction;
  productId: string | null;
  productName: string | null;

  openDrawer: (payload: {
    action: InventoryAction;
    productId: string;
    productName: string;
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

  openDrawer: ({ action, productId, productName }) =>
    set({
      open: true,
      action,
      productId,
      productName,
    }),

  closeDrawer: () =>
    set({
      open: false,
      productId: null,
      productName: null,
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
