import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  bulkUpdateProductActiveApi,
  deleteProductApi,
  fetchCategoriesApi,
  fetchProductsApi,
} from '../api';
import type { Category, Product, StatusFilter } from '../types';

export function useProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [manageMode, setManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [bulkLoading, setBulkLoading] = useState(false);

  const SKELETON_ROWS = 5;
  const hasSelection = selectedIds.length > 0;

  const isAllChecked = useMemo(() => {
    if (!manageMode) return false;
    if (products.length === 0) return false;
    return selectedIds.length === products.length;
  }, [manageMode, products.length, selectedIds.length]);

  const fetchCategories = async () => {
    const data = await fetchCategoriesApi();
    setCategories(data);
  };

  const fetchProducts = async (categoryId: string = 'all') => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await fetchProductsApi({
      categoryId,
      manageMode,
      statusFilter,
      search,
    });

    if (fetchError) {
      console.error(fetchError);
      setError('Không thể tải danh sách sản phẩm');
      setProducts([]);
    } else {
      setProducts(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts('all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedIds([]);
    fetchProducts(activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manageMode, statusFilter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSelectedIds([]);
      fetchProducts(activeCategory);
    }, 400);

    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const resetManageTools = () => {
    setSelectedIds([]);
    setStatusFilter('all');
  };

  const toggleManageMode = () => {
    setManageMode((prev) => {
      const next = !prev;
      if (!next) resetManageTools();
      return next;
    });
  };

  const openCreatePage = () => {
    router.push('/products/create');
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSelectedIds([]);
    fetchProducts(categoryId);
  };

  const handleStatusAll = () => {
    setSelectedIds([]);
    setStatusFilter('all');
  };

  const handleToggleStatus = () => {
    setSelectedIds([]);
    setStatusFilter((prev) => (prev === 'on' ? 'off' : 'on'));
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (!manageMode) return;

    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectOne = (id: string, checked: boolean) => {
    if (!manageMode) return;

    if (checked) setSelectedIds((prev) => [...prev, id]);
    else setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);

    const { error: deleteError } = await deleteProductApi(deleteId);

    setDeleting(false);

    if (deleteError) {
      alert('Xóa thất bại');
      return;
    }

    setDeleteId(null);
    fetchProducts(activeCategory);
  };

  const bulkUpdateActive = async (nextActive: boolean) => {
    if (!hasSelection) return;

    setBulkLoading(true);

    const { error: bulkError } = await bulkUpdateProductActiveApi(selectedIds, nextActive);

    setBulkLoading(false);

    if (bulkError) {
      console.error(bulkError);
      alert('Cập nhật hàng loạt thất bại');
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, is_active: nextActive } : p)),
    );

    setSelectedIds([]);
  };

  return {
    SKELETON_ROWS,
    activeCategory,
    bulkLoading,
    categories,
    deleteId,
    deleting,
    editingId,
    error,
    hasSelection,
    isAllChecked,
    loading,
    manageMode,
    products,
    search,
    selectedIds,
    setDeleteId,
    setEditingId,
    setSelectedIds,
    setSearch,
    statusFilter,
    toggleManageMode,
    fetchProducts,
    handleCategoryChange,
    handleStatusAll,
    handleToggleSelectAll,
    handleToggleSelectOne,
    handleToggleStatus,
    openCreatePage,
    confirmDelete,
    bulkUpdateActive,
  };
}
