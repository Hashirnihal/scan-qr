-- ============================================================
-- Migration: Add username & email support to profiles
-- Run this in your Supabase SQL editor (Database > SQL Editor)
-- ============================================================

-- 1. Add username and email columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS email    TEXT;

-- 2. Index for fast username lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS profiles_username_lower_idx
  ON public.profiles (lower(username));

-- 3. Trigger function: auto-populate email & username when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    split_part(NEW.email, '@', 1),  -- default username = part before @
    false
  )
  ON CONFLICT (id) DO UPDATE
    SET email    = EXCLUDED.email,
        username = COALESCE(profiles.username, EXCLUDED.username);
  RETURN NEW;
END;
$$;

-- 4. Attach trigger to auth.users (fires on every new signup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- After running the migration:
--
-- To set the username for the existing digitalInn user, run:
--
--   UPDATE public.profiles
--   SET username = 'digitalInn',
--       email    = 'YOUR_USER_EMAIL_HERE'   -- replace with actual email
--   WHERE id = (
--     SELECT id FROM auth.users WHERE email = 'YOUR_USER_EMAIL_HERE'
--   );
--
-- ============================================================

-- 5. Create the Supabase Storage bucket for product images
-- (If it doesn't exist yet — you can also do this via the Supabase Dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policy: authenticated users can upload
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- 7. Storage policy: anyone can read product images (public bucket)
CREATE POLICY "Public read access for product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');
