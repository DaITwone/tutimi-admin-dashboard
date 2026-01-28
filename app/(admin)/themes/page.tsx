'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl } from '@/app/lib/storage';
import { useRouter } from 'next/navigation';

/* ===================== TYPES ===================== */
type Theme = {
    id: string;
    name: string;
    background_uri: string;
    is_active: boolean;
    created_at: string;
};

type Branding = {
    id: string;
    name: string;
    background_uri: string | null;
    logo_uri: string | null;
    is_active: boolean;
    display_order: number | null;
};

type Banner = {
    id: string;
    image: string;
    is_active: boolean;
    order: number | null;
    created_at: string;
    theme_key: string;
};

type BannerSettings = {
    id: number;
    active_theme_key: string;
};

/* ===================== PAGE ===================== */
export default function AdminThemesPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [brandings, setBrandings] = useState<Branding[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [bannerSettings, setBannerSettings] = useState<BannerSettings | null>(null);

    const [loading, setLoading] = useState(true);

    const router = useRouter();

    /* ===================== COMPUTED ===================== */
    const activeBannerThemeKey = bannerSettings?.active_theme_key || '';

    const bannerThemeKeys = useMemo(() => {
        // lấy danh sách theme_key hiện có trong banners (spring, standard,...)
        const keys = Array.from(new Set(banners.map((b) => b.theme_key)));
        return keys.sort((a, b) => a.localeCompare(b));
    }, [banners]);

    const bannersInActiveTheme = useMemo(() => {
        if (!activeBannerThemeKey) return [];
        return banners
            .filter((b) => b.theme_key === activeBannerThemeKey)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [banners, activeBannerThemeKey]);

    /* ===================== FETCH ===================== */
    const fetchAll = async () => {
        setLoading(true);

        const [themesRes, brandingsRes, bannersRes, settingsRes] =
            await Promise.all([
                supabase.from('app_themes').select('*').order('created_at', { ascending: true }),
                supabase
                    .from('app_brandings')
                    .select('*')
                    .order('display_order'),
                supabase.from('banners').select('*').order('created_at', ({ ascending: true })),
                supabase.from('app_banner_settings').select('*').single(),
            ]);

        if (!themesRes.error) setThemes(themesRes.data || []);
        if (!brandingsRes.error) setBrandings(brandingsRes.data || []);
        if (!bannersRes.error) setBanners(bannersRes.data || []);
        if (!settingsRes.error) setBannerSettings(settingsRes.data);

        setLoading(false);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    /* ===================== ACTIONS: APP THEMES ===================== */
    const setActiveAppTheme = async (theme: Theme) => {
        // update DB
        await supabase
            .from('app_themes')
            .update({ is_active: false })
            .neq('id', theme.id);

        await supabase
            .from('app_themes')
            .update({ is_active: true })
            .eq('id', theme.id);


        // update UI
        setThemes((prev) =>
            prev.map((t) => ({
                ...t,
                is_active: t.id === theme.id,
            }))
        );
    };

    /* ===================== ACTIONS: BRANDINGS ===================== */
    const setActiveBranding = async (branding: Branding) => {
        await supabase
            .from('app_brandings')
            .update({ is_active: false })
            .neq('id', branding.id);

        await supabase
            .from('app_brandings')
            .update({ is_active: true })
            .eq('id', branding.id);

        setBrandings((prev) =>
            prev.map((b) => ({
                ...b,
                is_active: b.id === branding.id,
            }))
        );
    };

    /* ===================== ACTIONS: BANNER SETTINGS ===================== */
    const setActiveBannerThemeKey = async (themeKey: string) => {
        // 1) update settings
        await supabase
            .from('app_banner_settings')
            .update({ active_theme_key: themeKey })
            .eq('id', 1);

        // 2) bật tất cả banner cùng theme_key
        await supabase.from('banners').update({ is_active: true }).eq('theme_key', themeKey);

        // 3) tắt tất cả banner khác theme_key
        await supabase.from('banners').update({ is_active: false }).neq('theme_key', themeKey);

        // 4) update UI
        setBannerSettings((prev) =>
            prev ? { ...prev, active_theme_key: themeKey } : prev
        );

        setBanners((prev) =>
            prev.map((b) => ({
                ...b,
                is_active: b.theme_key === themeKey,
            }))
        );
    };

    if (loading) return <div className="p-6">Loading settings...</div>;

    /* ===================== RENDER ===================== */
    return (
        <div className="p-6 space-y-10">
            {/* ===== THEMES LIST ===== */}
            <section className="space-y-4">
                <div className="flex items-center justify-between gap-3 border-b-2 pb-2">
                    <h2 className="text-lg font-bold text-[#1b4f94]">
                        GIAO DIỆN CHÍNH
                    </h2>

                    <button
                        onClick={() => router.push('/themes/create')}
                        className="rounded-lg bg-[#1b4f94] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c4273]"
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
                                onClick={() => setActiveAppTheme(theme)}
                                className={`
                                    relative shrink-0 snap-center cursor-pointer
                                    w-65 h-105 m-2
                                    rounded-3xl overflow-hidden
                                    transition-all duration-300
                                    ${isActive
                                        ? 'outline-4 outline-emerald-500'
                                        : 'opacity-80 hover:opacity-100'
                                    }
                                `}
                                style={{
                                    backgroundImage: `url(${getPublicImageUrl(
                                        'products',
                                        theme.background_uri
                                    )})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <div className="font-semibold text-base">
                                        {theme.name}
                                    </div>

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

            {/* ===== BRANDINGS ===== */}
            <section className="space-y-4">
                <h2 className="text-lg border-b-2 font-bold text-[#1b4f94]">
                    GIAO DIỆN ĐĂNG NHẬP / ĐĂNG KÝ
                </h2>

                <div
                    className="
                        flex gap-3 overflow-x-auto pb-4
                        snap-x snap-mandatory
                        scrollbar-hide
                    "
                >
                    {brandings.map((branding) => {
                        const bg = getPublicImageUrl('products', branding.background_uri);
                        const logo = getPublicImageUrl('products', branding.logo_uri);

                        return (
                            <div
                                key={branding.id}
                                onClick={() => setActiveBranding(branding)}
                                className={`
                                    relative shrink-0 snap-center cursor-pointer
                                    w-65 h-105 m-2
                                    rounded-3xl overflow-hidden
                                    transition-all duration-300
                                    ${branding.is_active
                                        ? 'outline-4 outline-emerald-500'
                                        : 'opacity-100 hover:opacity-80'
                                    }
                                `}
                                style={{
                                    backgroundImage: bg ? `url(${bg})` : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {logo && (
                                    <img
                                        src={logo}
                                        alt={branding.name}
                                        className="absolute top-1/2 left-1/2
                                            -translate-x-1/2 -translate-y-1/2
                                            h-28 w-auto
                                            rounded-xl p-2"
                                    />
                                )}

                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <div className="font-semibold text-sm">
                                        {branding.name}
                                    </div>

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

            {/* ===== BANNERS ===== */}
            <section className="space-y-4">
                <h2 className="text-lg border-b-2 font-bold text-[#1b4f94]">
                    BANNER (THEO CHỦ ĐỀ)
                </h2>

                {/* theme_key picker */}
                <div className="flex flex-wrap gap-2">
                    {bannerThemeKeys.map((key) => {
                        const isActive = key === activeBannerThemeKey;

                        return (
                            <button
                                key={key}
                                onClick={() => setActiveBannerThemeKey(key)}
                                className={`
                                    px-4 py-2 border rounded-xl text-sm font-semibold
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                                `}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </button>
                        );
                    })}
                </div>

                {/* banners list */}
                <div
                    className="
                        flex gap-3 overflow-x-auto pb-4
                        snap-x snap-mandatory
                        scrollbar-hide
                    "
                >
                    {bannersInActiveTheme.map((banner) => {
                        const isActive = banner.is_active;
                        const img = getPublicImageUrl('products', banner.image);

                        return (
                            <div
                                key={banner.id}
                                className={`
                                    relative shrink-0 snap-center
                                    w-80 h-40 m-2
                                    rounded-3xl overflow-hidden
                                    transition-all duration-300
                                    ${banner.is_active ? 'outline-4 outline-emerald-500' : 'opacity-80'}
                                `}
                                style={{
                                    backgroundImage: img ? `url(${img})` : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
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
                    <div className="text-sm text-gray-500">
                        Chưa có active_theme_key trong app_banner_settings.
                    </div>
                )}
            </section>
        </div>
    );
}
