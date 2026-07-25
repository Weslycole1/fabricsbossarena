import { supabase } from "../../lib/supabase";
import type { AdminProduct, Category, DbProduct } from "../../types/product";
import { mapDbProductToAdmin } from "../../types/product";

const PRODUCT_IMAGES_BUCKET = "product-images";

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  tag: string;
  img_url: string;
  stock: number;
  featured: boolean;
  is_available: boolean;
}

export async function fetchDashboardStats() {
  const [{ count: productCount }, { count: categoryCount }, recent, allProducts] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      fetchRecentProducts(5),
      fetchAllProducts(),
    ]);

  return {
    totalProducts: productCount ?? 0,
    totalCategories: categoryCount ?? 0,
    recentProducts: recent,
    allProducts,
  };
}

export async function fetchRecentProducts(limit = 5): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return ((data ?? []) as DbProduct[]).map(mapDbProductToAdmin);
}

export async function fetchAllProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbProduct[]).map(mapDbProductToAdmin);
}

export async function fetchProductById(id: number): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw error ?? new Error("Product not found.");
  return mapDbProductToAdmin(data as DbProduct);
}

export async function createProduct(input: ProductInput): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Failed to create product.");
  return mapDbProductToAdmin(data as DbProduct);
}

export async function updateProduct(
  id: number,
  input: ProductInput
): Promise<AdminProduct> {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Failed to update product.");
  return mapDbProductToAdmin(data as DbProduct);
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function createCategory(name: string): Promise<Category> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name cannot be empty.");

  const { data, error } = await supabase
    .from("categories")
    .upsert({ name: trimmed }, { onConflict: "name" })
    .select("*")
    .single();

  if (error || !data) throw error ?? new Error("Failed to create category.");
  return data as Category;
}

/**
 * Uploads a product image to Supabase Storage and returns its public URL.
 * Images are namespaced by timestamp to avoid collisions.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const safeName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const path = `products/${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error("Could not resolve public URL for uploaded image.");
  }

  return data.publicUrl;
}
