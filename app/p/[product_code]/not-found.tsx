import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <AlertCircle className="h-16 w-16 text-muted-foreground" />
      <h1 className="mt-4 text-3xl font-bold text-foreground">
        Product Not Found
      </h1>
      <p className="mt-2 text-muted-foreground">
        The product you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
