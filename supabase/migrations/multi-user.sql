-- ── Multi-user RLS update ──
-- Any authenticated user can create and manage their own products.
-- Users can only read/update/delete products they created.

-- Drop old admin-only policies
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Admins can view all products" ON products;

-- Any authenticated user can create a product (created_by is set to their id)
CREATE POLICY "Users can create own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Users can only read their own products (admin portal)
CREATE POLICY "Users can read own products"
  ON products FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Public can read any non-archived product (for QR scan pages)
DROP POLICY IF EXISTS "Public can read active products" ON products;
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  TO anon
  USING (archived = false);

-- Users can only update their own products
CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Users can only delete (archive) their own products
CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Storage: any authenticated user can upload to product-images
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Users can update own product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Public can read all product images (for QR scan pages)
DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;
CREATE POLICY "Public can read product images"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated can read product images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'product-images');
