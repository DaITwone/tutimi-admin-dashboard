// lib/dashboardService.ts
import { supabase } from "./supabase";

export type TimeRange = "today" | "week" | "month";

export type DashboardMetrics = {
  totalOrders: number;
  revenue: number;
  cancelRate: number; // %
  topProducts: {
    product_id: string;
    product_name: string;
    sold: number;
    revenue: number;
  }[];
};

const getRange = (range: TimeRange) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (range === "today") {
    start.setHours(0, 0, 0, 0);
    end.setHours(24, 0, 0, 0);
  }

  if (range === "week") {
    // Monday start
    const day = now.getDay(); // 0..6
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    start.setDate(now.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);

    end.setTime(start.getTime());
    end.setDate(start.getDate() + 7);
  }

  if (range === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setTime(start.getTime());
    end.setMonth(start.getMonth() + 1);
  }

  return { startISO: start.toISOString(), endISO: end.toISOString() };
};

export async function fetchDashboardMetrics(
  range: TimeRange
): Promise<DashboardMetrics> {
  const { startISO, endISO } = getRange(range);

  // total orders
  const totalOrdersReq = supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startISO)
    .lt("created_at", endISO);

  // cancelled orders
  const cancelledOrdersReq = supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "cancelled")
    .gte("created_at", startISO)
    .lt("created_at", endISO);

  // revenue only completed
  const completedOrdersReq = supabase
    .from("orders")
    .select("id,total_price")
    .eq("status", "completed")
    .gte("created_at", startISO)
    .lt("created_at", endISO);

  // order items in range (note: may include cancelled orders -> we'll filter by completed order ids)
  const orderItemsReq = supabase
    .from("order_items")
    .select("order_id,product_id,product_name,quantity,total_price")
    .gte("created_at", startISO)
    .lt("created_at", endISO);

  const [
    { count: totalOrders, error: e1 },
    { count: cancelledOrders, error: e2 },
    { data: completedOrders, error: e3 },
    { data: orderItems, error: e4 },
  ] = await Promise.all([
    totalOrdersReq,
    cancelledOrdersReq,
    completedOrdersReq,
    orderItemsReq,
  ]);

  if (e1 || e2 || e3 || e4) {
    console.log({ e1, e2, e3, e4 });
    throw new Error("Fetch dashboard metrics failed");
  }

  const completedOrderIds = new Set((completedOrders ?? []).map((o) => o.id));

  const revenue = (completedOrders ?? []).reduce(
    (sum, o) => sum + (o.total_price ?? 0),
    0
  );

  const cancelRate =
    totalOrders && totalOrders > 0
      ? Math.round(((cancelledOrders ?? 0) / totalOrders) * 100)
      : 0;

  // Top products computed only from COMPLETED orders
  const topMap = new Map<
    string,
    { product_id: string; product_name: string; sold: number; revenue: number }
  >();

  (orderItems ?? []).forEach((it) => {
    if (!completedOrderIds.has(it.order_id)) return;

    const key = it.product_id;
    const prev = topMap.get(key);

    topMap.set(key, {
      product_id: it.product_id,
      product_name: it.product_name,
      sold: (prev?.sold ?? 0) + (it.quantity ?? 0),
      revenue: (prev?.revenue ?? 0) + (it.total_price ?? 0),
    });
  });

  const topProducts = Array.from(topMap.values())
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return {
    totalOrders: totalOrders ?? 0,
    revenue,
    cancelRate,
    topProducts,
  };
}
