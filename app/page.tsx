import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QrCode, Package, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">ScanQR</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/portal">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="space-y-12 py-20 text-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Product Information at a Scan
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Create QR codes that link to detailed product information. Share them anywhere and let customers discover your products instantly.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="space-y-12 py-20">
          <h2 className="text-center text-3xl font-bold text-foreground">
            Why Choose ScanQR?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <QrCode className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Instant QR Codes
              </h3>
              <p className="mt-2 text-muted-foreground">
                Generate unique QR codes for each product. Download as SVG or PNG.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <Package className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Rich Product Info
              </h3>
              <p className="mt-2 text-muted-foreground">
                Showcase images, descriptions, and custom fields for each product.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <Zap className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                Fast & Reliable
              </h3>
              <p className="mt-2 text-muted-foreground">
                Lightning-fast product pages optimized for mobile scanning.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="space-y-8 rounded-lg border border-border bg-card p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground">
            Create your account and start generating QR codes for your products today.
          </p>
          <Link href="/auth/login">
            <Button size="lg">Sign In Now</Button>
          </Link>
        </section>
      </div>
    </main>
  )
}
