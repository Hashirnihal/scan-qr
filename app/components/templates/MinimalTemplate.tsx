import Image from 'next/image'
import { QrCode, Layers } from 'lucide-react'
import { Product, SubItem } from '@/app/actions/products'

interface Props { product: Product; subItems: SubItem[] }

export default function MinimalTemplate({ product, subItems }: Props) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-200">
              <QrCode className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">HashScan</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 ring-1 ring-indigo-200">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-xs font-medium text-indigo-600">Product Info</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-gray-100 bg-gray-50 pb-16 pt-14">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <div className="animate-fade-up mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 ring-1 ring-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">{product.code}</span>
          </div>
          {product.image_url && (
            <div className="animate-fade-up mb-4 flex justify-center">
              <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-indigo-200 shadow-md">
                <Image src={product.image_url} alt={product.name} width={80} height={80} className="h-full w-full object-cover" />
              </div>
            </div>
          )}
          <h1 className="animate-fade-up-delay-1 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {product.name}
          </h1>
          {/* Underline accent */}
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-indigo-500" />
          <p className="animate-fade-up-delay-2 mt-4 text-base text-gray-500 sm:text-lg">
            Explore the collection below
          </p>
        </div>
      </div>

      {/* Products — full-width list style */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {subItems.length > 0 && (
          <section className="mb-14 space-y-6">
            {subItems.map((item, i) => (
              <div
                key={item.id}
                className={`animate-fade-up-delay-${Math.min(i + 1, 4)} group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md sm:flex-row`}
              >
                {/* Image — left side on desktop */}
                {item.image_url ? (
                  <div className="relative h-52 w-full shrink-0 overflow-hidden sm:h-auto sm:w-56">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex h-44 w-full shrink-0 items-center justify-center bg-gray-50 sm:h-auto sm:w-48">
                    <QrCode className="h-12 w-12 text-indigo-200" />
                  </div>
                )}
                {/* Content — right side */}
                <div className="flex flex-col justify-center p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                      Item {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  {item.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-500">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
        {subItems.length === 0 && product.description && (
          <div className="mb-14 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {product.image_url && (
              <div className="relative h-64 w-full overflow-hidden">
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
      <footer className="mt-8 border-t border-gray-100 bg-gray-50 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <QrCode className="h-4 w-4 text-indigo-400" />
          <span className="text-sm font-semibold text-gray-700">HashScan</span>
        </div>
        <p className="text-xs text-gray-400">Product information at a scan</p>
      </footer>
    </main>
  )
}
