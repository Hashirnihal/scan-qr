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

/**
 * Create a user account without sending a confirmation email.
 * Used as a fallback when the Supabase email rate limit is exceeded.
 * Sets email_confirm: true so the user can log in immediately.
 */
export async function signUpBypassEmail(
  email: string,
  password: string,
): Promise<{ error?: string }> {
  try {
    const admin = createAdminClient()
    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (error) {
      if (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already been registered') ||
        error.message.toLowerCase().includes('already exists')
      ) {
        return { error: 'already_exists' }
      }
      return { error: error.message }
    }
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'An error occurred' }
  }
}
