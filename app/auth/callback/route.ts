import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { OWNER_EMAIL } from '@/lib/constants'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Route owner to owner panel, everyone else to requested next or portal
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
        return NextResponse.redirect(`${origin}/owner`)
      }
      const destination = next === '/' ? '/portal' : next
      return NextResponse.redirect(`${origin}${destination}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
