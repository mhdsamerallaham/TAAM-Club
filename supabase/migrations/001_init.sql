-- =====================================================
-- TAAM Club — Supabase Database Migration
-- Run this in the Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── CATEGORIES ────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

-- ─── PRODUCTS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_tr TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_signature BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── INSTAGRAM POSTS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  instagram_url TEXT,
  caption_tr TEXT,
  caption_en TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_instagram_active ON instagram_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_instagram_sort ON instagram_posts(sort_order);

-- ─── SITE SETTINGS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default settings
INSERT INTO site_settings (key, value) VALUES
  ('address', 'Güzide Mertcan, Istanbul, Türkiye'),
  ('phone', '+90 500 000 00 00'),
  ('email', 'merhaba@taamclub.com'),
  ('instagram_url', 'https://www.instagram.com/taamclub/'),
  ('google_maps_url', 'https://maps.google.com'),
  ('opening_hours', 'Pazartesi–Cuma: 11:00–22:00\nCumartesi–Pazar: 10:00–23:00'),
  ('meta_title', 'TAAM Club | İyi Yemek. İyi Enerji. | Istanbul'),
  ('meta_description', 'TAAM Club – Premium burgerler, çıtır tavuk, özel tarifler. İstanbul''da lezzetin kalbi.')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users have full access to categories"
  ON categories FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users have full access to products"
  ON products FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Instagram Posts
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active instagram posts"
  ON instagram_posts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users have full access to instagram posts"
  ON instagram_posts FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Site Settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- =====================================================
-- SEED DATA (Demo)
-- =====================================================

-- Categories
INSERT INTO categories (name_tr, name_en, slug, sort_order) VALUES
  ('Burgerler', 'Burgers', 'burgerler', 1),
  ('Tavuk', 'Chicken', 'tavuk', 2),
  ('Patates', 'Fries', 'patates', 3),
  ('Tatlılar', 'Desserts', 'tatlilar', 4),
  ('İçecekler', 'Drinks', 'icecekler', 5)
ON CONFLICT (slug) DO NOTHING;

-- Products (insert after categories)
DO $$
DECLARE
  burger_id UUID;
  tavuk_id UUID;
  patates_id UUID;
  tatli_id UUID;
BEGIN
  SELECT id INTO burger_id FROM categories WHERE slug = 'burgerler';
  SELECT id INTO tavuk_id FROM categories WHERE slug = 'tavuk';
  SELECT id INTO patates_id FROM categories WHERE slug = 'patates';
  SELECT id INTO tatli_id FROM categories WHERE slug = 'tatlilar';

  INSERT INTO products (category_id, name_tr, name_en, description_tr, description_en, price, image_url, sort_order, is_featured, is_new, is_signature) VALUES
    (burger_id, 'Ranch Tavuk Burger', 'Ranch Chicken Burger', 'Çıtır tavuk, ranch sos, taze yeşillikler, özel brioche ekmek', 'Crispy chicken, ranch sauce, fresh greens, special brioche bun', 280, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', 1, true, true, true),
    (burger_id, 'TAAM Klasik Burger', 'TAAM Classic Burger', 'Dana eti, cheddar peyniri, turşu, özel TAAM sosu', 'Beef patty, cheddar cheese, pickles, special TAAM sauce', 260, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80', 2, true, false, true),
    (burger_id, 'Üçlü Kule Burger', 'Triple Tower Burger', 'Üç kat et, üç farklı lezzet. TAAM''ın en iddialı burgeri.', 'Three layers of meat, three different flavors. TAAM''s boldest burger.', 380, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80', 3, false, false, true),
    (tavuk_id, 'Çıtır Tavuk Parçaları', 'Crispy Chicken Tenders', 'El yapımı baharat karışımı ile marine edilmiş çıtır tavuk', 'Crispy chicken marinated with house-made spice blend', 220, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80', 1, true, false, false),
    (patates_id, 'Fries Duo', 'Fries Duo', 'Çift sos seçenekli özel patates kızartması. Ranch + Sriracha', 'Special fries with dual sauce options. Ranch + Sriracha', 140, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&q=80', 1, true, true, false),
    (tatli_id, 'Cookie Dondurma', 'Cookie Ice Cream', 'El yapımı çikolatalı cookie üzerine vanilyalı dondurma', 'Homemade chocolate chip cookie with vanilla ice cream', 180, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80', 1, true, true, true);

  -- Instagram posts
  INSERT INTO instagram_posts (image_url, instagram_url, caption_tr, caption_en, sort_order) VALUES
    ('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Ranch Tavuk Burger 🔥', 'Ranch Chicken Burger 🔥', 1),
    ('https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', 'https://www.instagram.com/taamclub/', 'TAAM Klasik 🍔', 'TAAM Classic 🍔', 2),
    ('https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Çıtır her şeyden iyi 🍗', 'Crispy is everything 🍗', 3),
    ('https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Fries Duo. İki sos, bir mutluluk 🍟', 'Fries Duo. Two sauces, one happiness 🍟', 4),
    ('https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Cookie dondurma sezonu 🍪', 'Cookie ice cream season 🍪', 5),
    ('https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Üçlü kule, büyük zevk 🗼', 'Triple tower, big pleasure 🗼', 6);
END $$;
