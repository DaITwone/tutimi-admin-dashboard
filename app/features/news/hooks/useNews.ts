'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import type { News } from '../types';

type UseNewsReturn = {
  news: News[];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (value: string) => void;

  deleteId: string | null;
  deleting: boolean;
  openDelete: (id: string) => void;
  closeDelete: () => void;
  confirmDelete: () => Promise<void>;

  editingId: string | null;
  openEdit: (id: string) => void;
  closeEdit: () => void;

  fetchNews: () => Promise<void>;
};

export function useNews(): UseNewsReturn {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("news")
      .select(
        "id, title, description, type, image, is_active, hashtag, created_at",
      )
      .order("created_at", { ascending: false });

    if (search.trim()) {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      setError("Không thể tải danh sách tin tức");
      setNews([]);
    } else {
      setNews(data || []);
    }

    setLoading(false);
  }, [search]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchNews();
    }, 400);

    return () => clearTimeout(delay);
  }, [fetchNews]);

  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);

    const { error } = await supabase.from('news').delete().eq('id', deleteId);

    setDeleting(false);

    if (error) {
      alert('Xoa that bai');
      return;
    }

    setDeleteId(null);
    fetchNews();
  };

  return {
    news,
    loading,
    error,
    search,
    setSearch,

    deleteId,
    deleting,
    openDelete: (id) => setDeleteId(id),
    closeDelete: () => setDeleteId(null),
    confirmDelete,

    editingId,
    openEdit: (id) => setEditingId(id),
    closeEdit: () => setEditingId(null),

    fetchNews,
  };
}
