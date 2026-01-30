import { supabase } from '@/app/lib/supabase';

export type InventoryDirection = 'INCREASE' | 'DECREASE';

// Nhập hàng
export async function createInventoryIn(payload: {
  productId: string;
  quantity: number;
  note?: string | null;
  inputValue?: number | null;
  inputUnit?: string | null;
  quantityUnit?: string | null;
}) {
  // rpc = gọi Postgres Function (stored proceduce)
  const { data, error } = await supabase.rpc('create_inventory_in', {
    p_product_id: payload.productId,
    p_quantity: payload.quantity,
    p_note: payload.note ?? null,
    p_input_value: payload.inputValue ?? null,
    p_input_unit: payload.inputUnit ?? null,
    p_quantity_unit: payload.quantityUnit ?? null,
  });

  if (error) throw error;
  return data; // returns uuid
}

// Xuất hàng
export async function createInventoryOut(payload: {
  productId: string;
  quantity: number;
  note?: string | null;
  inputValue?: number | null;
  inputUnit?: string | null;
  quantityUnit?: string | null;
}) {
  const { data, error } = await supabase.rpc('create_inventory_out', {
    p_product_id: payload.productId,
    p_quantity: payload.quantity,
    p_note: payload.note ?? null,
    p_input_value: payload.inputValue ?? null,
    p_input_unit: payload.inputUnit ?? null,
    p_quantity_unit: payload.quantityUnit ?? null,
  });

  if (error) throw error;
  return data;
}

// Điều chỉnh tồn kho
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
  input_value: number | null;
  input_unit: string | null;
  quantity_unit: string | null;
  created_at: string;
};

export async function fetchInventoryTransactions(productId: string) {
  const { data, error } = await supabase
    .from('inventory_transactions')
    .select('id, type, requested_quantity, applied_quantity, delta, note, input_value, input_unit, quantity_unit, created_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as InventoryTransaction[];
}
