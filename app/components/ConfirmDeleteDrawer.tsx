'use client';

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function ConfirmDeleteDrawer({
  open,
  title = 'Xóa mục này?',
  description = 'Hành động này không thể hoàn tác.',
  onCancel,
  onConfirm,
  loading = false,
}: Props) {
  if (!open) return null;

  return (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />

    {/* Center Modal */}
    <div
      className="
        fixed left-1/2 top-1/2 z-50
        w-full max-w-sm
        -translate-x-1/2 -translate-y-1/2
        rounded-2xl bg-white p-6 shadow-xl
        animate-scale-in
      "
    >
      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Hủy
        </button>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded-lg bg-red-600 px-5 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Đang xóa...' : 'Xóa'}
        </button>
      </div>
    </div>
  </>
);

}
