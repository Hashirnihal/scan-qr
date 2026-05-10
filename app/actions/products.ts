'use server'

import { createClient } from '@/lib/supabase/server'
import QRCode from 'qrcode'
import { revalidatePath, revalidateTag } from 'next/cache'

export interface Product {
  id: string
  code: string
  name: string
  description: string | null
  image_url: string | null
  custom_fields: Record<string, unknown>
  qr_code_url: string | null
  created_by: string
  created_at: string
  updated_at: string
  archived: boolean
}

export interface CreateProductInput {
  code: string
  name: string
  description?: string
  customFields?: Record<string, unknown>
}

export async function createProduct(input: CreateProductInput) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    throw new Error('Only admins can create products')
  }

  // Generate QR code URL
  const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${input.code}`
  const qrCodeUrl = await QRCode.toDataURL(productUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 0.95,
    margin: 1,
    width: 300,
  })

  // Create product
  const { data: product, error: createError } = await supabase
    .from('products')
    .insert({
      code: input.code,
      name: input.name,
      description: input.description || null,
      custom_fields: input.customFields || {},
      qr_code_url: qrCodeUrl,
      created_by: user.id,
    })
    .select()
    .single()

  if (createError) {
    throw new Error(`Failed to create product: ${createError.message}`)
  }

  revalidateTag('products')
  return product
}

export async function updateProduct(
  productId: string,
  input: Partial<CreateProductInput>
) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    throw new Error('Only admins can update products')
  }

  // Update product
  const { data: product, error: updateError } = await supabase
    .from('products')
    .update({
      ...(input.name && { name: input.name }),
      ...(input.description && { description: input.description }),
      ...(input.customFields && { custom_fields: input.customFields }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select()
    .single()

  if (updateError) {
    throw new Error(`Failed to update product: ${updateError.message}`)
  }

  revalidateTag('products')
  return product
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    throw new Error('Only admins can delete products')
  }

  // Soft delete by archiving
  const { error: deleteError } = await supabase
    .from('products')
    .update({ archived: true })
    .eq('id', productId)

  if (deleteError) {
    throw new Error(`Failed to delete product: ${deleteError.message}`)
  }

  revalidateTag('products')
}

export async function getProduct(code: string) {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('code', code)
    .eq('archived', false)
    .single()

  if (error || !product) {
    return null
  }

  return product as Product
}

export async function getProducts() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return products as Product[]
}

export async function getAdminProducts() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return products as Product[]
}
