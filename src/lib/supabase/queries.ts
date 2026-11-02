import { supabase, isSupabaseConfigured } from './client';
import { demoCategories, demoProducts, demoInstagramPosts } from '@/data/demo';
import type { Category, Product, InstagramPost } from '@/types';

const STORAGE_KEYS = {
  categories: 'taam_local_categories_v2',
  products: 'taam_local_products_v2',
  instagram: 'taam_local_instagram_v2',
  settings: 'taam_local_settings_v2',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUuid(id?: string | null): boolean {
  return Boolean(id && UUID_REGEX.test(id));
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore storage quota errors silently
  }
}

// Persistent local store for fallback
let localCategories: Category[] = loadFromStorage(STORAGE_KEYS.categories, [...demoCategories]);
let localProducts: Product[] = loadFromStorage(STORAGE_KEYS.products, [...demoProducts]);
let localInstagramPosts: InstagramPost[] = loadFromStorage(STORAGE_KEYS.instagram, [...demoInstagramPosts]);
const localSettings: Record<string, string> = loadFromStorage(STORAGE_KEYS.settings, {
  restaurant_name: 'TAAM Club',
  email: 'info@taamclub.com',
  instagram: '@taamclub',
  address: 'İstanbul, Türkiye',
  maps_url: 'https://maps.app.goo.gl/LjcB8p5Uq7dKkBBA7',
});

/**
 * Checks whether the remote Supabase database still only contains the legacy 5-category
 * placeholder data from the initial 001_init.sql template (which had slug='patates' and
 * lacked 'smash-burger').
 */
function isLegacyPlaceholderCategories(cats: Category[]): boolean {
  if (!cats || cats.length === 0) return true;
  const slugs = new Set(cats.map((c) => c.slug));
  return slugs.has('patates') && !slugs.has('smash-burger') && cats.length <= 6;
}

let autoSeedInFlight: Promise<boolean> | null = null;

/**
 * Attempts to automatically seed the 8 official categories and 70 official products
 * into Supabase if the database still has the old 5-category placeholder seed.
 */
export async function syncOfficialMenuToSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  if (autoSeedInFlight) return autoSeedInFlight;

  autoSeedInFlight = (async () => {
    try {
      // 1. Insert or upsert the 8 official categories
      const catPayloads = demoCategories.map((c) => ({
        name_tr: c.name_tr,
        name_en: c.name_en,
        slug: c.slug,
        sort_order: c.sort_order,
        is_active: c.is_active,
      }));

      const { data: insertedCats, error: catErr } = await supabase
        .from('categories')
        .upsert(catPayloads, { onConflict: 'slug' })
        .select('*');

      if (catErr || !insertedCats || insertedCats.length === 0) {
        return false;
      }

      // Remove legacy placeholder categories ('burgerler', 'tavuk', 'patates', 'tatlilar', 'icecekler')
      await supabase
        .from('categories')
        .delete()
        .in('slug', ['burgerler', 'tavuk', 'patates', 'tatlilar', 'icecekler']);

      const slugToUuid = new Map<string, string>();
      insertedCats.forEach((c: Category) => slugToUuid.set(c.slug, c.id));

      const demoCatIdToSlug = new Map<string, string>();
      demoCategories.forEach((c) => demoCatIdToSlug.set(c.id, c.slug));

      // Delete old placeholder products before inserting the 70 official products
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      const prodPayloads = demoProducts.map((p) => {
        const slug = demoCatIdToSlug.get(p.category_id ?? '') || 'smash-burger';
        const category_id = slugToUuid.get(slug) || insertedCats[0].id;
        return {
          category_id,
          name_tr: p.name_tr,
          name_en: p.name_en,
          description_tr: p.description_tr,
          description_en: p.description_en,
          price: p.price,
          portion: p.portion ?? null,
          variants: p.variants ?? [],
          image_url: p.image_url,
          sort_order: p.sort_order,
          is_featured: p.is_featured,
          is_active: p.is_active,
          is_new: p.is_new,
          is_signature: p.is_signature,
          is_spicy: p.is_spicy,
          is_vegetarian: p.is_vegetarian,
        };
      });

      const { error: prodErr } = await supabase.from('products').insert(prodPayloads);
      if (prodErr) {
        return false;
      }
      return true;
    } catch {
      return false;
    } finally {
      autoSeedInFlight = null;
    }
  })();

  return autoSeedInFlight;
}

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

  if (error || !data) {
    return localCategories.filter((c) => c.is_active);
  }

  if (isLegacyPlaceholderCategories(data)) {
    const synced = await syncOfficialMenuToSupabase();
    if (synced) {
      const { data: refreshed } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (refreshed && !isLegacyPlaceholderCategories(refreshed)) {
        return refreshed;
      }
    }
    return localCategories.filter((c) => c.is_active);
  }

  return data;
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return [...localCategories];
  }
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) {
    return [...localCategories];
  }

  if (isLegacyPlaceholderCategories(data)) {
    const synced = await syncOfficialMenuToSupabase();
    if (synced) {
      const { data: refreshed } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (refreshed && !isLegacyPlaceholderCategories(refreshed)) {
        return refreshed;
      }
    }
    return [...localCategories];
  }

  return data;
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
    saveToStorage(STORAGE_KEYS.categories, localCategories);
    return updated;
  }

  const payload: Record<string, unknown> = {
    name_tr: category.name_tr ?? '',
    name_en: category.name_en ?? '',
    slug: category.slug ?? 'kategori',
    sort_order: category.sort_order ?? 1,
    is_active: category.is_active ?? true,
  };
  if (isValidUuid(category.id)) {
    payload.id = category.id;
  }

  const { data, error } = await supabase
    .from('categories')
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured || !isValidUuid(id)) {
    localCategories = localCategories.filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.categories, localCategories);
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

  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data || data.length <= 6) {
    // Check if remote DB still has the 6-item placeholder template
    const cats = await getCategories();
    if (isLegacyPlaceholderCategories(cats) || (data && data.length === 6 && data.some((p: Product) => p.name_tr === 'Üçlü Kule Burger'))) {
      let prods = localProducts.filter((p) => p.is_active);
      if (categorySlug && categorySlug !== 'all') {
        prods = prods.filter((p) => p.category?.slug === categorySlug);
      }
      return prods;
    }
  }

  let results: Product[] = data ?? [];
  if (categorySlug && categorySlug !== 'all') {
    results = results.filter((p) => p.category?.slug === categorySlug);
  }
  return results;
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

  if (error || !data || data.some((p: Product) => p.name_tr === 'Ranch Tavuk Burger' && p.price === 280)) {
    return localProducts.filter((p) => p.is_active && p.is_featured).slice(0, 6);
  }
  return data;
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return [...localProducts];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('sort_order', { ascending: true });

  if (error || !data) {
    return [...localProducts];
  }

  if (data.length === 6 && data.some((p: Product) => p.name_tr === 'Üçlü Kule Burger')) {
    const synced = await syncOfficialMenuToSupabase();
    if (synced) {
      const { data: refreshed } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('sort_order', { ascending: true });
      if (refreshed && refreshed.length > 6) {
        return refreshed;
      }
    }
    return [...localProducts];
  }

  return data;
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
      portion: product.portion,
      variants: product.variants,
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
    saveToStorage(STORAGE_KEYS.products, localProducts);
    return updated;
  }

  // Strip joined 'category' object and non-UUID demo IDs before sending to Supabase
  const { category: _joinedCategory, id, created_at: _createdAt, ...rest } = product;

  let resolvedCategoryId: string | null = isValidUuid(product.category_id) ? product.category_id! : null;
  if (!resolvedCategoryId && product.category_id) {
    const matchedCat = localCategories.find((c) => c.id === product.category_id) || demoCategories.find((c) => c.id === product.category_id);
    if (matchedCat) {
      const { data: remoteCat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', matchedCat.slug)
        .maybeSingle();
      if (remoteCat?.id) {
        resolvedCategoryId = remoteCat.id;
      }
    }
  }

  const payload: Record<string, unknown> = {
    ...rest,
    category_id: resolvedCategoryId,
    updated_at: new Date().toISOString(),
  };
  if (isValidUuid(id)) {
    payload.id = id;
  }

  const { data, error } = await supabase
    .from('products')
    .upsert(payload)
    .select('*, category:categories(*)')
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured || !isValidUuid(id)) {
    localProducts = localProducts.filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.products, localProducts);
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

  if (error || !data) return localInstagramPosts.filter((p) => p.is_active);
  return data;
}

export async function getAllInstagramPosts(): Promise<InstagramPost[]> {
  if (!isSupabaseConfigured) {
    return [...localInstagramPosts];
  }
  const { data, error } = await supabase
    .from('instagram_posts')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) return [...localInstagramPosts];
  return data;
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
    saveToStorage(STORAGE_KEYS.instagram, localInstagramPosts);
    return updated;
  }

  const { id, created_at: _createdAt, ...rest } = post;
  const payload: Record<string, unknown> = { ...rest };
  if (isValidUuid(id)) {
    payload.id = id;
  }

  const { data, error } = await supabase
    .from('instagram_posts')
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInstagramPost(id: string): Promise<void> {
  if (!isSupabaseConfigured || !isValidUuid(id)) {
    localInstagramPosts = localInstagramPosts.filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.instagram, localInstagramPosts);
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
  if (error || !data) return { ...localSettings };

  const settings: Record<string, string> = {};
  data.forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function updateSiteSetting(key: string, value: string): Promise<void> {
  if (!isSupabaseConfigured) {
    localSettings[key] = value;
    saveToStorage(STORAGE_KEYS.settings, localSettings);
    return;
  }
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}
