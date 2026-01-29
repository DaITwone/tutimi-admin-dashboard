'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/app/lib/supabase';

export function useInventoryRealtimeSync() {
  const qc = useQueryClient();

  useEffect(() => {
    // ✅ Subscribe thay đổi bảng products
    const productsChannel = supabase
      .channel('rt-products-inventory')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          // invalidate tất cả biến thể query products
          qc.invalidateQueries({ queryKey: ['products'] });
        }
      )
      .subscribe();

    // ✅ Subscribe thay đổi bảng inventory_transactions
    const txChannel = supabase
      .channel('rt-inventory-transactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory_transactions' },
        (payload) => {
          // invalidate danh sách products vì stock cũng thay đổi theo
          qc.invalidateQueries({ queryKey: ['products'] });

          // payload.new chứa record mới
          const productId = (payload.new as any)?.product_id;
          if (productId) {
            qc.invalidateQueries({
              queryKey: ['inventoryTransactions', productId],
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(txChannel);
    };
  }, [qc]);
}
