export default function DashboardPage() {
  return (
    <div className="space-y-6 mt-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Người dùng" value="120" />
        <StatCard title="Sản phẩm" value="45" />
        <StatCard title="Tin tức" value="8" />
        <StatCard title="Đơn hàng" value="230" />
      </div>

      {/* Placeholder cho chart / recent activity */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-gray-500">
          Biểu đồ / hoạt động gần đây (làm sau)
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
