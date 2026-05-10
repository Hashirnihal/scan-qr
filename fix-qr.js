process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const QRCode = require('qrcode')
const { createClient } = require('@supabase/supabase-js')

// Load .env.local
const fs = require('fs')
if (fs.existsSync('.env.local')) {
  fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim()
  })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const APP_URL = 'https://qr-product-app.vercel.app'

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

async function fixQRCodes() {
  const { data: products, error } = await admin.from('products').select('id,code')
  if (error) { console.error('Error fetching products:', error); return }
  console.log('Found products:', products.map(p => p.code))

  for (const p of products) {
    const productUrl = APP_URL + '/p/' + p.code
    const qrDataUrl = await QRCode.toDataURL(productUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300,
    })
    const { error: updateError } = await admin
      .from('products')
      .update({ qr_code_url: qrDataUrl, updated_at: new Date().toISOString() })
      .eq('id', p.id)

    if (updateError) {
      console.error('Failed to update QR for', p.code, ':', updateError.message)
    } else {
      console.log('Fixed QR for', p.code, '→', productUrl)
    }
  }
  console.log('All done!')
}

fixQRCodes().catch(console.error)
