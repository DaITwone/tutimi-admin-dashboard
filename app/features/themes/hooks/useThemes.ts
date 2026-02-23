"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Banner, BannerSettings, Branding, Theme } from "../types";
import {
  activateAppTheme,
  activateBannerThemeKey,
  activateBranding,
  fetchThemesData,
} from "../services/themesService";

export function useThemes() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [brandings, setBrandings] = useState<Branding[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerSettings, setBannerSettings] = useState<BannerSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const activeBannerThemeKey = bannerSettings?.active_theme_key || "";

  const bannerThemeKeys = useMemo(() => {
    const keys = Array.from(new Set(banners.map((b) => b.theme_key)));
    return keys.sort((a, b) => a.localeCompare(b));
  }, [banners]);

  const bannersInActiveTheme = useMemo(() => {
    if (!activeBannerThemeKey) return [];
    return banners
      .filter((b) => b.theme_key === activeBannerThemeKey)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [banners, activeBannerThemeKey]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchThemesData();
    setThemes(data.themes);
    setBrandings(data.brandings);
    setBanners(data.banners);
    setBannerSettings(data.bannerSettings);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setLoading(true);
      const data = await fetchThemesData();
      if (!isMounted) return;
      setThemes(data.themes);
      setBrandings(data.brandings);
      setBanners(data.banners);
      setBannerSettings(data.bannerSettings);
      setLoading(false);
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  const setActiveAppTheme = async (theme: Theme) => {
    await activateAppTheme(theme.id);
    setThemes((prev) =>
      prev.map((t) => ({
        ...t,
        is_active: t.id === theme.id,
      })),
    );
  };

  const setActiveBranding = async (branding: Branding) => {
    await activateBranding(branding.id);
    setBrandings((prev) =>
      prev.map((b) => ({
        ...b,
        is_active: b.id === branding.id,
      })),
    );
  };

  const setActiveBannerTheme = async (themeKey: string) => {
    await activateBannerThemeKey(themeKey);

    setBannerSettings((prev) => (prev ? { ...prev, active_theme_key: themeKey } : prev));
    setBanners((prev) =>
      prev.map((b) => ({
        ...b,
        is_active: b.theme_key === themeKey,
      })),
    );
  };

  return {
    themes,
    brandings,
    loading,
    activeBannerThemeKey,
    bannerThemeKeys,
    bannersInActiveTheme,
    loadData,
    setActiveAppTheme,
    setActiveBranding,
    setActiveBannerThemeKey: setActiveBannerTheme,
  };
}
