'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Product } from '@/app/actions/products'
import { revalidateTag } from 'next/cache'
import { OWNER_EMAIL } from '@/lib/constants'
import type { UserRecord } from '@/lib/constants'

async function assertOwner() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user || user.email?.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
    throw new Error('Unauthorized')
  }
  return user
}

/** Return every user + their products. Owner-only. */
export async function getAllUsersWithProducts(): Promise<UserRecord[]> {
  await assertOwner()

  const service = createServiceClient()

  // Fetch all non-archived products
  const { data: products, error: prodErr } = await service
    .from('products')
    .select('*')
    .eq('archived', false)
    .order('created_at', { ascending: false })
  if (prodErr) throw new Error(prodErr.message)

  // Fetch all auth users (service role only)
  const { data: usersData, error: userErr } = await service.auth.admin.listUsers()
  if (userErr) throw new Error(userErr.message)

  return usersData.users.map((u) => ({
    id: u.id,
    email: u.email ?? 'unknown',
    created_at: u.created_at,
    products: (products ?? []).filter((p) => p.created_by === u.id) as Product[],
  }))
}

/** Owner can update any product (bypasses RLS). */
export async function ownerUpdateProduct(
  productId: string,
  patch: Partial<{
    name: string
    description: string | null
    custom_fields: Record<string, unknown>
  }>,
) {
  await assertOwner()

  const service = createServiceClient()
  const { data, error } = await service
    .from('products')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidateTag('products')
  return data as Product
}

/** Owner can delete (archive) any product. */
export async function ownerDeleteProduct(productId: string) {
  await assertOwner()
  const service = createServiceClient()
  const { error } = await service
    .from('products')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('id', productId)
  if (error) throw new Error(error.message)
  revalidateTag('products')
}
