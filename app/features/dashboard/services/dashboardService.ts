import { supabase } from "@/app/lib/supabase";
import type { DashboardInventorySummary, DashboardKpis, DashboardLatestNewsItem, DashboardRecentInventoryTransaction, DashboardRecentOrder, DashboardTopSellingProduct, InventoryInOutChartPoint, OrdersCountChartPoint, RevenueChartPoint } from "../types/dashboard";

export type DashboardBucket = "day" | "week" | "month" | "year";

export type DashboardRange = {
    from: string;
    to: string;
    bucket: DashboardBucket;
};

function getISODateDaysAgo(days: number) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
}

function safeNumber(n: unknown, fallback = 0) {
    return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

export const dashboardService = {
    async getKpis(range: DashboardRange): Promise<DashboardKpis> {
        // 1) Total orders in selected range
        const { count: totalOrders, error: totalOrdersError } = await supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .gte("created_at", range.from)
            .lt("created_at", range.to);

        if (totalOrdersError) throw totalOrdersError;

        // 2) Revenue in selected range = sum total_price where status = completed
        const { data: completedOrders, error: revenueError } = await supabase
            .from("orders")
            .select("total_price")
            .eq("status", "completed")
            .gte("created_at", range.from)
            .lt("created_at", range.to);

        if (revenueError) throw revenueError;

        const revenue = (completedOrders ?? []).reduce(
            (sum, row) => sum + safeNumber(row.total_price),
            0
        );

        // 3) Confirmed orders (current) - not affected by range
        const { count: confirmedOrders, error: confirmedError } = await supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("status", "confirmed");

        if (confirmedError) throw confirmedError;

        // 4) Low stock products (current) - not affected by range
        const { count: lowStockProducts, error: lowStockError } = await supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .lte("stock_quantity", 5);

        if (lowStockError) throw lowStockError;

        return {
            totalOrders: totalOrders ?? 0,
            revenue,
            confirmedOrders: confirmedOrders ?? 0,
            lowStockProducts: lowStockProducts ?? 0,
        };
    },

    async getRecentOrders(limit = 10): Promise<DashboardRecentOrder[]> {
        const { data, error } = await supabase
            .from("orders")
            .select("id, created_at, total_price, status")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;

        return (data ?? []) as DashboardRecentOrder[];
    },

    async getTopSellingProductsLastDays(limit = 5): Promise<DashboardTopSellingProduct[]> {
        const from7d = getISODateDaysAgo(7);

        // 1. get completed orders
        const { data: completedOrders, error: ordersError } = await supabase
            .from("orders")
            .select("id")
            .eq("status", "completed")
            .gte("created_at", from7d);

        if (ordersError) throw ordersError;

        const orderIds = (completedOrders ?? []).map(order => order.id);

        if (orderIds.length === 0) return [];

        // 2. get order items for those orders
        const { data: items, error: itemsError } = await supabase
            .from("order_items")
            .select("product_id, product_name, product_image, quantity, total_price")
            .in("order_id", orderIds); // Chỉ lấy item của những order completed 7 ngày gần đây.

        if (itemsError) throw itemsError;

        // 3. aggregate client-side
        // Map<Key, Value>
        const productMap = new Map<string, DashboardTopSellingProduct>();

        for (const it of items ?? []) {
            const productId = it.product_id;

            // .has(key) kiểm tra key có tồn tại trong Map hay không
            if (!productMap.has(productId)) {
                // .set(key, value) thêm hoặc update một entry trong Map
                productMap.set(productId, {
                    product_id: productId,
                    product_name: it.product_name ?? "Unknown",
                    product_image: it.product_image ?? null,
                    sold_quantity: 0,
                    revenue: 0,
                })
            }

            const row = productMap.get(productId)!;

            row.sold_quantity += safeNumber(it.quantity);
            row.revenue += safeNumber(it.total_price);
        }

        return [...productMap.values()]
            // sort descending by sold_quantity
            .sort((a, b) => b.sold_quantity - a.sold_quantity)
            .slice(0, limit);
    },

    async getInventorySummary(range: DashboardRange): Promise<DashboardInventorySummary> {
        const { data, error } = await supabase
            .from("inventory_transactions")
            .select("type, applied_quantity")
            .gte("created_at", range.from)
            .lt("created_at", range.to);

        if (error) throw error;

        let totalIn = 0;
        let totalOut = 0;

        for (const row of data ?? []) {
            if (row.type === "IN") totalIn += safeNumber(row.applied_quantity);
            if (row.type === "OUT") totalOut += safeNumber(row.applied_quantity);
        }

        return { totalIn, totalOut };
    },

    async getrecentInventoryTransactions(limit = 8): Promise<DashboardRecentInventoryTransaction[]> {
        const { data, error } = await supabase
            .from("inventory_transactions")
            .select(
                `
                id,
                created_at,
                product_id,
                type,
                applied_quantity,
                delta,
                note,
                products:product_id ( name )
            `
            )
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;

        return (data ?? []).map((row: any) => ({
            id: row.id,
            created_at: row.created_at,
            product_id: row.product_id,
            product_name: row.products?.name ?? null,
            type: row.type,
            applied_quantity: safeNumber(row.applied_quantity),
            delta: safeNumber(row.delta),
            note: row.note ?? null,
        }));
    },

    async getLatestNews(limit = 5): Promise<DashboardLatestNewsItem[]> {
        const { data, error } = await supabase
            .from("news")
            .select("id, title, description, image, created_at, type, is_active")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;

        return (data ?? []) as DashboardLatestNewsItem[];
    },

    async getRevenueChart(range: DashboardRange) {
        const { data, error } = await supabase.rpc("get_revenue_vn", {
            p_from: range.from,
            p_to: range.to,
            p_bucket: range.bucket,
        });

        if (error) throw error;
        return (data ?? []) as RevenueChartPoint[];
    },

    async getOrdersCountChart(range: DashboardRange) {
        const { data, error } = await supabase.rpc("get_orders_count_vn", {
            p_from: range.from,
            p_to: range.to,
            p_bucket: range.bucket,
        });

        if (error) throw error;
        return (data ?? []) as OrdersCountChartPoint[];
    },

    async getInventoryInOutChart(range: DashboardRange) {
        const { data, error } = await supabase.rpc("get_inventory_in_out_vn", {
            p_from: range.from,
            p_to: range.to,
            p_bucket: range.bucket,
        });

        if (error) throw error;
        return (data ?? []) as InventoryInOutChartPoint[];
    },
};
