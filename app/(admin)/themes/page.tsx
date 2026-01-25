'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { getPublicImageUrl } from '@/app/lib/storage';

/* ===================== TYPES ===================== */
type Theme = {
    id: string;
    name: string;
    background_uri: string;
    is_active: boolean;
    display_order: string | null;
};

type Branding = {
    id: string;
    name: string;
    background_uri: string | null;
    logo_uri: string | null;
    is_active: boolean;
    display_order: number | null;
};

/* ===================== PAGE ===================== */
export default function AdminThemesPage() {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [brandings, setBrandings] = useState<Branding[]>([]);
    const [activeThemeKey, setActiveThemeKey] = useState<string>('');
    const [loading, setLoading] = useState(true);

    /* ===================== FETCH DATA ===================== */
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);

            const [themesRes, brandingsRes, bannerRes] = await Promise.all([
                supabase.from('app_themes').select('*').order('display_order'),
                supabase.from('app_brandings').select('*').order('display_order'),
                supabase.from('app_banner_settings').select('*').single(),
            ]);

            if (!themesRes.error) setThemes(themesRes.data || []);
            if (!brandingsRes.error) setBrandings(brandingsRes.data || []);
            if (!bannerRes.error) setActiveThemeKey(bannerRes.data.active_theme_key);

            setLoading(false);
        };

        fetchAll();
    }, []);

    /* ===================== ACTIONS ===================== */
    const setActiveTheme = async (theme: Theme) => {
        // 1. Update banner setting (source of truth)
        await supabase
            .from('app_banner_settings')
            .update({ active_theme_key: theme.name.toLowerCase() })
            .eq('id', 1);

        // 2. Update UI state
        setActiveThemeKey(theme.name.toLowerCase());

        // 3. Optional: update is_active flag for visual
        await supabase.from('app_themes').update({ is_active: false }).neq('id', '');
        await supabase
            .from('app_themes')
            .update({ is_active: true })
            .eq('id', theme.id);

        setThemes((prev) =>
            prev.map((t) => ({
                ...t,
                is_active: t.id === theme.id,
            }))
        );
    };

    const setActiveBranding = async (branding: Branding) => {
        await supabase
            .from('app_brandings')
            .update({ is_active: false })
            .neq('id', '');

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

    if (loading) return <div className="p-6">Loading themes...</div>;

    /* ===================== RENDER ===================== */
    return (
        <div className="p-6 space-y-8">
            {/* ===== THEMES LIST ===== */}
            <section className="space-y-4">
                <h2 className="text-lg border-b-2 font-bold text-[#1b4f94]">
                    GIAO DIỆN CHÍNH
                </h2>

                <div
                    className="
                        flex gap-2 overflow-x-auto pb-4
                        snap-x snap-mandatory
                        scrollbar-hide
                    "
                >

                    {themes.map((theme) => {
                        const isActive =
                            theme.name.toLowerCase() === activeThemeKey;

                        return (
                            <div
                                key={theme.id}
                                onClick={() => setActiveTheme(theme)}
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
                                {/* gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                                {/* label */}
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
                        const bg = getPublicImageUrl(
                            'products',
                            branding.background_uri
                        );
                        const logo = getPublicImageUrl(
                            'products',
                            branding.logo_uri
                        );

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
                                    backgroundImage: bg
                                        ? `url(${bg})`
                                        : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {/* overlay */}
                                {/* <div className="absolute inset-0 bg-black/30" /> */}

                                {/* logo */}
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


                                {/* label */}
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
        </div>
    );
}
