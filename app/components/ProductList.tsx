'use client'

import { Product, SubItem } from '@/app/actions/products'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit2, MoreVertical, Trash2, Eye, Package } from 'lucide-react'
import { useState } from 'react'

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => Promise<void>
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (productId: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    ) {
      setDeleting(productId)
      try {
        await onDelete(productId)
      } finally {
        setDeleting(null)
      }
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-12 text-center shadow-sm">
        <Package className="mx-auto mb-4 h-12 w-12 text-primary/30" />
        <p className="font-medium text-foreground">No products yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first product to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const subItems = (product.custom_fields?.sub_items ?? []) as SubItem[]
        return (
          <Card
            key={product.id}
            className="overflow-hidden border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                {/* Thumbnail: show first sub-item image or placeholder */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {subItems[0]?.image_url ? (
                    <Image
                      src={subItems[0].image_url}
                      alt={subItems[0].name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-8 w-8 text-primary/40" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    Code: <span className="font-mono">{product.code}</span>
                  </p>
                  {subItems.length > 0 && (
                    <p className="mt-1 text-xs text-primary">
                      {subItems.length} item{subItems.length !== 1 ? 's' : ''}:{' '}
                      {subItems.map((s) => s.name).filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/p/${product.code}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deleting === product.id ? 'Deleting…' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
