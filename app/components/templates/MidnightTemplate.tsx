import Image from 'next/image'
import { QrCode, Zap } from 'lucide-react'
import { Product, SubItem } from '@/app/actions/products'

interface Props { product: Product; subItems: SubItem[] }

export default function MidnightTemplate({ product, subItems }: Props) {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#07071a' }}>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-purple-500/20 backdrop-blur-xl" style={{ background: 'rgba(7,7,26,0.85)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-purple-500/40" style={{ background: 'rgba(168,85,247,0.15)' }}>
              <QrCode className="h-5 w-5 text-purple-300" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">HashScan</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1 ring-purple-500/30" style={{ background: 'rgba(168,85,247,0.1)' }}>
            <Zap className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">Product Info</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden pb-28 pt-20">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-80 w-80 rounded-full blur-3xl" style={{ background: 'rgba(168,85,247,0.18)' }} />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 h-96 w-96 rounded-full blur-3xl" style={{ background: 'rgba(139,92,246,0.12)' }} />
        <div className="pointer-events-none absolute top-1/3 right-1/3 h-48 w-48 rounded-full blur-2xl" style={{ background: 'rgba(217,70,239,0.08)' }} />

        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 px-4 py-1.5 backdrop-blur" style={{ background: 'rgba(168,85,247,0.12)' }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-300">{product.code}</span>
          </div>
          {product.image_url && (
            <div className="animate-fade-up mb-4 flex justify-center">
              <div className="h-20 w-20 overflow-hidden rounded-full shadow-xl" style={{ ring: '4px solid rgba(168,85,247,0.4)', boxShadow: '0 0 0 4px rgba(168,85,247,0.35)' }}>
                <Image src={product.image_url} alt={product.name} width={80} height={80} className="h-full w-full object-cover" />
              </div>
            </div>
          )}
          <h1
            className="animate-fade-up-delay-1 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            style={{ background: 'linear-gradient(135deg, #e879f9 0%, #a855f7 50%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {product.name}
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 text-base sm:text-lg" style={{ color: 'rgba(216,180,254,0.7)' }}>
            Explore the collection below
          </p>
        </div>

        {/* Wavy divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px]">
            <path d="M0,20 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="#07071a" />
          </svg>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {subItems.length > 0 && (
          <section className="mb-14">
            <div className="animate-fade-up mb-10 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Products</h2>
              <div className="mx-auto mt-3 h-px w-24" style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {subItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`animate-fade-up-delay-${Math.min(i + 2, 4)} group overflow-hidden rounded-2xl ring-1 transition-all duration-300 hover:ring-purple-500/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]`}
                  style={{ background: 'rgba(18,18,42,0.9)', borderColor: 'rgba(168,85,247,0.2)', backdropFilter: 'blur(12px)' }}
                >
                  {item.image_url ? (
                    <div className="relative h-56 w-full overflow-hidden sm:h-64">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07071a]/80 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center" style={{ background: 'rgba(168,85,247,0.08)' }}>
                      <QrCode className="h-14 w-14 text-purple-700" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    </div>
                    {item.description && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'rgba(196,181,253,0.7)' }}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {subItems.length === 0 && product.description && (
          <div className="mb-14 overflow-hidden rounded-2xl ring-1 ring-purple-500/20" style={{ background: 'rgba(18,18,42,0.9)' }}>
            {product.image_url && (
              <div className="relative h-64 w-full overflow-hidden">
                <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
              </div>
            )}
            <div className="p-8">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-purple-200/70">{product.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-purple-500/15 py-8 text-center" style={{ background: 'rgba(12,12,30,0.9)' }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <QrCode className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-semibold text-white">HashScan</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(196,181,253,0.4)' }}>Product information at a scan</p>
      </footer>
    </main>
  )
}
