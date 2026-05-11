'use client'

import { createClient } from '@/lib/supabase/client'
import { getEmailByUsername } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { QrCode, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { OWNER_EMAIL } from '@/lib/constants'

function LoginForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Resolve username → email if needed
      let email = usernameOrEmail.trim()
      if (!email.includes('@')) {
        const resolved = await getEmailByUsername(email)
        if (!resolved) {
          throw new Error('Username not found. Please use your email or contact your administrator.')
        }
        email = resolved
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError
      // Owner goes to owner panel, everyone else to regular dashboard
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
        router.push('/owner')
      } else {
        router.push('/portal')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-md">
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="username" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="you@example.com"
            required
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="bg-secondary/40"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary/40"
          />
        </div>

        {justRegistered && !error && (
          <p className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
            Account created! Sign in below.
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#1a2d5a] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        New to HashScan?{' '}
        <a href="/auth/sign-up" className="font-semibold text-[#1a2d5a] hover:underline">
          Create an account
        </a>
      </p>
    </div>
  )
}

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f4f6fb]">
      <div className="w-full max-w-sm">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 flex items-center gap-1.5 text-sm text-[#1a2d5a]/60 hover:text-[#1a2d5a] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a2d5a]">
            <QrCode className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a2d5a]">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your products &amp; QR codes
          </p>
        </div>

        <Suspense fallback={<div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-md h-64" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
