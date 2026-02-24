import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  activateAppTheme,
  activateBannerThemeKey,
  activateBranding,
  fetchThemesData,
} from "./themesService";

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock("@/app/lib/supabase", () => ({
  supabase: {
    from: fromMock,
  },
}));

describe("themesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchThemesData returns safe fallbacks on partial errors", async () => {
    fromMock.mockImplementation((table: string) => {
      if (table === "app_themes") {
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: [{ id: "t1" }], error: null }),
          })),
        };
      }
      if (table === "app_brandings") {
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: null, error: { message: "x" } }),
          })),
        };
      }
      if (table === "banners") {
        return {
          select: vi.fn(() => ({
            order: vi.fn().mockResolvedValue({ data: [{ id: "b1" }], error: null }),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
        })),
      };
    });

    const result = await fetchThemesData();

    expect(result.themes).toHaveLength(1);
    expect(result.brandings).toEqual([]);
    expect(result.banners).toHaveLength(1);
    expect(result.bannerSettings).toEqual({ id: 1 });
  });

  it("activateAppTheme updates active flags", async () => {
    const neqMock = vi.fn().mockResolvedValue({});
    const eqMock = vi.fn().mockResolvedValue({});

    fromMock.mockReturnValue({
      update: vi.fn((payload: { is_active: boolean }) => {
        if (payload.is_active) return { eq: eqMock };
        return { neq: neqMock };
      }),
    });

    await activateAppTheme("theme-1");

    expect(neqMock).toHaveBeenCalledWith("id", "theme-1");
    expect(eqMock).toHaveBeenCalledWith("id", "theme-1");
  });

  it("activateBannerThemeKey updates settings and banner statuses", async () => {
    const eqMock = vi.fn().mockResolvedValue({});
    const neqMock = vi.fn().mockResolvedValue({});

    fromMock.mockImplementation((table: string) => ({
      update: vi.fn((payload: { active_theme_key?: string; is_active?: boolean }) => {
        if (table === "app_banner_settings") return { eq: eqMock };
        if (payload.is_active) return { eq: eqMock };
        return { neq: neqMock };
      }),
    }));

    await activateBannerThemeKey("summer");

    expect(eqMock).toHaveBeenCalledWith("id", 1);
    expect(eqMock).toHaveBeenCalledWith("theme_key", "summer");
    expect(neqMock).toHaveBeenCalledWith("theme_key", "summer");
  });

  it("activateBranding updates active flags", async () => {
    const neqMock = vi.fn().mockResolvedValue({});
    const eqMock = vi.fn().mockResolvedValue({});

    fromMock.mockReturnValue({
      update: vi.fn((payload: { is_active: boolean }) => {
        if (payload.is_active) return { eq: eqMock };
        return { neq: neqMock };
      }),
    });

    await activateBranding("branding-1");

    expect(neqMock).toHaveBeenCalledWith("id", "branding-1");
    expect(eqMock).toHaveBeenCalledWith("id", "branding-1");
  });
});
