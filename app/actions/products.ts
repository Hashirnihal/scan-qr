'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import QRCode from 'qrcode'
import { revalidatePath } from 'next/cache'

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
  custom_fields: { sub_items?: SubItem[]; template?: string } & Record<string, unknown>
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
): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const service = createServiceClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/)
    if (!matches) return { error: 'Invalid image data' }
    const mimeType = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')

    const ext = mimeType.split('/')[1] || 'png'
    const path = `${user.id}/${Date.now()}-${fileName}.${ext}`

    // Use service client for storage upload to bypass RLS
    const { error: uploadError } = await service.storage
      .from('product-images')
      .upload(path, buffer, { contentType: mimeType, upsert: true })

    if (uploadError) return { error: `Image upload failed: ${uploadError.message}` }

    const { data: urlData } = service.storage
      .from('product-images')
      .getPublicUrl(path)

    return { url: urlData.publicUrl }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload failed' }
  }
}

export async function createProduct(input: CreateProductInput): Promise<{ product?: Product; error?: string }> {
  try {
    const supabase = await createClient()
    const service = createServiceClient()

    // Verify auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    // Generate QR code
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://hashscan-psi.vercel.app')
    const productUrl = `${baseUrl}/p/${input.code}`
    const qrCodeUrl = await QRCode.toDataURL(productUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
    })

    // Insert using service client (bypasses RLS; auth already verified above)
    const { data: product, error: createError } = await service
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

    if (createError) return { error: `Failed to create product: ${createError.message}` }

    revalidatePath('/portal')
    return { product: product as Product }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to create product' }
  }
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
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://hashscan-psi.vercel.app')
  const productUrl = `${baseUrl}/p/${productCode}`
  const qrCodeUrl = await QRCode.toDataURL(productUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
  })

  const { error } = await supabase
    .from('products')
    .update({ qr_code_url: qrCodeUrl, updated_at: new Date().toISOString() })
    .eq('id', productId)

  if (error) throw new Error(`Failed to regenerate QR: ${error.message}`)
  revalidatePath('/portal')
  return qrCodeUrl
}

export async function updateProduct(
  productId: string,
  input: Partial<CreateProductInput>
): Promise<{ product?: Product; error?: string }> {
  try {
    const supabase = await createClient()
    const service = createServiceClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Unauthorized' }

    const { data: product, error: updateError } = await service
      .from('products')
      .update({
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description || null }),
        ...(input.imageUrl !== undefined && { image_url: input.imageUrl || null }),
        ...(input.customFields !== undefined && { custom_fields: input.customFields }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .eq('created_by', user.id)   // enforce ownership even with service client
      .select()
      .single()

    if (updateError) return { error: `Failed to update product: ${updateError.message}` }

    revalidatePath('/portal')
    return { product: product as Product }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to update product' }
  }
}

export async function deleteProduct(productId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const service = createServiceClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) return { error: 'Unauthorized' }

  // Use service client to bypass RLS, but restrict to the user's own products
  const { error: deleteError } = await service
    .from('products')
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .eq('created_by', user.id)

  if (deleteError) return { error: `Failed to delete product: ${deleteError.message}` }

  revalidatePath('/portal')
  return {}
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
