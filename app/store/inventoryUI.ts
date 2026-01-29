import { create } from 'zustand';

export type InventoryAction = 'IN' | 'OUT' | 'ADJUST';

type InventoryUIState = {
  open: boolean;
  action: InventoryAction;
  productId: string | null;
  productName: string | null;

  openDrawer: (payload: { action: InventoryAction; productId: string; productName: string }) => void;
  closeDrawer: () => void;
};

export const useInventoryUI = create<InventoryUIState>((set) => ({
  open: false,
  action: 'IN',
  productId: null,
  productName: null,

  openDrawer: ({ action, productId, productName }) =>
    set({ open: true, action, productId, productName }),

  closeDrawer: () => set({ open: false, productId: null, productName: null }),
}));
    
