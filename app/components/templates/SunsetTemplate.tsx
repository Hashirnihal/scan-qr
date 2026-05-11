import Image from 'next/image'
import { QrCode, Sun } from 'lucide-react'
import { Product, SubItem } from '@/app/actions/products'

interface Props { product: Product; subItems: SubItem[] }

export default function SunsetTemplate({ product, subItems }: Props) {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#fff7ed' }}>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-orange-300/30 shadow-sm" style={{ background: 'rgba(180,83,9,0.95)', backdropFilter: 'blur(8px)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-amber-300/40" style={{ background: 'rgba(251,191,36,0.2)' }}>
              <QrCode className="h-5 w-5 text-amber-200" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">HashScan</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1 ring-amber-300/30" style={{ background: 'rgba(251,191,36,0.15)' }}>
            <Sun className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-xs font-medium text-amber-200">Product Info</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden pb-24 pt-16" style={{ background: 'linear-gradient(135deg, #b45309 0%, #dc2626 100%)' }}>
        {/* Glow */}
        <div className="pointer-events-none absolute top-0 left-1/4 h-72 w-72 rounded-full blur-3xl" style={{ background: 'rgba(251,191,36,0.2)' }} />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full blur-3xl" style={{ background: 'rgba(220,38,38,0.25)' }} />
        {/* Sun ray lines */}
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.07) 40px, rgba(255,255,255,0.07) 41px)' }} />

        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/40 px-4 py-1.5" style={{ background: 'rgba(251,191,36,0.15)' }}>
            <Sun className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-200">{product.code}</span>
          </div>
          {product.image_url && (
            <div className="animate-fade-up mb-4 flex justify-center">
              <div className="h-20 w-20 overflow-hidden rounded-full shadow-xl" style={{ boxShadow: '0 0 0 4px rgba(251,191,36,0.4)' }}>
                <Image src={product.image_url} alt={product.name} width={80} height={80} className="h-full w-full object-cover" />
              </div>
            </div>
          )}
          <h1
            className="animate-fade-up-delay-1 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ textShadow: '0 2px 30px rgba(251,191,36,0.35)' }}
          >
            {product.name}
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 text-base sm:text-lg" style={{ color: 'rgba(254,215,170,0.8)' }}>
            Explore the collection below
          </p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px]">
            <path d="M0,35 C480,60 960,10 1440,40 L1440,60 L0,60 Z" fill="#fff7ed" />
          </svg>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {subItems.length > 0 && (
          <section className="mb-14">
            <div className="animate-fade-up mb-8 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: '#7c2d12' }}>Products</h2>
              <div className="mx-auto mt-2 h-1 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
            </div>
            <div className="grid gap-7 sm:grid-cols-2">
              {subItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`animate-fade-up-delay-${Math.min(i + 2, 4)} group overflow-hidden rounded-3xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  style={{ background: '#fffbeb', border: '1px solid #fde68a' }}
                >
                  {item.image_url ? (
                    <div className="relative h-60 w-full overflow-hidden sm:h-72" style={{ background: 'linear-gradient(135deg, #fef3c7, #fed7aa)' }}>
                      <Image src={item.image_url} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#b45309]/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center" style={{ background: 'linear-gradient(135deg, #fef3c7, #fed7aa)' }}>
                      <QrCode className="h-14 w-14 text-amber-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <h3 className="text-lg font-bold" style={{ color: '#7c2d12' }}>{item.name}</h3>
                    </div>
                    {item.description && (
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: '#92400e' }}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {subItems.length === 0 && product.description && (
          <div className="mb-14 overflow-hidden rounded-3xl shadow-md" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            {product.image_url && (
              <div className="relative h-64 w-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #fef3c7, #fed7aa)' }}>
                <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
              </div>
            )}
            <div className="p-8">
              <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: '#92400e' }}>{product.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-orange-200 py-8 text-center" style={{ background: '#b45309' }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <QrCode className="h-4 w-4 text-amber-300" />
          <span className="text-sm font-semibold text-white">HashScan</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(254,215,170,0.5)' }}>Product information at a scan</p>
      </footer>
    </main>
  )
}
