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
import { LogOut, Plus, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { OWNER_EMAIL } from '@/lib/constants'

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

        // Check authentication — any logged-in user gets their own dashboard
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (!authUser) {
          router.push('/auth/login')
          return
        }

        setUser(authUser)

        // Load only this user's products
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
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb]">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1a2d5a] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f4f6fb]">
      {/* Header */}
      <header className="bg-[#1a2d5a] text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <span className="text-lg font-bold">D</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Admin Dashboard</h1>
              {user && (
                <p className="text-xs text-blue-200">{user.email}</p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase() && (
              <Link href="/owner">
                <button className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20">
                  <ShieldCheck className="h-4 w-4 text-blue-300" />
                  Owner Panel
                </button>
              </Link>
            )}
            <Link href="/">
              <button className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">
                View Site
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Form Section */}
          {isFormOpen && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-[#1a2d5a]">
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
              <h2 className="text-lg font-semibold text-[#1a2d5a]">
                Products{' '}
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-sm text-primary">
                  {products.length}
                </span>
              </h2>
              {!isFormOpen && (
                <Button
                  onClick={() => {
                    setSelectedProduct(null)
                    setIsFormOpen(true)
                  }}
                  className="gap-2 bg-[#1a2d5a] text-white hover:bg-[#1a2d5a]/90"
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
