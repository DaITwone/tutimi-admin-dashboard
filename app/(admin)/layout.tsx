'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { useInventoryRealtimeSync } from '../features/inventory/hooks/useInventoryRealtimeSync';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';

export default function AdminLayout({ children, }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useInventoryRealtimeSync();

  // Vì getSession() chỉ check 1 lần, không từ update khi session thay đổi.
  useEffect(() => {
    let active = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/login');
      }

      if (active) setChecking(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    }
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F8FB]">
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
        className={`
          flex min-h-screen flex-col transition-all duration-300
          ${collapsed ? 'lg:ml-14' : 'lg:ml-64'}
          ml-0
        `}
      >
        <Header />

        <main className="flex-1 overflow-auto px-4 pb-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
