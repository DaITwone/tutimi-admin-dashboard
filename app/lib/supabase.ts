import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true, //giữ login khi load
      autoRefreshToken: true, //không bị logout bất ngờ
      detectSessionInUrl: true, //cần cho auth redirect
    },
  }
)
