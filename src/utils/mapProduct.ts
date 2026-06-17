import type { DbProduct, Product } from '../types/product'

export const mapDbProduct = (item: DbProduct): Product => ({
  id: Number(item.id),
  name: String(item.name),
  price: Number(item.price),
  category: String(item.category),
  tag: String(item.tag),
  img_url: String(item.img_url ?? item.img ?? ''),
  desc: String(item.description ?? item.desc ?? ''),
})
