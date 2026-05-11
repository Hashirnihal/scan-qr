import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client — bypasses Row Level Security.
 * ONLY use in server actions / server components after verifying the caller is the owner.
 * NEVER expose this client or its key to the browser.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
