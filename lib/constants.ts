/** The owner email — used in both server actions and client components. */
export const OWNER_EMAIL = 'muhammedhashirnihal@gmail.com'

import type { Product } from '@/app/actions/products'

export interface UserRecord {
  id: string
  email: string
  created_at: string
  products: Product[]
}
