'use server'

import { createClient } from '@/lib/supabase/server'
import QRCode from 'qrcode'
import { revalidatePath, revalidateTag } from 'next/cache'

export interface SubItem {
  id: string
  name: string
  description: string
  image_url?: string
}

export interface Product {
  id: string
  code: string
  name: string
  description: string | null
  image_url: string | null
  custom_fields: { sub_items?: SubItem[] } & Record<string, unknown>
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
  imageUrl?: string
  customFields?: Record<string, unknown>
}

/**
 * Upload an image to Supabase Storage and return its public URL.
 * The base64 data URL from the client is decoded server-side.
 */
export async function uploadProductImage(
  base64DataUrl: string,
  fileName: string
): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Strip "data:image/...;base64," prefix
  const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/)
  if (!matches) throw new Error('Invalid image data')
  const mimeType = matches[1]
  const base64Data = matches[2]
  const buffer = Buffer.from(base64Data, 'base64')

  const ext = mimeType.split('/')[1] || 'png'
  const path = `${user.id}/${Date.now()}-${fileName}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, buffer, { contentType: mimeType, upsert: true })

  if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(path)

  return urlData.publicUrl
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

  // Generate QR code URL — prefer explicit APP_URL, fall back to VERCEL_URL (set automatically by Vercel)
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  const productUrl = `${baseUrl}/p/${input.code}`
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
      image_url: input.imageUrl || null,
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

/**
 * Regenerate the QR code for a product using the current APP_URL.
 * Call this to fix products whose QR still points to localhost.
 */
export async function regenerateProductQR(productId: string, productCode: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  const productUrl = `${baseUrl}/p/${productCode}`
  const qrCodeUrl = await QRCode.toDataURL(productUrl, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 0.95,
    margin: 1,
    width: 300,
  })

  const { error } = await supabase
    .from('products')
    .update({ qr_code_url: qrCodeUrl, updated_at: new Date().toISOString() })
    .eq('id', productId)

  if (error) throw new Error(`Failed to regenerate QR: ${error.message}`)
  revalidateTag('products')
  return qrCodeUrl
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

  // Update product (RLS ensures user can only update their own)
  const { data: product, error: updateError } = await supabase
    .from('products')
    .update({
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description || null }),
      ...(input.imageUrl !== undefined && { image_url: input.imageUrl || null }),
      ...(input.customFields !== undefined && { custom_fields: input.customFields }),
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

  // Soft delete by archiving (RLS ensures user can only delete their own)
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
