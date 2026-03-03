import { User } from './useUsers'

export default function UsersMobile({
  users,
  loading,
}: {
  users: User[]
  loading: boolean
}) {
  return (
    <div className="space-y-3 md:hidden">
      {loading && <UsersMobileSkeleton count={5} />}

      {!loading && users.length === 0 && <MobileEmptyState text="No users found" />}

      {!loading && users.map((user) => <UserCard key={user.id} user={user} active />)}
    </div>
  )
}

function UserCard({ user, active }: { user: User; active: boolean }) {
  const displayName = user.full_name || user.username || 'Unnamed'
  const usernameText = user.username ? `@${user.username}` : '--'

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-full border border-border">
          <img
            src={user.avatar_url || '/images/avt.png'}
            alt=""
            className="h-12 w-12 rounded-full object-cover shadow-sm"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-foreground">{displayName}</div>
          <div className="truncate text-xs text-muted-foreground">{usernameText}</div>
        </div>

        <span
          className={`inline-flex shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
            active
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {active ? 'Active' : 'Disabled'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Phone</span>
          <span className="truncate text-foreground/80">{user.phone ?? '--'}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Address</span>
          <span className="truncate text-foreground/80">{user.address ?? '--'}</span>
        </div>
      </div>
    </div>
  )
}

function MobileEmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-sm">
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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="min-w-0 flex-1">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-6 w-16 shrink-0 animate-pulse rounded-full bg-muted" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-3 w-40 animate-pulse rounded bg-muted" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-3 w-52 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}
