export type Product = {
  id: number
  name: string
  price: number
  category: string
  tag: string
  img_url: string
  desc: string
}

export type DbProduct = {
  id: number | string
  name: string
  price: number | string
  category: string
  tag: string
  img_url?: string | null
  img?: string | null
  description?: string | null
  desc?: string | null
  stock?: number | string | null
  featured?: boolean | null
  is_available?: boolean | null
  created_at?: string | null
}

// Extended shape used only by the admin dashboard (CRUD + inventory fields).
// Kept separate from `Product` so the public storefront types/behaviour are untouched.
export type AdminProduct = {
  id: number
  name: string
  description: string
  price: number
  category: string
  tag: string
  img_url: string
  stock: number
  featured: boolean
  is_available: boolean
  created_at: string | null
}

export type Category = {
  id: number
  name: string
  created_at?: string | null
}

export const mapDbProductToAdmin = (item: DbProduct): AdminProduct => ({
  id: Number(item.id),
  name: String(item.name ?? ''),
  description: String(item.description ?? item.desc ?? ''),
  price: Number(item.price ?? 0),
  category: String(item.category ?? ''),
  tag: String(item.tag ?? ''),
  img_url: String(item.img_url ?? item.img ?? ''),
  stock: Number(item.stock ?? 0),
  featured: Boolean(item.featured ?? false),
  is_available: item.is_available === null || item.is_available === undefined
    ? true
    : Boolean(item.is_available),
  created_at: item.created_at ?? null,
})
