import Link from 'next/link'
import { QrCode, Package, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f6fb]">
      {/* Navigation */}
      <header className="bg-[#1a2d5a]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-2">
            <QrCode className="h-7 w-7 text-white" />
            <span className="text-xl font-bold text-white">HashScan</span>
          </div>
          <Link
            href="/auth/login"
            className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#1a2d5a]">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Product Information
            <br />
            <span className="text-blue-300">at a Scan</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Create QR codes that link to beautiful product pages. Let customers
            discover your products instantly with a simple scan.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/login"
              className="rounded-xl bg-white px-8 py-3 text-base font-semibold text-[#1a2d5a] transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-[#1a2d5a]">
          Why Choose HashScan?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a2d5a]/10">
              <QrCode className="h-7 w-7 text-[#1a2d5a]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a2d5a]">Instant QR Codes</h3>
            <p className="mt-2 text-sm text-gray-500">
              Generate unique QR codes for each product. Download as PNG instantly.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a2d5a]/10">
              <Package className="h-7 w-7 text-[#1a2d5a]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a2d5a]">Multi-Item Products</h3>
            <p className="mt-2 text-sm text-gray-500">
              Group multiple items under one QR code with images and descriptions.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a2d5a]/10">
              <Zap className="h-7 w-7 text-[#1a2d5a]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a2d5a]">No Login Required</h3>
            <p className="mt-2 text-sm text-gray-500">
              Customers scan the QR and see product details immediately — no account needed.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-[#1a2d5a] p-10 text-center shadow-md">
          <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-2 text-blue-200">
            Sign in to your admin dashboard and create your first product.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-[#1a2d5a] hover:opacity-90"
          >
            Sign In Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a2d5a] py-6 text-center text-xs text-blue-200">
        HashScan &mdash; Powered by Innovation
      </footer>
    </main>
  )
}
