import { create } from "zustand"; // hàm factory tạo ra một custom React hook(store hook)

type AdminUIState = {
    sidebarOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebar: () => void;
};

export const useAdminUI = create<AdminUIState>((set) => ({
    sidebarOpen: false,
    openSidebar: () => set({ sidebarOpen: true }),
    closeSidebar: () => set({ sidebarOpen: false }),
    toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// set(object) -> cập nhật trực tiếp.
// set(fn) -> tính toán dựa trên state hiện tại.

/* 
    set is the function used to update Zustand state.
    It can receive an object or a function.
*/