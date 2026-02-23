"use client";

import { useRouter } from "next/navigation";
import { ThemesView, useThemes } from "@/app/features/themes";

export default function AdminThemesPage() {
  const router = useRouter();
  const {
    themes,
    brandings,
    loading,
    activeBannerThemeKey,
    bannerThemeKeys,
    bannersInActiveTheme,
    setActiveAppTheme,
    setActiveBranding,
    setActiveBannerThemeKey,
  } = useThemes();

  return (
    <ThemesView
      themes={themes}
      brandings={brandings}
      loading={loading}
      activeBannerThemeKey={activeBannerThemeKey}
      bannerThemeKeys={bannerThemeKeys}
      bannersInActiveTheme={bannersInActiveTheme}
      onCreateTheme={() => router.push("/themes/create")}
      onSetActiveAppTheme={setActiveAppTheme}
      onSetActiveBranding={setActiveBranding}
      onSetActiveBannerThemeKey={setActiveBannerThemeKey}
    />
  );
}
