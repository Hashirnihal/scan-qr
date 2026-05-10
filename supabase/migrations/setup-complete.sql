-- ================================================================
-- QR Product App - Complete Database Setup
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT UNIQUE,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Allow service role to bypass RLS (needed for username lookup)
DROP POLICY IF EXISTS "Service role full access profiles" ON public.profiles;
CREATE POLICY "Service role full access profiles"
  ON public.profiles FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS profiles_username_lower_idx ON public.profiles (lower(username));

-- 2. PRODUCTS TABLE
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

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Public can view non-archived products" ON public.products;
CREATE POLICY "Public can view non-archived products"
  ON public.products FOR SELECT USING (archived = false);

-- 3. AUTO-PROFILE TRIGGER (runs when a new user signs up)
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

-- 4. CREATE digitalInn ADMIN PROFILE
-- (User already exists in auth.users with ID: 57e45b5c-d55b-4056-8eee-e39d70f954b7)
INSERT INTO public.profiles (id, email, username, is_admin)
VALUES (
  '57e45b5c-d55b-4056-8eee-e39d70f954b7',
  'digitalinn@digitalinn.com',
  'digitalInn',
  true
)
ON CONFLICT (id) DO UPDATE SET
  email    = EXCLUDED.email,
  username = EXCLUDED.username,
  is_admin = true;

-- 5. STORAGE POLICIES (bucket 'product-images' already created)
DROP POLICY IF EXISTS "Auth users can upload product images" ON storage.objects;
CREATE POLICY "Auth users can upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
CREATE POLICY "Public read access for product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Auth users can update images" ON storage.objects;
CREATE POLICY "Auth users can update images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Auth users can delete images" ON storage.objects;
CREATE POLICY "Auth users can delete images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- Done!
SELECT 'Setup complete! Login: digitalInn / digitalInn' AS message;
