'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Product } from '@/app/actions/products'
import { revalidatePath } from 'next/cache'
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
export async function getAllUsersWithProducts(): Promise<{ data?: UserRecord[]; error?: string }> {
  try {
    await assertOwner()
  } catch {
    return { error: 'Unauthorized' }
  }

  const service = createServiceClient()

  // Fetch all non-archived products
  const { data: products, error: prodErr } = await service
    .from('products')
    .select('*')
    .eq('archived', false)
    .order('created_at', { ascending: false })
  if (prodErr) return { error: prodErr.message }

  // Fetch all auth users (service role only)
  const { data: usersData, error: userErr } = await service.auth.admin.listUsers()
  if (userErr) return { error: userErr.message }

  return {
    data: usersData.users.map((u) => ({
      id: u.id,
      email: u.email ?? 'unknown',
      created_at: u.created_at,
      products: (products ?? []).filter((p) => p.created_by === u.id) as Product[],
    }))
  }
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
  revalidatePath('/owner')
  return data as Product
}

/** Owner can delete (archive) any product. */
export async function ownerDeleteProduct(productId: string): Promise<{ error?: string }> {
  try { await assertOwner() } catch { return { error: 'Unauthorized' } }
  const service = createServiceClient()
  const { error } = await service
    .from('products')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('id', productId)
  if (error) return { error: error.message }
  revalidatePath('/owner')
  return {}
}

/** Owner can permanently delete a user (and their products). */
export async function ownerDeleteUser(userId: string): Promise<{ error?: string }> {
  try { await assertOwner() } catch { return { error: 'Unauthorized' } }
  const service = createServiceClient()

  // Archive all their products first
  await service
    .from('products')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('created_by', userId)

  // Delete the auth user
  const { error } = await service.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  revalidatePath('/owner')
  return {}
}
