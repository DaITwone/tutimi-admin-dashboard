export function BulkMobileSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex gap-3">
            <div className="h-20 w-20 shrink-0 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-6 w-32 rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="h-10 rounded-lg bg-gray-200" />
            <div className="h-10 rounded-lg bg-gray-200" />
            <div className="h-10 rounded-lg bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
