'use client';

import ConfirmDeleteDrawer from '@/app/components/ConfirmDeleteDrawer';
import EditProductDrawer from '@/app/components/EditProductDrawer';
import { useProductsPage } from '../hooks/useProductsPage';
import ProductsDesktopTable from './ProductsDesktopTable';
import ProductsMobileList from './ProductsMobileList';
import ProductsToolbar from './ProductsToolbar';

export default function ProductsPageView() {
  const {
    SKELETON_ROWS,
    activeCategory,
    bulkLoading,
    categories,
    deleteId,
    deleting,
    editingId,
    error,
    isAllChecked,
    loading,
    manageMode,
    products,
    search,
    selectedIds,
    setDeleteId,
    setEditingId,
    setSearch,
    setSelectedIds,
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
  } = useProductsPage();

  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 -mx-6 bg-gray-50 px-6">
        <div className="flex gap-2 overflow-x-auto py-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
              activeCategory === 'all' ? 'bg-[#1b4f94] text-white' : 'bg-gray-100 text-[#1c4273]'
            }`}
          >
            Tất cả
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm shadow-sm ${
                activeCategory === cat.id ? 'bg-[#1b4f94] text-white' : 'bg-gray-100 text-[#1c4273]'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>}

      <div className="rounded-xl bg-white shadow-sm">
        <ProductsToolbar
          bulkLoading={bulkLoading}
          manageMode={manageMode}
          search={search}
          statusFilter={statusFilter}
          onAdd={openCreatePage}
          onClearSelection={() => setSelectedIds([])}
          onManageToggle={toggleManageMode}
          onSearchChange={setSearch}
          onStatusAll={handleStatusAll}
          onStatusToggle={handleToggleStatus}
          onBulkOn={() => bulkUpdateActive(true)}
          onBulkOff={() => bulkUpdateActive(false)}
        />

        <ProductsMobileList
          bulkLoading={bulkLoading}
          loading={loading}
          manageMode={manageMode}
          products={products}
          selectedIds={selectedIds}
          onEdit={setEditingId}
          onDelete={setDeleteId}
          onToggleSelectOne={handleToggleSelectOne}
          onBulkOn={() => bulkUpdateActive(true)}
          onBulkOff={() => bulkUpdateActive(false)}
        />

        <ProductsDesktopTable
          loading={loading}
          products={products}
          manageMode={manageMode}
          selectedIds={selectedIds}
          selectedCount={selectedIds.length}
          isAllChecked={isAllChecked}
          skeletonRows={SKELETON_ROWS}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
          onEdit={setEditingId}
          onDelete={setDeleteId}
        />
      </div>

      {editingId && (
        <EditProductDrawer
          productId={editingId}
          onClose={() => setEditingId(null)}
          onUpdated={() => fetchProducts(activeCategory)}
        />
      )}

      <ConfirmDeleteDrawer
        open={!!deleteId}
        title="Xóa sản phẩm?"
        description="Sản phẩm sẽ bị xóa vĩnh viễn."
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
