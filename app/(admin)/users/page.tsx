'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

type User = {
  id: string;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  role?: string | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select(`id, username, full_name, phone, address, avatar_url, role`)
      .neq('role', 'admin') // neq = not equal
      .order('created_at', { ascending: false }); // ASC = giảm dần, DESC = tăng dần

    if (error) {
      console.error('Fetch profiles error:', error.message);
      setLoading(false);
      return;
    }

    setUsers(data ?? []); // ?? Nullish coalescing operator - Nếu bên trái null/undefined thì lấy bên phải.
    setLoading(false);
  };

  // WebSocket Realtime Subscription
  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('profiles-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async (payload) => {
          console.log('Realtime:', payload);

          // simplest + safest
          await fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mt-6 space-y-6">
      {/* ===================== MOBILE: CARDS ===================== */}
      <div className="md:hidden space-y-3">
        {loading && <UsersMobileSkeleton count={5} />}

        {!loading && users.length === 0 && (
          <MobileEmptyState text="No users found" />
        )}

        {!loading &&
          users.map((user) => <UserCard key={user.id} user={user} active />)}
      </div>

      {/* ===================== DESKTOP: TABLE ===================== */}
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
    </div>
  );
}

/* ===================== MOBILE COMPONENTS ===================== */
function MobileState({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">
      {text}
    </div>
  );
}

function UserCard({ user, active }: { user: User; active: boolean }) {
  const displayName = user.full_name || user.username || 'Unnamed';
  const usernameText = user.username ? `@${user.username}` : '—';

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
          className={`inline-flex shrink-0 rounded-full px-2 py-1 text-xs font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
        >
          {active ? 'Active' : 'Disabled'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-gray-500">Phone</span>
          <span className="text-gray-800 truncate">{user.phone ?? '—'}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-gray-500">Address</span>
          <span className="text-gray-800 truncate">{user.address ?? '—'}</span>
        </div>
      </div>
    </div>
  );
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
  avatarUrl: string | null;
  username: string | null;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  active: boolean;
}) {
  return (
    <tr className="hover:bg-gray-50">
      {/* USER */}
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
              {fullName ? `@${username ?? '—'}` : username ? `@${username}` : '—'}
            </div>
          </div>
        </div>
      </td>

      {/* USERNAME */}
      <td className="p-4 text-gray-700">
        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
          @{username ?? '—'}
        </span>
      </td>

      {/* PHONE */}
      <td className="p-4 text-gray-600">{phone ?? '—'}</td>

      {/* ADDRESS */}
      <td className="p-4 text-gray-600">{address ?? '—'}</td>

      {/* STATUS */}
      <td className="p-4">
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
        >
          {active ? 'Active' : 'Disabled'}
        </span>
      </td>
    </tr>
  );
}

function MobileEmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-400 shadow-sm">
      {text}
    </div>
  );
}

function UsersMobileSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <UserCardSkeleton key={idx} />
      ))}
    </div>
  );
}

function UserCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      {/* top row */}
      <div className="flex items-center gap-3">
        {/* avatar */}
        <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse shrink-0" />

        {/* name + username */}
        <div className="min-w-0 flex-1">
          <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
          <div className="mt-2 h-3 w-1/3 rounded bg-gray-200 animate-pulse" />
        </div>

        {/* status */}
        <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse shrink-0" />
      </div>

      {/* details */}
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
  );
}

function UsersTableSkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} className="border-b last:border-b-0">
          {/* USER */}
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="min-w-0">
                <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
                <div className="mt-2 h-3 w-24 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          </td>

          {/* USERNAME */}
          <td className="p-4">
            <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
          </td>

          {/* PHONE */}
          <td className="p-4">
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
          </td>

          {/* ADDRESS */}
          <td className="p-4">
            <div className="h-4 w-56 rounded bg-gray-200 animate-pulse" />
          </td>

          {/* STATUS */}
          <td className="p-4">
            <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );
}
