"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/lib/supabase";
import { dashboardQueryKeys } from "../api/dashboardQueryKeys";

export function useDashboardRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const invalidateDashboard = () => {
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all });
    };

    const ordersChannel = supabase
      .channel("dashboard-realtime-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        invalidateDashboard
      )
      .subscribe();

    const inventoryChannel = supabase
      .channel("dashboard-realtime-inventory")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory_transactions" },
        invalidateDashboard
      )
      .subscribe();

    const newsChannel = supabase
      .channel("dashboard-realtime-news")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "news" },
        invalidateDashboard
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(newsChannel);
    };
  }, [queryClient]);
}
