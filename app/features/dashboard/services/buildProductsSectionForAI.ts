
import { AIProduct } from "@/app/api/dashboard-ai/types";
import { buildProductsAIContext } from "./buildProductsAIContext";

function summarizeProducts(products: AIProduct[]) {
    const activeProducts = products.filter(p => p.is_active);
    const inactiveProducts = products.filter(p => !p.is_active)

    return {
        total: products.length,
        active: activeProducts.length,
        inactive: inactiveProducts.length,
        active_products: activeProducts,
        inactive_products: inactiveProducts,
    }
}

function getTopSellingProducts(products: AIProduct[], limit = 10) {
    return products
        .filter((p) => p.is_best_seller)
        .slice(0, limit)
}

function groupProductsByCategory(products: AIProduct[]) {
    const map = new Map<string, {
        id: string;
        title: string;
        total: number;
        active: number;
        items: AIProduct[];
    }>();

    for (const p of products) {
        if (!p.category) continue;

        const key = p.category.id;

        if (!map.has(key)) {
            map.set(key, {
                id: p.category.id,
                title: p.category.title,
                total: 0,
                active: 0,
                items: [],
            });
        }

        const group = map.get(key)!;
        group.total += 1;
        if (p.is_active) group.active += 1;
        group.items.push(p);
    }

    return Array.from(map.values());
}


export async function buildProductsSectionForAI() {
    const products = await buildProductsAIContext();

    const summary = summarizeProducts(products);

    return {
        total: summary.total,
        active: summary.active,
        inactive: summary.inactive,
        inactive_products: summary.inactive_products,

        top_selling: getTopSellingProducts(products, 10),

        by_category: groupProductsByCategory(products),
    };
}