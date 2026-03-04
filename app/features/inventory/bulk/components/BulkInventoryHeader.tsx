import { ArrowLeft, Save } from "lucide-react";

type BulkInventoryHeaderProps = {
  title: string;
  lastReceiptId: string | null;
  successCount: number;
  submitting: boolean;
  canSubmit: boolean;
  onBack: () => void;
  onPrint: () => void;
  onSubmit: () => void;
};

export function BulkInventoryHeader({
  title,
  lastReceiptId,
  successCount,
  submitting,
  canSubmit,
  onBack,
  onPrint,
  onSubmit,
}: BulkInventoryHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-2/20 bg-brand-2/10 text-brand-2 transition hover:bg-brand-2/15 active:scale-95"
          aria-label="Quay lại"
          title="Quay lại"
          type="button"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-brand-1 dark:text-brand-2">{title}</h1>
          <p className="text-sm text-muted-foreground">Ghi nhận phiếu nhập/xuất. Cập nhật tồn kho.</p>
        </div>
      </div>

      <div className="w-full space-y-2 sm:w-auto">
        {lastReceiptId && successCount > 0 && (
          <div className="flex w-full items-center gap-2 rounded-lg bg-blue-50 px-3 py-3.5 dark:bg-blue-500/15 sm:w-auto">
            <span className="text-xs text-muted-foreground">Mã phiếu</span>
            <span className="text-sm font-semibold text-brand-1 dark:text-brand-2">{lastReceiptId.slice(0, 8).toUpperCase()}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
          <button
            disabled={!lastReceiptId || successCount === 0}
            onClick={onPrint}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-2 bg-card px-4 py-2 text-brand-2 transition hover:bg-muted/50 disabled:opacity-40 sm:w-auto"
            title={!lastReceiptId ? "Chưa có phiếu mới để in" : "In phiếu vừa tạo"}
            type="button"
          >
            In phiếu
          </button>

          <button
            disabled={submitting || !canSubmit}
            onClick={onSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-2 px-4 py-2 text-white transition hover:bg-brand-1 disabled:opacity-50 sm:w-auto"
            type="button"
          >
            <Save size={18} />
            {submitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
