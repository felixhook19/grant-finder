/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function getSupabaseCookieHandler() {
  return {
    async getAll() {
      const cookieStore = await cookies()
      return cookieStore.getAll()
    },
    async setAll(cookiesToSet: any[]) {
      const cookieStore = await cookies()
      cookiesToSet.forEach((cookie: any) => {
        cookieStore.set(cookie.name, cookie.value, cookie.options ?? {})
      })
    },
  }
}

export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: getSupabaseCookieHandler() }
  )
}

export async function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: getSupabaseCookieHandler() }
  )
}
