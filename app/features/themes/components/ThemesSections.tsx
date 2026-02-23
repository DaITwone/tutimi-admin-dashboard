import Image from "next/image";
import { getPublicImageUrl } from "@/app/lib/storage";
import type { Banner, Branding, Theme } from "../types";

export function AppThemesSection({
  themes,
  onCreate,
  onSetActive,
}: {
  themes: Theme[];
  onCreate: () => void;
  onSetActive: (theme: Theme) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 border-b-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-[#1b4f94]">GIAO DIỆN CHÍNH</h2>

        <button
          onClick={onCreate}
          className="ư-full sm:w-auto rounded-lg bg-[#1b4f94] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c4273]"
        >
          + Thêm
        </button>
      </div>

      <div
        className="
          flex gap-2 overflow-x-auto pb-4
          snap-x snap-mandatory
          scrollbar-hide
        "
      >
        {themes.map((theme) => {
          const isActive = theme.is_active;

          return (
            <div
              key={theme.id}
              onClick={() => onSetActive(theme)}
              className={`
                relative shrink-0 snap-center cursor-pointer
                w-65 h-105 m-2
                rounded-3xl overflow-hidden
                transition-all duration-300
                ${isActive ? "outline-4 outline-emerald-500" : "opacity-80 hover:opacity-100"}
              `}
              style={{
                backgroundImage: `url(${getPublicImageUrl("products", theme.background_uri)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="font-semibold text-base">{theme.name}</div>

                {isActive && (
                  <div className="mt-1 inline-block text-xs bg-emerald-500 px-2 py-0.5 rounded-lg">
                    Đang dùng
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function BrandingsSection({
  brandings,
  onSetActive,
}: {
  brandings: Branding[];
  onSetActive: (branding: Branding) => void;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg border-b-2 font-bold text-[#1b4f94]">GIAO DIỆN ĐĂNG NHẬP / ĐĂNG KÝ</h2>

      <div
        className="
          flex gap-3 overflow-x-auto pb-4
          snap-x snap-mandatory
          scrollbar-hide
        "
      >
        {brandings.map((branding) => {
          const bg = getPublicImageUrl("products", branding.background_uri);
          const logo = getPublicImageUrl("products", branding.logo_uri);

          return (
            <div
              key={branding.id}
              onClick={() => onSetActive(branding)}
              className={`
                relative shrink-0 snap-center cursor-pointer
                w-65 h-105 m-2
                rounded-3xl overflow-hidden
                transition-all duration-300
                ${branding.is_active ? "outline-4 outline-emerald-500" : "opacity-100 hover:opacity-80"}
              `}
              style={{
                backgroundImage: bg ? `url(${bg})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {logo && (
                <Image
                  src={logo}
                  alt={branding.name}
                  width={112}
                  height={112}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-2"
                />
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="font-semibold text-sm">{branding.name}</div>

                {branding.is_active && (
                  <div className="mt-1 inline-block text-xs bg-emerald-500 px-2 py-0.5 rounded-lg">
                    Đang dùng
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function BannersSection({
  bannerThemeKeys,
  activeBannerThemeKey,
  bannersInActiveTheme,
  onSetActiveBannerThemeKey,
}: {
  bannerThemeKeys: string[];
  activeBannerThemeKey: string;
  bannersInActiveTheme: Banner[];
  onSetActiveBannerThemeKey: (themeKey: string) => void;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg border-b-2 font-bold text-[#1b4f94]">BANNER (THEO CHỦ ĐỀ)</h2>

      <div className="flex flex-wrap gap-2">
        {bannerThemeKeys.map((key) => {
          const isActive = key === activeBannerThemeKey;

          return (
            <button
              key={key}
              onClick={() => onSetActiveBannerThemeKey(key)}
              className={`
                px-4 py-2 border rounded-xl text-sm font-semibold
                transition-all duration-200
                ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          );
        })}
      </div>

      <div
        className="
          flex gap-3 overflow-x-auto pb-4
          snap-x snap-mandatory
          scrollbar-hide
        "
      >
        {bannersInActiveTheme.map((banner) => {
          const isActive = banner.is_active;
          const img = getPublicImageUrl("products", banner.image);

          return (
            <div
              key={banner.id}
              className={`
                relative shrink-0 snap-center
                w-80 h-40 m-2
                rounded-3xl overflow-hidden
                transition-all duration-300
                ${banner.is_active ? "outline-4 outline-emerald-500" : "opacity-80"}
              `}
              style={{
                backgroundImage: img ? `url(${img})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/15" />

              <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                {isActive && (
                  <div className="mt-1 inline-block text-xs bg-emerald-500 px-2 py-0.5 rounded-lg">
                    Đang dùng
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!activeBannerThemeKey && (
        <div className="text-sm text-gray-500">Chưa có active_theme_key trong app_banner_settings.</div>
      )}
    </section>
  );
}
