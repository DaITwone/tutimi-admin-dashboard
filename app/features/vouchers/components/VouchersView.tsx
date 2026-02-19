'use client';

import type { Voucher } from '../types';
import ConfirmDeleteDrawer from '@/app/components/ConfirmDeleteDrawer';
import EditVoucherDrawer from '@/app/components/EditVoucherDrawer';
import VouchersHeader from './VouchersHeader';
import VouchersMobileList from './VouchersMobileList';
import VouchersTable from './VouchersTable';

type VouchersViewProps = {
  vouchers: Voucher[];
  loading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;

  onCreate: () => void;
  onEdit: (code: string) => void;
  onDelete: (code: string) => void;

  editingCode: string | null;
  onCloseEdit: () => void;
  onUpdated: () => void;

  deleteOpen: boolean;
  deleting: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
};

export default function VouchersView({
  vouchers,
  loading,
  error,
  search,
  onSearchChange,
  onCreate,
  onEdit,
  onDelete,
  editingCode,
  onCloseEdit,
  onUpdated,
  deleteOpen,
  deleting,
  onCancelDelete,
  onConfirmDelete,
}: VouchersViewProps) {
  return (
    <div className="space-y-3 mt-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <VouchersHeader
          search={search}
          onSearchChange={onSearchChange}
          onCreate={onCreate}
        />

        <VouchersMobileList
          vouchers={vouchers}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <VouchersTable
          vouchers={vouchers}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
          skeletonRows={5}
        />
      </div>

      {editingCode && (
        <EditVoucherDrawer
          code={editingCode}
          onClose={onCloseEdit}
          onUpdated={onUpdated}
        />
      )}

      <ConfirmDeleteDrawer
        open={deleteOpen}
        title="Xóa voucher?"
        description="Voucher sẽ bị xóa vĩnh viễn."
        loading={deleting}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
