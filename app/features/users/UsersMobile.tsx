import { User } from './useUsers'

export default function UsersMobile({
  users,
  loading,
}: {
  users: User[]
  loading: boolean
}) {
  return (
    <div className="md:hidden space-y-3">
      {loading && <UsersMobileSkeleton count={5} />}

      {!loading && users.length === 0 && (
        <MobileEmptyState text="No users found" />
      )}

      {!loading &&
        users.map((user) => (
          <UserCard key={user.id} user={user} active />
        ))}
    </div>
  )
}

/* ================= COMPONENTS ================= */

function UserCard({ user, active }: { user: User; active: boolean }) {
  const displayName = user.full_name || user.username || 'Unnamed'
  const usernameText = user.username ? `@${user.username}` : '—'

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="border rounded-full border-gray-300 shrink-0">
          <img
            src={user.avatar_url || '/images/avt.png'}
            alt=""
            className="h-12 w-12 rounded-full shadow-sm object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 truncate">
            {displayName}
          </div>
          <div className="text-xs text-gray-500 truncate">{usernameText}</div>
        </div>

        <span
          className={`inline-flex shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
            active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {active ? 'Active' : 'Disabled'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-gray-500">Phone</span>
          <span className="text-gray-800 truncate">
            {user.phone ?? '—'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-gray-500">Address</span>
          <span className="text-gray-800 truncate">
            {user.address ?? '—'}
          </span>
        </div>
      </div>
    </div>
  )
}

function MobileEmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">
      {text}
    </div>
  )
}

function UsersMobileSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <UserCardSkeleton key={idx} />
      ))}
    </div>
  )
}

function UserCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
          <div className="mt-2 h-3 w-1/3 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse shrink-0" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-40 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-52 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
