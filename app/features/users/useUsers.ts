'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export type User = {
  id: string
  username: string | null
  full_name: string | null
  phone: string | null
  address: string | null
  avatar_url: string | null
  role?: string | null
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select(`id, username, full_name, phone, address, avatar_url, role`)
      .neq('role', 'admin')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch profiles error:', error.message)
      setLoading(false)
      return
    }

    setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()

    const channel = supabase
      .channel('profiles-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async () => {
          await fetchUsers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { users, loading }
}
