import type { Banner, Branding, Theme } from "../types";
import { AppThemesSection, BannersSection, BrandingsSection } from "./ThemesSections";

type ThemesViewProps = {
  themes: Theme[];
  brandings: Branding[];
  bannerThemeKeys: string[];
  activeBannerThemeKey: string;
  bannersInActiveTheme: Banner[];
  loading: boolean;
  onCreateTheme: () => void;
  onSetActiveAppTheme: (theme: Theme) => void;
  onSetActiveBranding: (branding: Branding) => void;
  onSetActiveBannerThemeKey: (themeKey: string) => void;
};

export default function ThemesView({
  themes,
  brandings,
  bannerThemeKeys,
  activeBannerThemeKey,
  bannersInActiveTheme,
  loading,
  onCreateTheme,
  onSetActiveAppTheme,
  onSetActiveBranding,
  onSetActiveBannerThemeKey,
}: ThemesViewProps) {
  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="p-4 lg:p-6 space-y-10">
      <AppThemesSection themes={themes} onCreate={onCreateTheme} onSetActive={onSetActiveAppTheme} />

      <BrandingsSection brandings={brandings} onSetActive={onSetActiveBranding} />

      <BannersSection
        bannerThemeKeys={bannerThemeKeys}
        activeBannerThemeKey={activeBannerThemeKey}
        bannersInActiveTheme={bannersInActiveTheme}
        onSetActiveBannerThemeKey={onSetActiveBannerThemeKey}
      />
    </div>
  );
}
