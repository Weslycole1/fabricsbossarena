import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file and restart the dev server.'
  )
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
)

// Auth requests hit: {VITE_SUPABASE_URL}/auth/v1/signup | /auth/v1/token?grant_type=password
