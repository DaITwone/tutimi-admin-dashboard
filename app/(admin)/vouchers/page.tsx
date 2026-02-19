'use client';

import { useRouter } from 'next/navigation';
import VouchersView from './components/VouchersView';
import { useVouchers } from './hooks/useVoucher';

export default function VouchersPage() {
  const router = useRouter();
  const {
    vouchers,
    loading,
    error,
    search,
    setSearch,

    deleteCode,
    deleting,
    openDelete,
    closeDelete,
    confirmDelete,

    editingCode,
    openEdit,
    closeEdit,

    fetchVouchers,
  } = useVouchers();

  return (
    <VouchersView
      vouchers={vouchers}
      loading={loading}
      error={error}
      search={search}
      onSearchChange={setSearch}
      onCreate={() => router.push('/vouchers/create')}
      onEdit={openEdit}
      onDelete={openDelete}

      editingCode={editingCode}
      onCloseEdit={closeEdit}
      onUpdated={fetchVouchers}

      deleteOpen={!!deleteCode}
      deleting={deleting}
      onCancelDelete={closeDelete}
      onConfirmDelete={confirmDelete}
    />
  );
}
