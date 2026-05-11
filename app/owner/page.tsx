'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  getAllUsersWithProducts,
  ownerDeleteProduct,
  ownerUpdateProduct,
  ownerDeleteUser,
} from '@/app/actions/owner'
import { OWNER_EMAIL } from '@/lib/constants'
import type { UserRecord } from '@/lib/constants'
import { Product, SubItem } from '@/app/actions/products'
import { TEMPLATES } from '@/lib/templates'
import {
  Users,
  Package,
  ExternalLink,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  LogOut,
  ShieldCheck,
  X,
  Save,
  UserX,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { TemplatePicker } from '@/app/components/TemplatePicker'
import type { TemplateId } from '@/lib/templates'
import { ConfirmDialog } from '@/app/components/ConfirmDialog'

/* ── inline edit modal ── */
interface EditModalProps {
  product: Product
  onClose: () => void
  onSaved: () => void
}
function EditModal({ product, onClose, onSaved }: EditModalProps) {
  const subItems = (product.custom_fields?.sub_items ?? []) as SubItem[]
  const [name, setName] = useState(product.name)
  const [template, setTemplate] = useState<TemplateId>(
    ((product.custom_fields?.template as string) ?? 'navy') as TemplateId,
  )
  const [items, setItems] = useState<SubItem[]>(subItems)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateItem = (id: string, patch: Partial<SubItem>) =>
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await ownerUpdateProduct(product.id, {
        name,
        custom_fields: { sub_items: items, template },
      })
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-[#1a2d5a]">
          <div>
            <h2 className="text-lg font-bold text-white">Edit Product</h2>
            <p className="text-xs text-blue-200">{product.code}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {/* Product Name */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Product Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]"
            />
          </div>

          {/* Template */}
          <TemplatePicker value={template} onChange={setTemplate} />

          {/* Sub-items */}
          {items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Items</h3>
              {items.map((item, i) => (
                <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {item.image_url && (
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Item {i + 1}
                    </span>
                  </div>
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    placeholder="Item name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#1a2d5a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a2d5a]/90 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── User card ── */
function UserCard({
  record,
  onEdit,
  onDeleteProduct,
  onDeleteUser,
}: {
  record: UserRecord
  onEdit: (p: Product) => void
  onDeleteProduct: (p: Product) => void
  onDeleteUser: (r: UserRecord) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-blue-50/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a2d5a] text-white text-sm font-bold">
            {(record.email[0] ?? '?').toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a2d5a]">{record.email}</p>
            <p className="text-xs text-gray-400">
              {record.products.length} product{record.products.length !== 1 ? 's' : ''} ·{' '}
              Joined {new Date(record.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteUser(record) }}
            className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-100"
          >
            <UserX className="h-3.5 w-3.5" />
            Delete User
          </button>
          {open ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Products */}
      {open && (
        <div className="border-t border-blue-100 divide-y divide-blue-50">
          {record.products.length === 0 && (
            <p className="px-6 py-4 text-sm text-gray-400 italic">No products yet</p>
          )}
          {record.products.map((product) => {
            const templateLabel =
              TEMPLATES.find((t) => t.id === product.custom_fields?.template)?.name ??
              'Navy Classic'
            const subCount =
              (product.custom_fields?.sub_items as SubItem[] | undefined)?.length ?? 0

            return (
              <div
                key={product.id}
                className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-400">
                    {product.code} · {subCount} item{subCount !== 1 ? 's' : ''} ·{' '}
                    <span className="text-indigo-500">{templateLabel}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <Link
                    href={`/p/${product.code}`}
                    target="_blank"
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </Link>
                  <button
                    onClick={() => onEdit(product)}
                    className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs text-blue-700 hover:bg-blue-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product)}
                    className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Owner Dashboard ── */
export default function OwnerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserRecord[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Confirm dialog state
  const [confirm, setConfirm] = useState<{
    open: boolean
    title: string
    message: string
    confirmLabel: string
    onConfirm: () => void
  }>({ open: false, title: '', message: '', confirmLabel: 'Delete', onConfirm: () => {} })

  const closeConfirm = () => setConfirm((c) => ({ ...c, open: false }))

  const load = async () => {
    try {
      const data = await getAllUsersWithProducts()
      setUsers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Guard: must be the owner
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user || data.user.email?.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
        router.push('/auth/login')
        return
      }
      load()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDeleteProduct = (product: Product) => {
    setConfirm({
      open: true,
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete Product',
      onConfirm: async () => {
        closeConfirm()
        try {
          await ownerDeleteProduct(product.id)
          await load()
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Delete failed')
        }
      },
    })
  }

  const handleDeleteUser = (record: UserRecord) => {
    setConfirm({
      open: true,
      title: 'Delete User',
      message: `Are you sure you want to delete the user "${record.email}"? All their products will also be removed. This cannot be undone.`,
      confirmLabel: 'Delete User',
      onConfirm: async () => {
        closeConfirm()
        try {
          await ownerDeleteUser(record.id)
          await load()
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Delete failed')
        }
      },
    })
  }

  const totalProducts = users.reduce((s, u) => s + u.products.length, 0)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb]">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1a2d5a] border-t-transparent mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading owner panel…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb]">
        <div className="rounded-2xl bg-white p-8 text-center shadow-md">
          <ShieldCheck className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-600 font-semibold">{error}</p>
          <Link href="/portal" className="mt-4 inline-block text-sm text-[#1a2d5a] underline">
            Back to portal
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f4f6fb]">
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        onConfirm={confirm.onConfirm}
        onCancel={closeConfirm}
      />

      {/* Edit Modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={load}
        />
      )}

      {/* Header */}
      <header className="bg-[#1a2d5a] text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-blue-300" />
            <div>
              <h1 className="text-lg font-bold leading-none">Owner Panel</h1>
              <p className="text-xs text-blue-200">{OWNER_EMAIL}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/portal">
              <button className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">
                My Dashboard
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

      {/* Stats */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Users className="h-5 w-5 text-[#1a2d5a]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a2d5a]">{users.length}</p>
                <p className="text-xs text-gray-400">Total Users</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Package className="h-5 w-5 text-[#1a2d5a]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a2d5a]">{totalProducts}</p>
                <p className="text-xs text-gray-400">Total Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* User List */}
        <h2 className="mb-4 text-lg font-semibold text-[#1a2d5a]">All Users &amp; Products</h2>
        <div className="space-y-4">
          {users.length === 0 && (
            <p className="text-sm text-gray-400 italic">No registered users yet.</p>
          )}
          {users.map((record) => (
            <UserCard
              key={record.id}
              record={record}
              onEdit={setEditingProduct}
              onDeleteProduct={handleDeleteProduct}
              onDeleteUser={handleDeleteUser}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
