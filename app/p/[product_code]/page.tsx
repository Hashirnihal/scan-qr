import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProduct, SubItem } from '@/app/actions/products'
import NavyTemplate from '@/app/components/templates/NavyTemplate'
import MidnightTemplate from '@/app/components/templates/MidnightTemplate'
import ForestTemplate from '@/app/components/templates/ForestTemplate'
import SunsetTemplate from '@/app/components/templates/SunsetTemplate'
import MinimalTemplate from '@/app/components/templates/MinimalTemplate'

interface ProductPageProps {
  params: Promise<{ product_code: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { product_code } = await params
  const product = await getProduct(product_code)
  if (!product) return { title: 'Product Not Found' }
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
  const templateId = (product.custom_fields?.template as string | undefined) ?? 'navy'
  const props = { product, subItems }

  switch (templateId) {
    case 'midnight': return <MidnightTemplate {...props} />
    case 'forest':   return <ForestTemplate {...props} />
    case 'sunset':   return <SunsetTemplate {...props} />
    case 'minimal':  return <MinimalTemplate {...props} />
    default:         return <NavyTemplate {...props} />
  }
}
