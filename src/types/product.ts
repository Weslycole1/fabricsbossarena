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
}
