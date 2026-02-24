export default function ProductsMobileSkeleton({
  count = 5,
  manageMode,
}: {
  count?: number;
  manageMode: boolean;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm animate-pulse"
        >
          <div className="flex items-start gap-3">
            {manageMode && <div className="mt-1 h-4 w-4 rounded bg-gray-200" />}

            <div className="h-20 w-16 rounded-xl bg-gray-200" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-6 w-24 rounded-lg bg-gray-200" />
          </div>

          {!manageMode && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-10 rounded-xl bg-gray-200" />
              <div className="h-10 rounded-xl bg-gray-200" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
