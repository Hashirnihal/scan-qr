import { Metadata, MetadataRoute } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProduct } from '@/app/actions/products'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'

interface ProductPageProps {
  params: Promise<{ product_code: string }>
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const { product_code } = await params
  const product = await getProduct(product_code)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'This product could not be found',
    }
  }

  return {
    title: product.name,
    description: product.description || 'Product information',
    openGraph: {
      title: product.name,
      description: product.description || 'Product information',
      images: product.image_url ? [{ url: product.image_url }] : [],
      type: 'website',
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product_code } = await params
  const product = await getProduct(product_code)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <div className="w-[60px]" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            {product.image_url && (
              <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* QR Code Section */}
            {product.qr_code_url && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold text-foreground">QR Code</h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-48 w-48">
                    <Image
                      src={product.qr_code_url}
                      alt="Product QR Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <a
                    href={product.qr_code_url}
                    download={`${product.code}-qr.png`}
                    className="w-full"
                  >
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Download QR Code
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Description
                </h2>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}

            {/* Custom Fields */}
            {Object.keys(product.custom_fields || {}).length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Details
                </h2>
                <div className="space-y-3">
                  {Object.entries(product.custom_fields || {}).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border border-border bg-muted/50 p-4"
                      >
                        <p className="text-sm font-medium text-muted-foreground">
                          {key}
                        </p>
                        <p className="mt-1 text-foreground">
                          {String(value)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Product Code */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Product Code
              </p>
              <p className="mt-1 font-mono text-foreground">{product.code}</p>
            </div>

            {/* Timestamps */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Created: {new Date(product.created_at).toLocaleDateString()}
              </p>
              <p>
                Updated: {new Date(product.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
