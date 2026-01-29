'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import { useInventoryRealtimeSync } from '../hooks/useInventoryRealtimeSync';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [collapsed, setCollapsed] = useState(false); // 👈 lifted state

  useInventoryRealtimeSync();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace('/login');
        return;
      }

      setChecking(false);
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Checking authentication…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Right content */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300
          ${collapsed ? 'ml-14' : 'ml-64'}
        `}
      >
        <Header />
        <main className="flex-1 px-8 pb-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
