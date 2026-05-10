'use server'

import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Look up a user's email by their username stored in the profiles table.
 * Uses the admin client (service role) so it bypasses RLS.
 */
export async function getEmailByUsername(username: string): Promise<string | null> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('profiles')
      .select('email')
      .ilike('username', username.trim())
      .single()

    if (error) {
      console.error('[getEmailByUsername] DB error:', error)
      return null
    }
    if (!data?.email) return null
    return data.email as string
  } catch (err) {
    console.error('[getEmailByUsername] Caught exception:', err)
    return null
  }
}
