import { User } from './useUsers'

export default function UsersTable({
  users,
  loading,
}: {
  users: User[]
  loading: boolean
}) {
  return (
    <div className="hidden md:block overflow-hidden rounded-xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50 text-gray-500">
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
              <td colSpan={5} className="p-6 text-center text-gray-400">
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

/* ===================== DESKTOP ROW ===================== */

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
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="border rounded-full border-gray-300">
            <img
              src={avatarUrl || '/images/avt.png'}
              alt=""
              className="h-12 w-12 rounded-full shadow-sm object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {fullName || username || 'Unnamed'}
            </div>
            <div className="text-xs text-gray-500">
              {fullName
                ? `@${username ?? '—'}`
                : username
                ? `@${username}`
                : '—'}
            </div>
          </div>
        </div>
      </td>

      <td className="p-4 text-gray-700">
        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
          @{username ?? '—'}
        </span>
      </td>

      <td className="p-4 text-gray-600">{phone ?? '—'}</td>

      <td className="p-4 text-gray-600">{address ?? '—'}</td>

      <td className="p-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {active ? 'Active' : 'Disabled'}
        </span>
      </td>
    </tr>
  )
}

/* ===================== SKELETON ===================== */

function UsersTableSkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} className="border-b last:border-b-0">
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="min-w-0">
                <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
                <div className="mt-2 h-3 w-24 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          </td>

          <td className="p-4">
            <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
          </td>

          <td className="p-4">
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
          </td>

          <td className="p-4">
            <div className="h-4 w-56 rounded bg-gray-200 animate-pulse" />
          </td>

          <td className="p-4">
            <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  )
}
