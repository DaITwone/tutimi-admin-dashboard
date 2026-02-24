"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type BucketType = "day" | "week" | "month" | "year";

export type DashboardRange = {
  from: string | null; 
  to: string | null;  
  bucket: BucketType;
};

// 00:00:00.000
function toISOStartOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// 23:59:59.999
function toISOEndOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function formatDateInputValue(iso: string | null) {
  if (!iso) return ""; // ✅ clear
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DashboardRangeFilter({
  value,
  onChange,
}: {
  value: DashboardRange;
  onChange: (next: DashboardRange) => void;
}) {
  const fromInput = React.useMemo(
    () => formatDateInputValue(value.from),
    [value.from]
  );
  const toInput = React.useMemo(
    () => formatDateInputValue(value.to),
    [value.to]
  );

  return (
    <Card className="rounded-2xl p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {/* Left: bucket */}
        <div className="space-y-2">
          <Label className="font-bold text-blue1">Hiển thị theo</Label>

          <Select
            value={value.bucket}
            onValueChange={(v) => {
              const bucket = v as BucketType;
              onChange({ ...value, bucket });
            }}
          >
            <SelectTrigger className="w-55 rounded-xl">
              <SelectValue placeholder="Chọn kiểu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Ngày</SelectItem>
              <SelectItem value="week">Tuần</SelectItem>
              <SelectItem value="month">Tháng</SelectItem>
              <SelectItem value="year">Năm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right: custom from/to */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <Label className="text-blue1 font-bold">Từ ngày</Label>

            <input
              type="date"
              className="h-10 w-40 rounded-xl border px-3 text-sm"
              value={fromInput}
              onChange={(e) => {
                const raw = e.target.value;

                // user clears input
                if (!raw) {
                  onChange({ ...value, from: null });
                  return;
                }

                const nextFrom = new Date(raw);
                onChange({
                  ...value,
                  from: toISOStartOfDay(nextFrom),
                });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-blue1">Đến ngày</Label>

            <input
              type="date"
              className="h-10 w-40 rounded-xl border px-3 text-sm"
              value={toInput}
              onChange={(e) => {
                const raw = e.target.value;

                // user clears input
                if (!raw) {
                  onChange({ ...value, to: null });
                  return;
                }

                const nextTo = new Date(raw);
                onChange({
                  ...value,
                  to: toISOEndOfDay(nextTo),
                });
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
