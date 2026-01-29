import { supabase } from '@/app/lib/supabase';

export type InventoryDirection = 'INCREASE' | 'DECREASE';

export async function createInventoryIn(payload: {
  productId: string;
  quantity: number;
  note?: string | null;
}) {
  const { data, error } = await supabase.rpc('create_inventory_in', {
    p_product_id: payload.productId,
    p_quantity: payload.quantity,
    p_note: payload.note ?? null,
  });

  if (error) throw error;
  return data; // returns uuid
}

export async function createInventoryOut(payload: {
  productId: string;
  quantity: number;
  note?: string | null;
}) {
  const { data, error } = await supabase.rpc('create_inventory_out', {
    p_product_id: payload.productId,
    p_quantity: payload.quantity,
    p_note: payload.note ?? null,
  });

  if (error) throw error;
  return data;
}

export async function createInventoryAdjust(payload: {
  productId: string;
  direction: InventoryDirection;
  quantity: number;
  note?: string | null;
}) {
  const { data, error } = await supabase.rpc('create_inventory_adjust', {
    p_product_id: payload.productId,
    p_direction: payload.direction,
    p_quantity: payload.quantity,
    p_note: payload.note ?? null,
  });

  if (error) throw error;
  return data;
}

export type InventoryTransaction = {
  id: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  requested_quantity: number;
  applied_quantity: number;
  delta: number;
  note: string | null;
  created_at: string;
};

export async function fetchInventoryTransactions(productId: string) {
  const { data, error } = await supabase
    .from('inventory_transactions')
    .select('id, type, requested_quantity, applied_quantity, delta, note, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as InventoryTransaction[];
}
