'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

/* ===================== TYPES ===================== */
type User = {
  id: string;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  role?: string | null;
};

/* ===================== PAGE ===================== */
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

    setUsers(data ?? []); // ?? Nullish coalescing operator
    setLoading(false);
  };

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
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          {/* ===================== HEADER ===================== */}
          <thead className="border-b bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Address</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          {/* ===================== BODY ===================== */}
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            )}

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

/* ===================== ROW ===================== */
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
