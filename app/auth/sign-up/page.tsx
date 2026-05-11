'use client'

import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { QrCode, ArrowLeft } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'An error occurred'
      if (msg.toLowerCase().includes('email rate limit') || msg.toLowerCase().includes('rate limit')) {
        setError('Too many sign-up attempts. Please wait a few minutes and try again.')
      } else if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already been registered')) {
        setError('An account with this email already exists. Please sign in instead.')
      } else if (msg.toLowerCase().includes('invalid email')) {
        setError('Please enter a valid email address.')
      } else {
        setError(msg)
      }
    } finally {
      setIsLoading(false)
    }
  }

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
          <h1 className="text-2xl font-bold text-[#1a2d5a]">Create Account</h1>
          <p className="text-sm text-muted-foreground">Sign up for your HashScan account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-md">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/40"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/40"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-secondary/40"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#1a2d5a] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-[#1a2d5a] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
