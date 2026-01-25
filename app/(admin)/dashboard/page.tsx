"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchDashboardMetrics,
  TimeRange,
  DashboardMetrics,
} from "@/app/lib/dashboardService";

const formatMoney = (v: number) => `${v.toLocaleString("vi-VN")}đ`;

export default function DashboardPage() {
  const [range, setRange] = useState<TimeRange>("today");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const rangeLabel = useMemo(() => {
    if (range === "today") return "Hôm nay";
    if (range === "week") return "Tuần này";
    return "Tháng này";
  }, [range]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardMetrics(range);
      setMetrics(data);
    } catch (err) {
      console.log("Dashboard fetch error:", err);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [range]);

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1b4f94]">Doanh Thu</h1>
          <p className="text-sm text-gray-500">Tổng quan ({rangeLabel})</p>
        </div>

        {/* Range filter */}
        <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
          <RangeButton active={range === "today"} onClick={() => setRange("today")}>
            Hôm nay
          </RangeButton>
          <RangeButton active={range === "week"} onClick={() => setRange("week")}>
            Tuần
          </RangeButton>
          <RangeButton active={range === "month"} onClick={() => setRange("month")}>
            Tháng
          </RangeButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng đơn"
          value={loading ? "..." : String(metrics?.totalOrders ?? 0)}
        />
        <StatCard
          title="Doanh thu"
          value={loading ? "..." : formatMoney(metrics?.revenue ?? 0)}
        />
        <StatCard
          title="% Huỷ"
          value={loading ? "..." : `${metrics?.cancelRate ?? 0}%`}
        />
        <StatCard title="Top sản phẩm" value={loading ? "..." : "5 món"} />
      </div>

      {/* Top products */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-[#1b4f94]">Top sản phẩm bán chạy</p>
          <p className="text-sm text-gray-500">{rangeLabel}</p>
        </div>

        {loading ? (
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        ) : metrics?.topProducts?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-500">
                  <th className="py-2 pr-3">Sản phẩm</th>
                  <th className="py-2 pr-3">Đã bán</th>
                  <th className="py-2 pr-3">Doanh thu</th>
                </tr>
              </thead>

              <tbody>
                {metrics.topProducts.map((p) => (
                  <tr key={p.product_id} className="border-b border-gray-300 last:border-none">
                    <td className="py-3 pr-3 font-medium text-gray-800">
                      {p.product_name}
                    </td>
                    <td className="py-3 pr-3">{p.sold}</td>
                    <td className="py-3 pr-3 text-red-500 font-semibold">
                      {formatMoney(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Chưa có dữ liệu trong khoảng này.</p>
        )}
      </div>

      {/* Placeholder for later charts */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-500">Biểu đồ / hoạt động gần đây (làm sau)</p>
      </div>
    </div>
  );
}

function RangeButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${active ? "bg-[#1c4273] text-white" : "bg-gray-100 text-gray-700"
        }`}
    >
      {children}
    </button>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-[#1b4f94]">{value}</p>
    </div>
  );
}
