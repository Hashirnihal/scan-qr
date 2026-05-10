/**
 * One-time database setup script.
 * Run with: node setup-db.js
 * 
 * Creates all tables, RLS policies, storage bucket, and the digitalInn admin user profile.
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Load credentials from .env.local
const fs = require('fs')
const envPath = '.env.local'
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...val] = line.split('=')
    if (key && val.length) process.env[key.trim()] = val.join('=').trim()
  })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const PROJECT_REF  = SUPABASE_URL ? new URL(SUPABASE_URL).hostname.split('.')[0] : ''
const DIGITALINN_USER_ID = '57e45b5c-d55b-4056-8eee-e39d70f954b7'

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal',
}

async function runSQL(sql, description) {
  console.log(`\n→ ${description}...`)
  try {
    // Use Supabase Management API to run SQL
    const resp = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    })
    if (resp.ok) {
      console.log(`  ✓ Done`)
      return true
    }
    const err = await resp.text()
    console.log(`  ⚠ Management API failed (${resp.status}): ${err.substring(0, 200)}`)
    return false
  } catch (e) {
    console.log(`  ✗ Error: ${e.message}`)
    return false
  }
}

async function setup() {
  console.log('=== QR Product App — Database Setup ===\n')

  // 1. Create profiles table
  await runSQL(`
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT,
      username TEXT UNIQUE,
      is_admin BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY IF NOT EXISTS "Users can view own profile"
      ON public.profiles FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY IF NOT EXISTS "Users can update own profile"
      ON public.profiles FOR UPDATE USING (auth.uid() = id);
      
    CREATE INDEX IF NOT EXISTS profiles_username_lower_idx ON public.profiles (lower(username));
  `, 'Create profiles table + RLS')

  // 2. Create products table
  await runSQL(`
    CREATE TABLE IF NOT EXISTS public.products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      custom_fields JSONB DEFAULT '{}'::jsonb,
      qr_code_url TEXT,
      created_by UUID REFERENCES auth.users(id),
      archived BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY IF NOT EXISTS "Admins can manage own products"
      ON public.products FOR ALL USING (auth.uid() = created_by);
    
    CREATE POLICY IF NOT EXISTS "Anyone can view non-archived products"
      ON public.products FOR SELECT USING (archived = false);
  `, 'Create products table + RLS')

  // 3. Create trigger for new users
  await runSQL(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, username, is_admin)
      VALUES (
        NEW.id,
        NEW.email,
        split_part(NEW.email, '@', 1),
        false
      )
      ON CONFLICT (id) DO UPDATE
        SET email    = EXCLUDED.email,
            username = COALESCE(profiles.username, EXCLUDED.username);
      RETURN NEW;
    END;
    $$;
    
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `, 'Create auto-profile trigger')

  // 4. Insert digitalInn profile as admin
  await runSQL(`
    INSERT INTO public.profiles (id, email, username, is_admin)
    VALUES (
      '${DIGITALINN_USER_ID}',
      'digitalinn@digitalinn.com',
      'digitalInn',
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      username = 'digitalInn',
      email = 'digitalinn@digitalinn.com',
      is_admin = true;
  `, 'Create digitalInn admin profile')

  // 5. Create storage bucket
  console.log('\n→ Creating product-images storage bucket...')
  try {
    const resp = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id: 'product-images', name: 'product-images', public: true }),
    })
    const data = await resp.text()
    if (resp.ok || data.includes('already exists') || data.includes('Duplicate')) {
      console.log('  ✓ Bucket ready')
    } else {
      console.log(`  ⚠ Bucket: ${data.substring(0, 200)}`)
    }
  } catch (e) {
    console.log(`  ✗ Bucket error: ${e.message}`)
  }

  // 6. Storage policies via SQL
  await runSQL(`
    CREATE POLICY IF NOT EXISTS "Auth users can upload"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'product-images');

    CREATE POLICY IF NOT EXISTS "Public read images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'product-images');
      
    CREATE POLICY IF NOT EXISTS "Auth users can update own uploads"
      ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'product-images');
      
    CREATE POLICY IF NOT EXISTS "Auth users can delete own uploads"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'product-images');
  `, 'Set storage policies')

  console.log('\n=== Setup complete! ===')
  console.log('Login: digitalInn / digitalInn')
  console.log('URL: http://localhost:3000/auth/login')
}

setup().catch(console.error)
