# Scan QR - Product Information Platform

A modern QR code-based product information system built with Next.js, Supabase, and TypeScript. Scan QR codes to access detailed product information instantly, with a powerful admin dashboard for product management.

## Features

### Public Features
- **QR Code Scanning**: Scan dynamically generated QR codes to view product information
- **Product Pages**: Beautiful, responsive product pages with custom fields support
- **OpenGraph Support**: Proper meta tags for social media sharing

### Admin Features
- **Product Management**: Create, edit, update, and archive products
- **QR Code Generation**: Automatic QR code generation for each product (SVG/PNG formats)
- **Image Upload**: Upload and manage product images
- **Custom Fields**: Add unlimited custom fields to products (JSONB storage)
- **Admin Dashboard**: Comprehensive dashboard for product management with search and filtering
- **Role-Based Access Control**: Admin-only routes with authentication

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with email/password
- **QR Generation**: qrcode library
- **Image Processing**: Sharp
- **Icons**: Lucide React

## Database Schema

### profiles
- `id` (UUID): References auth.users
- `email` (TEXT): User email
- `is_admin` (BOOLEAN): Admin privileges flag
- `created_at`, `updated_at`: Timestamps

### products
- `id` (UUID): Unique identifier
- `code` (TEXT): Unique product code (used in URLs and QR codes)
- `name` (TEXT): Product name
- `description` (TEXT): Product description
- `image_url` (TEXT): URL to product image
- `custom_fields` (JSONB): Flexible custom field storage
- `qr_code_url` (TEXT): URL to generated QR code
- `created_by` (UUID): References profiles
- `created_at`, `updated_at`: Timestamps
- `archived` (BOOLEAN): Soft delete flag
- `RLS Policies`: Public read, admin-only write

## Authentication Flow

1. **Sign Up**: Create new account at `/auth/sign-up`
2. **Email Confirmation**: Confirm email (required for RLS)
3. **Auto Profile Creation**: Trigger creates profile on signup
4. **Login**: Sign in at `/auth/login`
5. **Admin Access**: Only users with `is_admin=true` can access `/portal`

## Workflow

### Creating a Product
1. Login to admin dashboard (`/portal`)
2. Click "New Product"
3. Fill in product details:
   - Product Code (e.g., "PROD-001")
   - Product Name
   - Description
   - Upload Image
   - Add Custom Fields (optional)
4. Save Product
5. QR code automatically generated
6. Share public URL: `https://app.com/p/PROD-001`

### Scanning QR Codes
1. Use any QR code scanner
2. Scanned URL: `https://app.com/p/{product_code}`
3. Displays full product information
4. Custom fields rendered dynamically

## Environment Variables

```bash
# Supabase (automatically set by v0)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Set environment variables (in v0 Settings)
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY

# Start development server
pnpm dev

# Build for production
pnpm build
pnpm start
```

## Project Structure

```
app/
├── page.tsx                    # Home page
├── p/[product_code]/          # Public product pages
│   ├── page.tsx              # Product detail page
│   └── not-found.tsx         # 404 page
├── portal/                     # Admin dashboard
│   └── page.tsx              # Dashboard page
├── auth/
│   ├── login/page.tsx        # Login page
│   ├── sign-up/page.tsx      # Sign up page
│   ├── callback/route.ts     # Auth callback
│   └── error/page.tsx        # Auth error
├── actions/
│   └── products.ts           # Server actions for products
└── components/
    ├── ProductForm.tsx       # Product creation/editing form
    └── ProductList.tsx       # Admin product list
    
lib/
├── supabase/
│   ├── client.ts             # Browser Supabase client
│   ├── server.ts             # Server Supabase client
│   └── proxy.ts              # Session management
└── utils.ts                  # Utilities

middleware.ts                  # Auth middleware
```

## Key Features Explained

### QR Code Generation
- Uses `qrcode` library
- Encodes product URL: `https://app.com/p/{product_code}`
- Immutable after creation
- Can be downloaded as SVG or PNG

### Row Level Security (RLS)
- Products are publicly readable when not archived
- Only admins can create/update/delete products
- Users can only see their own profiles

### Custom Fields
- Stored as JSONB for flexibility
- Rendered dynamically on product pages
- Support for any JSON structure

## Deployment

### Deploy to Vercel
```bash
# Push to GitHub
git push origin main

# Deploy from Vercel dashboard
# Ensure environment variables are set in Vercel Settings
```

### Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL`
3. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy

## Testing the Workflow

1. **Sign up** a new admin account
2. **Login** to admin portal
3. **Create a product** with code "TEST-001"
4. **Download QR code** from product details
5. **Test public URL**: `https://app.com/p/TEST-001`
6. **Verify** product information displays correctly

## Troubleshooting

### QR Code Not Displaying
- Check product `qr_code_url` is set in database
- Verify image can be generated (check logs)
- Ensure product is not archived

### Admin Access Denied
- Verify user profile has `is_admin=true`
- Check RLS policies in Supabase dashboard
- Try re-authenticating

### Environment Variables Not Loaded
- Restart dev server after setting env vars
- Check Vercel Settings for production
- Verify `.env.local` is in `.gitignore`

## Performance Optimizations

- Next.js Image Optimization for product images
- Revalidation tags for cache invalidation
- Server-side rendering for public product pages
- Edge middleware for auth checks

## Security

- All sensitive operations require authentication
- Admin-only operations protected by RLS
- Passwords hashed by Supabase Auth
- Email verification required before RLS operations
- CSRF protection via Next.js

## License

MIT
