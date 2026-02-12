import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/app/lib/supabase';
import { queryKeys } from '@/app/lib/queryKeys';

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
  measure_unit: string | null;
};

export type StatusFilter = 'all' | 'on' | 'off';

export type UseProductsQueryParams = {
  categoryId: string;
  search: string;
  manageMode?: boolean;
  statusFilter?: StatusFilter;
};

export function useProductsQuery(params: UseProductsQueryParams) {
  const {
    categoryId,
    search,
    manageMode = false,
    statusFilter = 'all',
  } = params;

  return useQuery({
    queryKey: queryKeys.products({
      categoryId,
      search,
      manageMode,
      statusFilter,
    }),

    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(
          'id,name,price,image,sale_price,stats,is_best_seller,is_active,stock_quantity,category_id, measure_unit'
        )
        .order('created_at', { ascending: false });

      if (categoryId !== 'all') query = query.eq('category_id', categoryId);

      if (manageMode) {
        if (statusFilter === 'on') query = query.eq('is_active', true);
        if (statusFilter === 'off') query = query.eq('is_active', false);
      }

      /* 
        - Lọc sản phẩm theo tên khi search từ khóa.
        - ilike case-insensitive LIKE trong postgreSQL không phân biệt chữ hoa/thường.
        - % widlcard ký tự đại diện
      */
      if (search.trim()) query = query.ilike('name', `%${search.trim()}%`);

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []) as Product[];
    },

    staleTime: 1000 * 20,
  });
}
