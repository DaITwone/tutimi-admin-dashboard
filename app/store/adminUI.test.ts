import { describe, it, expect, beforeEach } from "vitest";
import { useAdminUI } from "./adminUI";

describe("useAdminUI store", () => {
  beforeEach(() => {
    useAdminUI.setState({ sidebarOpen: false });
  });

  it("openSidebar", () => {
    useAdminUI.getState().openSidebar();
    expect(useAdminUI.getState().sidebarOpen).toBe(true);
  });

  it("closeSidebar", () => {
    useAdminUI.setState({ sidebarOpen: true });
    useAdminUI.getState().closeSidebar();
    expect(useAdminUI.getState().sidebarOpen).toBe(false);
  });

  it("toggleSidebar", () => {
    useAdminUI.getState().toggleSidebar();
    expect(useAdminUI.getState().sidebarOpen).toBe(true);
    useAdminUI.getState().toggleSidebar();
    expect(useAdminUI.getState().sidebarOpen).toBe(false);
  });
});
