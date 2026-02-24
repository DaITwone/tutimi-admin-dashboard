import { supabase } from '@/app/lib/supabase';
import type { Category, Product, StatusFilter } from './types';

type FetchProductsParams = {
  categoryId: string;
  manageMode: boolean;
  statusFilter: StatusFilter;
  search: string;
};

export async function fetchCategoriesApi() {
  const { data } = await supabase
    .from('categories')
    .select('id, title')
    .order('sort_order', { ascending: true });

  return (data ?? []) as Category[];
}

export async function fetchProductsApi({
  categoryId,
  manageMode,
  statusFilter,
  search,
}: FetchProductsParams) {
  let query = supabase
    .from('products')
    .select('id, name, price, image, sale_price, stats, is_best_seller, is_active')
    .order('created_at', { ascending: false });

  if (categoryId !== 'all') query = query.eq('category_id', categoryId);

  if (manageMode) {
    if (statusFilter === 'on') query = query.eq('is_active', true);
    if (statusFilter === 'off') query = query.eq('is_active', false);
  }

  if (search.trim()) query = query.ilike('name', `%${search.trim()}%`);

  const { data, error } = await query;

  return {
    data: (data ?? []) as Product[],
    error,
  };
}

export async function deleteProductApi(id: string) {
  return supabase.from('products').delete().eq('id', id);
}

export async function bulkUpdateProductActiveApi(ids: string[], nextActive: boolean) {
  return supabase.from('products').update({ is_active: nextActive }).in('id', ids);
}
