'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const getAuthErrorMessage = (error: any) => {
        if (!error) return null;

        const message = error.message?.toLowerCase() || '';

        if (message.includes('invalid login credentials')) {
            return 'Email hoặc mật khẩu không đúng';
        }

        if (message.includes('email not confirmed')) {
            return 'Email chưa được xác thực';
        }

        return 'Đăng nhập thất bại. Vui lòng thử lại';
    };


    const handleLogin = async () => {
        setError(null);
        setLoading(true);

        // 1. Login
        const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (authError || !authData.user) {
            setLoading(false);
            setError(getAuthErrorMessage(authError));
            return;
        }

        // 2. Check role từ bảng users
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single();

        if (profileError || profile?.role !== 'admin') {
            // ❌ Không phải admin → logout ngay
            await supabase.auth.signOut();
            setLoading(false);
            setError('Tài khoản này không có quyền truy cập Admin');
            return;
        }

        // 3. OK → vào dashboard
        setLoading(false);
        router.replace('/dashboard');
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-[#1c4273] px-4">
            <div className="w-full max-w-sm text-white">
                {/* Logo */}
                <div className="flex flex-col items-center mb-4">
                    <Image
                        src="/images/logo.png"
                        alt="Tutimi Coffee & Tea"
                        width={220}
                        height={220}
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="mb-2 block text-sm text-white">
                        Tên Đăng Nhập
                    </label>
                    <input
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white bg-transparent px-4 py-3 text-white outline-none focus:border-3 focus:border-[#1b4f94]"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm text-white">
                        Mật khẩu
                    </label>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-white bg-transparent px-4 py-3 pr-12 text-white outline-none focus:border-3 focus:border-[#1b4f94]"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
                        >
                            {showPassword ? (
                                /* 🔓 Unlock */
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 11V7a3 3 0 00-6 0"
                                    />
                                    <rect
                                        x="5"
                                        y="11"
                                        width="14"
                                        height="10"
                                        rx="2"
                                        ry="2"
                                    />
                                </svg>
                            ) : (
                                /* 🔒 Lock */
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <rect
                                        x="5"
                                        y="11"
                                        width="14"
                                        height="10"
                                        rx="2"
                                        ry="2"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 11V7a4 4 0 018 0v4"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="mb-4 text-sm text-red-500 text-center">
                        {error}
                    </p>
                )}

                {/* Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading || !email || !password}
                    className="mt-2 w-full rounded-xl bg-white py-3 flex items-center justify-center font-semibold text-[#1c4273] transition disabled:opacity-60"
                >
                    {loading ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#1c4273] border-t-transparent" />
                    ) : (
                        'Đăng nhập'
                    )}
                </button>
            </div>
        </div>
    );

}
