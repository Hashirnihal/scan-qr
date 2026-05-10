'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="mt-4 text-2xl">Account Created</CardTitle>
              <CardDescription>
                Check your email to confirm your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  We&apos;ve sent a confirmation link to your email. Click it to
                  verify your account and start using ScanQR.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Back to Home
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button className="w-full">Go to Login</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
