import { create } from 'zustand';

type InventoryUIState = {
  historyOpen: boolean;
  historyProductId: string | null;

  openHistory: (payload: { productId: string }) => void;
  closeHistory: () => void;
};

export const useInventoryUI = create<InventoryUIState>((set) => ({
  historyOpen: false,
  historyProductId: null,

  openHistory: ({ productId }) =>
    set({
      historyOpen: true,
      historyProductId: productId,
    }),

  closeHistory: () =>
    set({
      historyOpen: false,
      historyProductId: null,
    }),
}));
