'use client'

import {
  Product,
  SubItem,
  createProduct,
  updateProduct,
  uploadProductImage,
} from '@/app/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useState, useRef } from 'react'
import { Plus, ImageIcon, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface ProductFormProps {
  product?: Product | null
  onSuccess: () => void
  onCancel: () => void
}

interface SubItemDraft extends SubItem {
  pendingFile?: File
  previewUrl?: string
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const existingSubItems: SubItemDraft[] =
    (product?.custom_fields?.sub_items as SubItem[] | undefined)?.map((s) => ({
      ...s,
      previewUrl: s.image_url,
    })) ?? []

  const [code, setCode] = useState(product?.code ?? '')
  const [name, setName] = useState(product?.name ?? '')
  const [subItems, setSubItems] = useState<SubItemDraft[]>(
    existingSubItems.length > 0
      ? existingSubItems
      : [
          { id: 'item-1', name: '', description: '' },
          { id: 'item-2', name: '', description: '' },
        ]
  )

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const updateSubItem = (id: string, patch: Partial<SubItemDraft>) => {
    setSubItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    )
  }

  const addSubItem = () => {
    setSubItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}`, name: '', description: '' },
    ])
  }

  const removeSubItem = (id: string) => {
    setSubItems((prev) => prev.filter((s) => s.id !== id))
  }

  const handleFileChange = async (id: string, file: File | null) => {
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    updateSubItem(id, { pendingFile: file, previewUrl })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !name.trim()) {
      setError('Product code and name are required.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const resolvedItems: SubItem[] = await Promise.all(
        subItems.map(async (item) => {
          let imageUrl = item.image_url
          if (item.pendingFile) {
            const dataUrl = await readFileAsDataUrl(item.pendingFile)
            imageUrl = await uploadProductImage(dataUrl, item.name || 'image')
          }
          return {
            id: item.id,
            name: item.name,
            description: item.description,
            image_url: imageUrl,
          }
        })
      )

      const payload = {
        code: code.trim(),
        name: name.trim(),
        customFields: { sub_items: resolvedItems },
      }

      if (product) {
        await updateProduct(product.id, payload)
      } else {
        await createProduct(payload)
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-border bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Product Code */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">
            Product Code <span className="text-destructive">*</span>
          </label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g., DIGITALINN-001"
            disabled={!!product}
            required
            className="bg-secondary/40"
          />
          {product && (
            <p className="text-xs text-muted-foreground">Code cannot be changed</p>
          )}
        </div>

        {/* Product Name */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">
            Product Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., DigitalInn Product 1"
            required
            className="bg-secondary/40"
          />
          <p className="text-xs text-muted-foreground">
            This name appears on the QR landing page
          </p>
        </div>

        {/* Sub-Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Product Items</h3>
              <p className="text-xs text-muted-foreground">
                Each item is displayed on the public QR page
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSubItem}
              className="gap-1 border-primary/40 text-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          {subItems.map((item, idx) => (
            <Card
              key={item.id}
              className="relative space-y-4 border border-border/60 bg-secondary/20 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Item {idx + 1}
                </span>
                {subItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubItem(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Image + Fields */}
              <div className="flex gap-4">
                <div
                  className="flex h-28 w-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-secondary/50 hover:border-primary/50"
                  onClick={() => fileInputRefs.current[item.id]?.click()}
                >
                  {item.previewUrl ? (
                    <Image
                      src={item.previewUrl}
                      alt="preview"
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs">Upload</span>
                    </div>
                  )}
                </div>
                <input
                  ref={(el) => { fileInputRefs.current[item.id] = el }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(item.id, e.target.files?.[0] ?? null)
                  }
                />
                <div className="flex flex-1 flex-col gap-3">
                  <Input
                    placeholder="Item name (e.g., DNAXO Wireless Headphones)"
                    value={item.name}
                    onChange={(e) => updateSubItem(item.id, { name: e.target.value })}
                    className="bg-white"
                  />
                  <textarea
                    placeholder="Description…"
                    value={item.description}
                    onChange={(e) =>
                      updateSubItem(item.id, { description: e.target.value })
                    }
                    rows={3}
                    className="w-full resize-none rounded-md border border-input bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? 'Saving…' : product ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
