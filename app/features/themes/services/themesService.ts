import { supabase } from "@/app/lib/supabase";
import type { Banner, BannerSettings, Branding, Theme } from "../types";

export async function fetchThemesData(): Promise<{
  themes: Theme[];
  brandings: Branding[];
  banners: Banner[];
  bannerSettings: BannerSettings | null;
}> {
  const [themesRes, brandingsRes, bannersRes, settingsRes] = await Promise.all([
    supabase.from("app_themes").select("*").order("created_at", { ascending: true }),
    supabase.from("app_brandings").select("*").order("display_order"),
    supabase.from("banners").select("*").order("created_at", { ascending: true }),
    supabase.from("app_banner_settings").select("*").single(),
  ]);

  return {
    themes: themesRes.error ? [] : themesRes.data || [],
    brandings: brandingsRes.error ? [] : brandingsRes.data || [],
    banners: bannersRes.error ? [] : bannersRes.data || [],
    bannerSettings: settingsRes.error ? null : settingsRes.data,
  };
}

export async function activateAppTheme(themeId: string) {
  await supabase.from("app_themes").update({ is_active: false }).neq("id", themeId);
  await supabase.from("app_themes").update({ is_active: true }).eq("id", themeId);
}

export async function activateBranding(brandingId: string) {
  await supabase.from("app_brandings").update({ is_active: false }).neq("id", brandingId);
  await supabase.from("app_brandings").update({ is_active: true }).eq("id", brandingId);
}

export async function activateBannerThemeKey(themeKey: string) {
  await supabase.from("app_banner_settings").update({ active_theme_key: themeKey }).eq("id", 1);
  await supabase.from("banners").update({ is_active: true }).eq("theme_key", themeKey);
  await supabase.from("banners").update({ is_active: false }).neq("theme_key", themeKey);
}
