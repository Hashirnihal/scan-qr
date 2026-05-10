'use client'

import { Product, createProduct, updateProduct } from '@/app/actions/products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { X } from 'lucide-react'

interface ProductFormProps {
  product?: Product | null
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: product?.code || '',
    name: product?.name || '',
    description: product?.description || '',
    customFields: (product?.custom_fields as Record<string, string>) || {},
  })

  const [newFieldName, setNewFieldName] = useState('')
  const [newFieldValue, setNewFieldValue] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (product) {
        await updateProduct(product.id, {
          code: formData.code,
          name: formData.name,
          description: formData.description || undefined,
          customFields: formData.customFields,
        })
      } else {
        await createProduct({
          code: formData.code,
          name: formData.name,
          description: formData.description || undefined,
          customFields: formData.customFields,
        })
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addCustomField = () => {
    if (newFieldName.trim() && newFieldValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [newFieldName]: newFieldValue,
        },
      }))
      setNewFieldName('')
      setNewFieldValue('')
    }
  }

  const removeCustomField = (fieldName: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: Object.fromEntries(
        Object.entries(prev.customFields).filter(([key]) => key !== fieldName)
      ),
    }))
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Product Code *
          </label>
          <Input
            type="text"
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
            placeholder="e.g., PROD001"
            disabled={!!product}
            required
          />
          {product && (
            <p className="text-xs text-muted-foreground">
              Product code cannot be changed
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Product Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g., Premium Widget"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Product description..."
            className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Custom Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Custom Fields
            </label>
            <p className="text-xs text-muted-foreground">
              Add additional information fields
            </p>
          </div>

          {Object.entries(formData.customFields).map(([fieldName, value]) => (
            <div key={fieldName} className="flex gap-2">
              <div className="flex-1">
                <Input value={fieldName} disabled />
              </div>
              <div className="flex-1">
                <Input value={value} disabled />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCustomField(fieldName)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2">
            <Input
              placeholder="Field name"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
            />
            <Input
              placeholder="Field value"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomField()
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addCustomField}
              disabled={!newFieldName.trim() || !newFieldValue.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading
              ? 'Saving...'
              : product
                ? 'Update Product'
                : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
