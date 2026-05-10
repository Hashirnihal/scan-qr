'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  deleteProduct,
  getAdminProducts,
  Product,
} from '@/app/actions/products'
import { Button } from '@/components/ui/button'
import { ProductList } from '@/app/components/ProductList'
import { ProductForm } from '@/app/components/ProductForm'
import { LogOut, Plus } from 'lucide-react'
import Link from 'next/link'

export default function PortalPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()

        // Check authentication
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (!authUser) {
          router.push('/auth/login')
          return
        }

        // Check if admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', authUser.id)
          .single()

        if (!profile?.is_admin) {
          router.push('/')
          return
        }

        setUser(authUser)

        // Load products
        const prods = await getAdminProducts()
        setProducts(prods)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleProductCreated = async () => {
    const prods = await getAdminProducts()
    setProducts(prods)
    setIsFormOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId)
    await handleProductCreated()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Product Dashboard
            </h1>
            {user && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline">View Public</Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Form Section */}
          {isFormOpen && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                {selectedProduct ? 'Edit Product' : 'Create New Product'}
              </h2>
              <ProductForm
                product={selectedProduct}
                onSuccess={handleProductCreated}
                onCancel={() => {
                  setIsFormOpen(false)
                  setSelectedProduct(null)
                }}
              />
            </div>
          )}

          {/* Products Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Products ({products.length})
              </h2>
              {!isFormOpen && (
                <Button
                  onClick={() => {
                    setSelectedProduct(null)
                    setIsFormOpen(true)
                  }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Product
                </Button>
              )}
            </div>

            <ProductList
              products={products}
              onEdit={(product) => {
                setSelectedProduct(product)
                setIsFormOpen(true)
              }}
              onDelete={handleDeleteProduct}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
