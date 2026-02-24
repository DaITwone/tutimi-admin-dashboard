import { supabase } from '@/app/lib/supabase';
import type { CreateProductInput } from './createProduct.types';

export async function createProductApi(input: CreateProductInput) {
  return supabase
    .from('products')
    .insert({
      name: input.name,
      price: input.price,
      sale_price: input.salePrice,
      stats: input.stats,
      is_best_seller: input.isBestSeller,
      image: null,
    })
    .select()
    .single();
}

export async function updateProductImageApi(productId: string, imagePath: string) {
  return supabase.from('products').update({ image: imagePath }).eq('id', productId);
}

