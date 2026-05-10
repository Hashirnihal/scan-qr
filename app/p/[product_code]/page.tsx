import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProduct, SubItem } from '@/app/actions/products'
import { Download, QrCode } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ product_code: string }>
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const { product_code } = await params
  const product = await getProduct(product_code)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.name,
    description: `Scan to view ${product.name} product details`,
    openGraph: {
      title: product.name,
      description: `Scan to view ${product.name} product details`,
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product_code } = await params
  const product = await getProduct(product_code)

  if (!product) notFound()

  const subItems = (product.custom_fields?.sub_items ?? []) as SubItem[]

  return (
    <main className="min-h-screen bg-[#f4f6fb]">
      {/* Header Bar */}
      <header className="bg-[#1a2d5a] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <QrCode className="h-7 w-7 text-white/80" />
            <span className="text-lg font-bold tracking-wide">ScanQR</span>
          </div>
          <span className="text-sm text-white/60">Product Information</span>
        </div>
      </header>

      {/* Hero banner */}
      <div className="bg-[#1a2d5a]">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-blue-200">
            Scan the QR code below or share this page
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

        {/* Product Items Grid */}
        {subItems.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-6 text-center text-xl font-semibold text-[#1a2d5a]">
              Products
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {subItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md"
                >
                  {/* Item Image */}
                  {item.image_url && (
                    <div className="relative h-56 w-full bg-blue-50 sm:h-64">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  {/* Item Info */}
                  <div className="p-6">
                    <h3 className="mb-3 text-lg font-bold text-[#1a2d5a]">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback: single product description (old format) */}
        {subItems.length === 0 && product.description && (
          <div className="mb-10 rounded-2xl border border-blue-100 bg-white p-8 shadow-md">
            {product.image_url && (
              <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl bg-blue-50">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>
          </div>
        )}

        {/* QR Code Card */}
        {product.qr_code_url && (
          <div className="mx-auto max-w-sm rounded-2xl border border-blue-100 bg-white p-8 shadow-md text-center">
            <h3 className="mb-1 text-base font-semibold text-[#1a2d5a]">
              QR Code
            </h3>
            <p className="mb-5 text-xs text-gray-500">
              Scan to share this product page
            </p>
            <div className="mx-auto mb-5 flex h-48 w-48 items-center justify-center rounded-xl bg-blue-50 p-2">
              <Image
                src={product.qr_code_url}
                alt="Product QR Code"
                width={176}
                height={176}
                className="object-contain"
              />
            </div>
            <a
              href={product.qr_code_url}
              download={`${product.code}-qr.png`}
            >
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a2d5a] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                <Download className="h-4 w-4" />
                Download QR Code
              </button>
            </a>
          </div>
        )}

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-gray-400">
          Product Code: <span className="font-mono">{product.code}</span>
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-8 bg-[#1a2d5a] py-6 text-center text-xs text-blue-200">
        Powered by ScanQR &mdash; Product information at a scan
      </footer>
    </main>
  )
}
