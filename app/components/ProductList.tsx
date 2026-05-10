'use client'

import { Product } from '@/app/actions/products'
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
import { Edit2, MoreVertical, Trash2, Eye } from 'lucide-react'
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
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No products yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              {product.image_url && (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Code: {product.code}
                </p>
                {product.description && (
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/p/${product.code}`}>
                <Button variant="outline" size="sm" className="gap-2">
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
                    {deleting === product.id ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
