'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { useInventoryRealtimeSync } from '../features/inventory/hooks/useInventoryRealtimeSync';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useInventoryRealtimeSync();

  // getSession() only checks once; listen for auth-state changes too.
  useEffect(() => {
    let active = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/login');
      }

      if (active) setChecking(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <span className="text-muted-foreground">Checking authentication...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`
          ml-0 flex min-h-screen flex-col transition-all duration-300
          ${collapsed ? 'lg:ml-14' : 'lg:ml-64'}
        `}
      >
        <Header />

        <main className="flex-1 overflow-auto px-4 pb-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
