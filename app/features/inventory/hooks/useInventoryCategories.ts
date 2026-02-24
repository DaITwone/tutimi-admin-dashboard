"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import type { Category } from "@/app/features/inventory/types";

export function useInventoryCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, title")
        .order("sort_order", { ascending: true });

      if (data) setCategories(data);
    };

    fetchCategories();
  }, []);

  return { categories };
}
