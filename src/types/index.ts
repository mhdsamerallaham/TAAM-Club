// TAAM Club — TypeScript Types

export interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name_tr: string;
  name_en: string;
  description_tr: string | null;
  description_en: string | null;
  price: number;
  image_url: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  is_new: boolean;
  is_signature: boolean;
  is_spicy: boolean;
  is_vegetarian: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
}

export interface InstagramPost {
  id: string;
  image_url: string;
  instagram_url: string | null;
  caption_tr: string | null;
  caption_en: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export type Language = 'tr' | 'en';

export interface NavItem {
  label_tr: string;
  label_en: string;
  href: string;
}
