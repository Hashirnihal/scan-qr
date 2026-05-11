'use client'

import { createClient } from '@/lib/supabase/client'
import { getEmailByUsername } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { QrCode } from 'lucide-react'

export default function Page() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
      router.push('/portal')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f4f6fb]">
      <div className="w-full max-w-sm">
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

        {/* Card */}
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
      </div>
    </div>
  )
}
