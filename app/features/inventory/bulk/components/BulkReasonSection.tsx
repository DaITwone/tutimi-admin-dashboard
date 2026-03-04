import { REASON_PRESETS } from "../bulk.model";

type BulkReasonSectionProps = {
  reasonPreset: (typeof REASON_PRESETS)[number];
  customReason: string;
  onChangePreset: (value: (typeof REASON_PRESETS)[number]) => void;
  onChangeCustomReason: (value: string) => void;
};

export function BulkReasonSection({
  reasonPreset,
  customReason,
  onChangePreset,
  onChangeCustomReason,
}: BulkReasonSectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="text-sm font-semibold text-brand-1 dark:text-brand-2">Lý do Nhập/Xuất</div>

      <div className="flex flex-wrap gap-2">
        {REASON_PRESETS.map((opt) => (
          <button
            key={opt}
            onClick={() => onChangePreset(opt)}
            className={`rounded-full px-4 py-2 text-sm shadow-sm transition ${
              reasonPreset === opt
                ? "bg-brand-2 text-white"
                : "bg-muted text-brand-1 hover:bg-muted/80 dark:text-brand-2"
            }`}
            type="button"
          >
            {opt}
          </button>
        ))}
      </div>

      {reasonPreset === "Khác" && (
        <input
          value={customReason}
          onChange={(e) => onChangeCustomReason(e.target.value)}
          placeholder="Nhập lý do phát sinh..."
          className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-brand-2 focus:bg-background"
        />
      )}
    </div>
  );
}
