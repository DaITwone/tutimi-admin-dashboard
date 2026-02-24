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
    <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-[#1c4273]">Lý do Nhập/Xuất</div>

      <div className="flex flex-wrap gap-2">
        {REASON_PRESETS.map((opt) => (
          <button
            key={opt}
            onClick={() => onChangePreset(opt)}
            className={`rounded-full px-4 py-2 text-sm shadow-sm transition ${
              reasonPreset === opt ? "bg-[#1b4f94] text-white" : "bg-gray-100 text-[#1c4273] hover:bg-gray-200"
            }`}
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
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#1b4f94] focus:bg-white"
        />
      )}
    </div>
  );
}
