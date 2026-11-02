import { supabase, isSupabaseConfigured } from './client';
import { demoCategories, demoProducts, demoInstagramPosts } from '@/data/demo';
import type { Category, Product, InstagramPost } from '@/types';

// In-memory demo store for when Supabase is not configured
let localCategories: Category[] = [...demoCategories];
let localProducts: Product[] = [...demoProducts];
let localInstagramPosts: InstagramPost[] = [...demoInstagramPosts];
const localSettings: Record<string, string> = {
  restaurant_name: 'TAAM Club',
  email: 'info@taamclub.com',
  instagram: '@taamclub',
  address: 'İstanbul, Türkiye',
  maps_url: 'https://maps.app.goo.gl/LjcB8p5Uq7dKkBBA7',
};

// ─── Categories ───────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return localCategories.filter((c) => c.is_active);
  }
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return [...localCategories];
  }
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function upsertCategory(category: Partial<Category>): Promise<Category> {
  if (!isSupabaseConfigured) {
    const index = localCategories.findIndex((c) => c.id === category.id);
    const updated: Category = {
      id: category.id || String(Date.now()),
      name_tr: category.name_tr ?? '',
      name_en: category.name_en ?? '',
      slug: category.slug ?? 'kategori',
      sort_order: category.sort_order ?? localCategories.length + 1,
      is_active: category.is_active ?? true,
      created_at: category.created_at || new Date().toISOString(),
    };
    if (index >= 0) {
      localCategories[index] = updated;
    } else {
      localCategories.push(updated);
    }
    return updated;
  }
  const { data, error } = await supabase
    .from('categories')
    .upsert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    localCategories = localCategories.filter((c) => c.id !== id);
    return;
  }
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// ─── Products ───────────────────────────────────────────
export async function getProducts(categorySlug?: string): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    let prods = localProducts.filter((p) => p.is_active);
    if (categorySlug && categorySlug !== 'all') {
      prods = prods.filter((p) => p.category?.slug === categorySlug);
    }
    return prods;
  }
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (categorySlug && categorySlug !== 'all') {
    query = query.eq('categories.slug', categorySlug);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return localProducts.filter((p) => p.is_active && p.is_featured).slice(0, 6);
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(6);

  if (error) throw error;
  return data ?? [];
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return [...localProducts];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function upsertProduct(product: Partial<Product>): Promise<Product> {
  if (!isSupabaseConfigured) {
    const index = localProducts.findIndex((p) => p.id === product.id);
    const cat = localCategories.find((c) => c.id === product.category_id);
    const updated: Product = {
      id: product.id || String(Date.now()),
      category_id: product.category_id ?? '',
      name_tr: product.name_tr ?? '',
      name_en: product.name_en ?? '',
      description_tr: product.description_tr ?? '',
      description_en: product.description_en ?? '',
      price: product.price ?? 0,
      image_url: product.image_url ?? '',
      sort_order: product.sort_order ?? localProducts.length + 1,
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      is_new: product.is_new ?? false,
      is_signature: product.is_signature ?? false,
      is_spicy: product.is_spicy ?? false,
      is_vegetarian: product.is_vegetarian ?? false,
      created_at: product.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: cat,
    };
    if (index >= 0) {
      localProducts[index] = updated;
    } else {
      localProducts.push(updated);
    }
    return updated;
  }
  const payload = { ...product, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from('products')
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    localProducts = localProducts.filter((p) => p.id !== id);
    return;
  }
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ─── Instagram Posts ───────────────────────────────────────────
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  if (!isSupabaseConfigured) {
    return localInstagramPosts.filter((p) => p.is_active);
  }
  const { data, error } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAllInstagramPosts(): Promise<InstagramPost[]> {
  if (!isSupabaseConfigured) {
    return [...localInstagramPosts];
  }
  const { data, error } = await supabase
    .from('instagram_posts')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function upsertInstagramPost(post: Partial<InstagramPost>): Promise<InstagramPost> {
  if (!isSupabaseConfigured) {
    const index = localInstagramPosts.findIndex((p) => p.id === post.id);
    const updated: InstagramPost = {
      id: post.id || String(Date.now()),
      image_url: post.image_url ?? '',
      caption_tr: post.caption_tr ?? '',
      caption_en: post.caption_en ?? '',
      instagram_url: post.instagram_url ?? '',
      sort_order: post.sort_order ?? localInstagramPosts.length + 1,
      is_active: post.is_active ?? true,
      created_at: post.created_at || new Date().toISOString(),
    };
    if (index >= 0) {
      localInstagramPosts[index] = updated;
    } else {
      localInstagramPosts.push(updated);
    }
    return updated;
  }
  const { data, error } = await supabase
    .from('instagram_posts')
    .upsert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInstagramPost(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    localInstagramPosts = localInstagramPosts.filter((p) => p.id !== id);
    return;
  }
  const { error } = await supabase.from('instagram_posts').delete().eq('id', id);
  if (error) throw error;
}

// ─── Site Settings ───────────────────────────────────────────
export async function getSiteSettings(): Promise<Record<string, string>> {
  if (!isSupabaseConfigured) {
    return { ...localSettings };
  }
  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) throw error;

  const settings: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function updateSiteSetting(key: string, value: string): Promise<void> {
  if (!isSupabaseConfigured) {
    localSettings[key] = value;
    return;
  }
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

