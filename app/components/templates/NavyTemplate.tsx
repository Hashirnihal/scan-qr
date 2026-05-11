import Image from 'next/image'
import { QrCode, Sparkles } from 'lucide-react'
import { Product, SubItem } from '@/app/actions/products'

interface Props { product: Product; subItems: SubItem[] }

export default function NavyTemplate({ product, subItems }: Props) {
  return (
    <main className="min-h-screen bg-[#f0f4ff] overflow-x-hidden">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#1a2d5a]/95 backdrop-blur-md border-b border-white/10 shadow-lg animate-fade-in">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur ring-1 ring-white/20">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">HashScan</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span className="text-xs font-medium text-blue-200">Product Info</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative bg-[#1a2d5a] pb-24 pt-16 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-2xl" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          
          {!product.image_url && (
            <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-4 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-300" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">{product.code}</span>
          </div>
          )}
          {product.image_url && (
            <div className="animate-fade-up mb-4 flex justify-center">
              <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-white/30 shadow-xl">
                <Image src={product.image_url} alt={product.name} width={80} height={80} className="h-full w-full object-cover" />
              </div>
            </div>
          )}
          <h1 className="animate-fade-up-delay-1 shimmer-text text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {product.name}
          </h1>
          <p className="animate-fade-up-delay-2 mt-4 text-base text-blue-300/80 sm:text-lg">
            Explore the products below
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px]">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f0f4ff" />
          </svg>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {subItems.length > 0 && (
          <section className="mb-14">
            <div className="animate-fade-up mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#1a2d5a] sm:text-3xl">Products</h2>
              <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
            </div>
            <div className="grid gap-7 sm:grid-cols-2">
              {subItems.map((item, i) => (
                <div key={item.id} className={`card-hover animate-fade-up-delay-${Math.min(i + 2, 4)} group overflow-hidden rounded-3xl border border-blue-100/80 bg-white shadow-md`}>
                  {item.image_url ? (
                    <div className="img-zoom relative h-60 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 sm:h-72">
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" priority />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2d5a]/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                      <QrCode className="h-16 w-16 text-blue-200" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-1 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <h3 className="text-lg font-bold text-[#1a2d5a]">{item.name}</h3>
                    </div>
                    {item.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-500">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {subItems.length === 0 && product.description && (
          <div className="animate-scale-in mb-14 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-md">
            {product.image_url && (
              <div className="img-zoom relative h-64 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
              </div>
            )}
            <div className="p-8">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{product.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-blue-900/20 bg-[#1a2d5a] py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <QrCode className="h-4 w-4 text-blue-300" />
          <span className="text-sm font-semibold text-white">HashScan</span>
        </div>
        <p className="text-xs text-blue-300/60">Product information at a scan</p>
      </footer>
    </main>
  )
}
