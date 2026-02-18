'use client'

import UsersMobile from "@/app/features/users/UsersMobile"
import UsersTable from "@/app/features/users/UsersTable"
import { useUsers } from "@/app/features/users/useUsers"



export default function UsersPage() {
  const { users, loading } = useUsers()

  return (
    <div className="mt-6 space-y-6">
      <UsersMobile users={users} loading={loading} />
      <UsersTable users={users} loading={loading} />
    </div>
  )
}
