import Link from 'next/link'
import { QrCode, Package, Zap, Shield, ArrowRight, Scan } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0f4ff] overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-[#1a2d5a]/95 backdrop-blur-md border-b border-white/10 shadow-lg animate-fade-in">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">HashScan</span>
          </div>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition-all duration-200"
          >
            Admin Login
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative bg-[#1a2d5a] pb-32 pt-20 overflow-hidden">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/4 h-48 w-48 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-2xl" />

        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-4 py-1.5 mb-8 backdrop-blur">
            <Scan className="h-3.5 w-3.5 text-blue-300" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">QR Product Platform</span>
          </div>

          <h1 className="animate-fade-up-delay-1 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Product Info
            <br />
            <span className="shimmer-text">at a Scan</span>
          </h1>

          <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-lg text-blue-200/80 sm:text-xl">
            Create QR codes that link to beautiful product pages. Let customers discover your products instantly — no app needed.
          </p>

          <div className="animate-fade-up-delay-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/login"
              className="group flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-[#1a2d5a] shadow-lg transition-all duration-200 hover:scale-[1.04] hover:shadow-xl active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-fade-up-delay-4 mt-14 flex flex-wrap items-center justify-center gap-8 text-center">
            {[
              { value: '1-click', label: 'QR Generation' },
              { value: 'Live', label: 'Product Pages' },
              { value: '0', label: 'Login for Customers' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-extrabold text-white">{s.value}</span>
                <span className="text-xs font-medium text-blue-300/70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[70px]">
            <path d="M0,35 C480,70 960,0 1440,35 L1440,70 L0,70 Z" fill="#f0f4ff" />
          </svg>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="animate-fade-up mb-12 text-center">
          <h2 className="text-3xl font-bold text-[#1a2d5a] sm:text-4xl">How it works</h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: QrCode,
              step: '01',
              title: 'Instant QR Codes',
              desc: 'Generate a unique QR code per product in one click. Download as PNG — print-ready.',
              delay: 'animate-fade-up-delay-1',
            },
            {
              icon: Package,
              step: '02',
              title: 'Multi-Item Products',
              desc: 'Group multiple items with images and descriptions under a single scannable QR.',
              delay: 'animate-fade-up-delay-2',
            },
            {
              icon: Zap,
              step: '03',
              title: 'Instant Access',
              desc: 'Customers scan and see live product pages immediately — no app, no account needed.',
              delay: 'animate-fade-up-delay-3',
            },
          ].map(({ icon: Icon, step, title, desc, delay }) => (
            <div key={title} className={`card-hover ${delay} group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-8 shadow-sm`}>
              {/* Step number watermark */}
              <span className="absolute right-5 top-4 text-6xl font-black text-[#1a2d5a]/5 select-none">{step}</span>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a2d5a] to-[#2a4a8a] shadow-md">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#1a2d5a]">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features strip ── */}
      <div className="bg-[#1a2d5a] py-14 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-indigo-900/30" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, label: 'Secure admin dashboard' },
              { icon: QrCode, label: 'Permanent QR codes' },
              { icon: Package, label: 'Edit anytime, QR stays' },
              { icon: Zap, label: 'Deployed on Vercel edge' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="h-4.5 w-4.5 text-blue-300" />
                </div>
                <span className="text-sm font-medium text-blue-100">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <div className="animate-scale-in rounded-3xl bg-gradient-to-br from-[#1a2d5a] to-[#243f7a] p-12 shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to launch?</h2>
          <p className="mt-3 text-blue-200/80">
            Sign in to your admin dashboard and create your first product with a live QR code.
          </p>
          <Link
            href="/auth/login"
            className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-[#1a2d5a] shadow-lg transition-all duration-200 hover:scale-[1.04] hover:shadow-xl active:scale-[0.98]"
          >
            Sign In Now
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-blue-900/20 bg-[#1a2d5a] py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <QrCode className="h-4 w-4 text-blue-300" />
          <span className="text-sm font-bold text-white">HashScan</span>
        </div>
        <p className="text-xs text-blue-300/60">Powered by Innovation</p>
      </footer>
    </main>
  )
}

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
