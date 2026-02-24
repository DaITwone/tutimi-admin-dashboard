import { Lightbulb } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function QuantityHintPopover({
  side = "right",
  align = "end",
}: {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[#1b4f94]"
        >
          <Lightbulb size={14} />
        </button>
      </PopoverTrigger>

      <PopoverContent side={side} align={align} sideOffset={12} className="w-40 max-w-[calc(100vw-2rem)] text-sm">
        <div className="space-y-1">
          <div className="font-bold text-blue2">Quy đổi số lượng</div>
          <div>
            500 ML = <b>1</b>
          </div>
          <div>
            1 L = <b>2</b>
          </div>
          <div>
            100 G = <b>1</b>
          </div>
          <div>
            1 Kg = <b>10</b>
          </div>
          <div>
            1 Cái = <b>1</b>
          </div>
          <div>
            1 Lốc = <b>6</b>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
