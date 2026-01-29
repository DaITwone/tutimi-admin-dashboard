import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/app/lib/supabase';

export type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  stats: string | null;
  is_best_seller: boolean;
  image: string | null;
  is_active: boolean | null;
  stock_quantity: number;
  category_id: string | null;
};

export function useProductsQuery(params: {
  categoryId: string;
  search: string;
  manageMode: boolean;
  statusFilter: 'all' | 'on' | 'off';
}) {
  const { categoryId, search, manageMode, statusFilter } = params;

  return useQuery({
    queryKey: ['products', { categoryId, search, manageMode, statusFilter }],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('id,name,price,image,sale_price,stats,is_best_seller,is_active,stock_quantity,category_id')
        .order('created_at', { ascending: false });

      if (categoryId !== 'all') query = query.eq('category_id', categoryId);

      if (manageMode) {
        if (statusFilter === 'on') query = query.eq('is_active', true);
        if (statusFilter === 'off') query = query.eq('is_active', false);
      }

      if (search.trim()) query = query.ilike('name', `%${search.trim()}%`);

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []) as Product[];
    },
    staleTime: 1000 * 20,
  });
}
