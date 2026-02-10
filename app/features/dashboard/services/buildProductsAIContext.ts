import { supabase } from "@/app/lib/supabase";
import { getPublicImageUrl } from "@/app/lib/storage";
import { AIProduct } from "@/app/api/dashboard-ai/types";

export async function buildProductsAIContext(): Promise<AIProduct[]> {
    const { data, error } = await supabase
        .from("products")
        .select(`
      id,
      name,
      price,
      sale_price,
      image,
      stock_quantity,
      is_active,
      is_best_seller,
      stats,
      category:categories (
        id,
        title
      )
    `);

    if (error) throw error;

    return (data ?? []).map((p) => {
        const category = p.category;

        const processedCategory = (category && typeof category === 'object' && 'id' in category && 'title' in category)
            ? { id: category.id as string, title: category.title as string }
            : null;
        return {
            id: p.id,
            name: p.name,
            price: p.price,
            sale_price: p.sale_price,
            image: getPublicImageUrl("products", p.image),
            stock_quantity: p.stock_quantity,
            is_active: p.is_active ?? true,
            is_best_seller: p.is_best_seller,
            stats: p.stats,
            category: processedCategory,
        }
    })
}


