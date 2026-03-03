import { User } from './useUsers'

export default function UsersTable({
  users,
  loading,
}: {
  users: User[]
  loading: boolean
}) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40 text-muted-foreground">
          <tr>
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-left">Username</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Address</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {loading && <UsersTableSkeletonRows rows={6} />}

          {!loading && users.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-muted-foreground">
                No users found
              </td>
            </tr>
          )}

          {!loading &&
            users.map((user) => (
              <UserRow
                key={user.id}
                avatarUrl={user.avatar_url}
                username={user.username}
                fullName={user.full_name}
                phone={user.phone}
                address={user.address}
                active
              />
            ))}
        </tbody>
      </table>
    </div>
  )
}

function UserRow({
  avatarUrl,
  username,
  fullName,
  phone,
  address,
  active,
}: {
  avatarUrl: string | null
  username: string | null
  fullName: string | null
  phone: string | null
  address: string | null
  active: boolean
}) {
  const usernameValue = username ?? '--'
  const secondaryUsername = fullName ? `@${usernameValue}` : username ? `@${username}` : '--'

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-muted/30">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-border">
            <img
              src={avatarUrl || '/images/avt.png'}
              alt=""
              className="h-12 w-12 rounded-full object-cover shadow-sm"
            />
          </div>
          <div>
            <div className="font-medium text-foreground">
              {fullName || username || 'Unnamed'}
            </div>
            <div className="text-xs text-muted-foreground">{secondaryUsername}</div>
          </div>
        </div>
      </td>

      <td className="p-4 text-foreground/80">
        <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground/80">
          @{usernameValue}
        </span>
      </td>

      <td className="p-4 text-foreground/80">{phone ?? '--'}</td>
      <td className="p-4 text-foreground/80">{address ?? '--'}</td>

      <td className="p-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            active
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {active ? 'Active' : 'Disabled'}
        </span>
      </td>
    </tr>
  )
}

function UsersTableSkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} className="border-b last:border-b-0">
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
              <div className="min-w-0">
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </td>

          <td className="p-4">
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
          </td>
          <td className="p-4">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </td>
          <td className="p-4">
            <div className="h-4 w-56 animate-pulse rounded bg-muted" />
          </td>
          <td className="p-4">
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </td>
        </tr>
      ))}
    </>
  )
}
