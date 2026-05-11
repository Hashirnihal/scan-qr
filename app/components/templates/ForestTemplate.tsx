import Image from 'next/image'
import { QrCode, Leaf } from 'lucide-react'
import { Product, SubItem } from '@/app/actions/products'

interface Props { product: Product; subItems: SubItem[] }

export default function ForestTemplate({ product, subItems }: Props) {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#f0fdf4' }}>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-emerald-900/20 shadow-sm" style={{ background: 'rgba(20,67,42,0.97)', backdropFilter: 'blur(8px)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-emerald-400/30" style={{ background: 'rgba(16,185,129,0.2)' }}>
              <QrCode className="h-5 w-5 text-emerald-300" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">HashScan</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1 ring-emerald-400/25" style={{ background: 'rgba(16,185,129,0.12)' }}>
            <Leaf className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">Product Info</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden pb-24 pt-16" style={{ background: '#14432a' }}>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl" style={{ background: 'rgba(16,185,129,0.15)' }} />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-80 w-80 rounded-full blur-3xl" style={{ background: 'rgba(6,78,59,0.5)' }} />
        {/* Hexagonal texture dots */}
        <div className="pointer-events-none absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 px-4 py-1.5" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <Leaf className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">{product.code}</span>
          </div>
          <h1
            className="animate-fade-up-delay-1 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ textShadow: '0 2px 20px rgba(16,185,129,0.3)' }}
          >
            {product.name}
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 text-base sm:text-lg" style={{ color: 'rgba(167,243,208,0.75)' }}>
            Explore the collection below
          </p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px]">
            <path d="M0,20 C360,55 1080,5 1440,35 L1440,60 L0,60 Z" fill="#f0fdf4" />
          </svg>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {subItems.length > 0 && (
          <section className="mb-14">
            <div className="animate-fade-up mb-8 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: '#14432a' }}>Products</h2>
              <div className="mx-auto mt-2 h-1 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
            </div>
            <div className="grid gap-7 sm:grid-cols-2">
              {subItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`animate-fade-up-delay-${Math.min(i + 2, 4)} group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  style={{ border: '1px solid #a7f3d0' }}
                >
                  {item.image_url ? (
                    <div className="relative h-60 w-full overflow-hidden sm:h-72" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                      <Image src={item.image_url} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14432a]/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                      <QrCode className="h-14 w-14 text-emerald-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <h3 className="text-lg font-bold" style={{ color: '#14432a' }}>{item.name}</h3>
                    </div>
                    {item.description && (
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: '#4b7c5f' }}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {subItems.length === 0 && product.description && (
          <div className="mb-14 overflow-hidden rounded-3xl bg-white shadow-md" style={{ border: '1px solid #a7f3d0' }}>
            {product.image_url && (
              <div className="relative h-64 w-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
              </div>
            )}
            <div className="p-8">
              <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: '#4b7c5f' }}>{product.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-emerald-900/20 py-8 text-center" style={{ background: '#14432a' }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <QrCode className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-semibold text-white">HashScan</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(167,243,208,0.45)' }}>Product information at a scan</p>
      </footer>
    </main>
  )
}
