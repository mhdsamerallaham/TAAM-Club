-- =====================================================
-- TAAM Club — Tam Menü Senkronizasyonu ve Admin Yetkilendirme
-- =====================================================

-- 1. Admin kullanıcısının (info@taamclub.com) e-posta onayını otomatik tamamla
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'info@taamclub.com';

-- 2. Eksik sütunlar varsa ekle
ALTER TABLE products ADD COLUMN IF NOT EXISTS portion TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- 3. RLS Politikalarını Güncelle (Admin panelinden kesintisiz ürün ve görsel yükleme için)
DROP POLICY IF EXISTS "Public can read active categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users have full access to categories" ON categories;
DROP POLICY IF EXISTS "Admin full access to categories" ON categories;
CREATE POLICY "Admin full access to categories"
  ON categories FOR ALL
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read active products" ON products;
DROP POLICY IF EXISTS "Authenticated users have full access to products" ON products;
DROP POLICY IF EXISTS "Admin full access to products" ON products;
CREATE POLICY "Admin full access to products"
  ON products FOR ALL
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read active instagram posts" ON instagram_posts;
DROP POLICY IF EXISTS "Authenticated users have full access to instagram posts" ON instagram_posts;
DROP POLICY IF EXISTS "Admin full access to instagram posts" ON instagram_posts;
CREATE POLICY "Admin full access to instagram posts"
  ON instagram_posts FOR ALL
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Admin full access to site settings" ON site_settings;
CREATE POLICY "Admin full access to site settings"
  ON site_settings FOR ALL
  USING (true) WITH CHECK (true);

-- 4. Eski demo verilerini temizle ve 8 resmi kategori + 62 resmi ürünü ekle
TRUNCATE TABLE products, categories, instagram_posts RESTART IDENTITY CASCADE;

INSERT INTO categories (name_tr, name_en, slug, sort_order, is_active) VALUES
  ('Signature & Classic Burger', 'Signature & Classic Burgers', 'signature-burgers', 1, true),
  ('Tavuk Burgerler', 'Chicken Burgers', 'chicken-burgers', 2, true),
  ('Çıtır Tavuk & Kanat', 'Crispy Wings & Chicken', 'crispy-wings-chicken', 3, true),
  ('Rotisserie Tavuk', 'Rotisserie Chicken', 'rotisserie-tavuk', 4, true),
  ('Pizza', 'Pizza', 'pizza', 5, true),
  ('Panuozzo Seçenekleri', 'Panuozzo Sandwiches', 'panuozzo', 6, true),
  ('Çocuk Menüsü', 'Kids Menu', 'cocuk-menusu', 7, true),
  ('Patates Kızartmaları', 'Burger Sides & Fries', 'burger-sides', 8, true),
  ('Salata Bar & Garnitürler', 'Salad Bar & Sides', 'salata-ve-garniturler', 9, true),
  ('Kahvaltı', 'Breakfast', 'kahvalti', 10, true),
  ('Dondurma', 'Ice Cream & Frozen Yogurt', 'dondurma', 11, true),
  ('Tatlı & Pancake', 'Desserts & Pancakes', 'tatli', 12, true),
  ('Sıcak İçecekler', 'Hot Drinks', 'sicak-icecekler', 13, true),
  ('Soğuk İçecekler', 'Cold Drinks', 'soguk-icecekler', 14, true),
  ('Çaylar', 'Teas', 'caylar', 15, true),
  ('Meşrubatlar', 'Soft Drinks', 'mesrubatlar', 16, true)
ON CONFLICT (slug) DO UPDATE SET
  name_tr = EXCLUDED.name_tr,
  name_en = EXCLUDED.name_en,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

DO $$
DECLARE
  cat_0 UUID;
  cat_1 UUID;
  cat_2 UUID;
  cat_3 UUID;
  cat_4 UUID;
  cat_5 UUID;
  cat_6 UUID;
  cat_7 UUID;
  cat_8 UUID;
  cat_9 UUID;
  cat_10 UUID;
  cat_11 UUID;
  cat_12 UUID;
  cat_13 UUID;
  cat_14 UUID;
  cat_15 UUID;
BEGIN
  SELECT id INTO cat_0 FROM categories WHERE slug = 'signature-burgers';
  SELECT id INTO cat_1 FROM categories WHERE slug = 'chicken-burgers';
  SELECT id INTO cat_2 FROM categories WHERE slug = 'crispy-wings-chicken';
  SELECT id INTO cat_3 FROM categories WHERE slug = 'rotisserie-tavuk';
  SELECT id INTO cat_4 FROM categories WHERE slug = 'pizza';
  SELECT id INTO cat_5 FROM categories WHERE slug = 'panuozzo';
  SELECT id INTO cat_6 FROM categories WHERE slug = 'cocuk-menusu';
  SELECT id INTO cat_7 FROM categories WHERE slug = 'burger-sides';
  SELECT id INTO cat_8 FROM categories WHERE slug = 'salata-ve-garniturler';
  SELECT id INTO cat_9 FROM categories WHERE slug = 'kahvalti';
  SELECT id INTO cat_10 FROM categories WHERE slug = 'dondurma';
  SELECT id INTO cat_11 FROM categories WHERE slug = 'tatli';
  SELECT id INTO cat_12 FROM categories WHERE slug = 'sicak-icecekler';
  SELECT id INTO cat_13 FROM categories WHERE slug = 'soguk-icecekler';
  SELECT id INTO cat_14 FROM categories WHERE slug = 'caylar';
  SELECT id INTO cat_15 FROM categories WHERE slug = 'mesrubatlar';

  INSERT INTO products (
    category_id, name_tr, name_en, description_tr, description_en,
    price, portion, variants, image_url, sort_order,
    is_featured, is_active, is_new, is_signature, is_spicy, is_vegetarian
  ) VALUES
    (cat_0, 'Kastamonu Ateşi', 'Kastamonu Fire Burger', 'Smash burger köftesi, burger peyniri, çıtır çemensiz pastırma, taze roka ve ev yapımı özel ballı hardal mayonez sos ile.', 'Smash burger patty, burger cheese, crispy fenugreek-free pastrami, fresh arugula, and homemade special honey mustard mayo sauce.', 570, NULL, '[{"label_tr":"S - 80 g","label_en":"S - 80 g","price":570},{"label_tr":"M - 160 g","label_en":"M - 160 g","price":720},{"label_tr":"L - 240 g","label_en":"L - 240 g","price":870}]'::jsonb, '/images/menu/burger-kastamonu-atesi.jpg', 1, true, true, true, true, false, false),
    (cat_0, 'Trüflü Mantarlı', 'Truffle Mushroom Burger', 'Smash burger köftesi, Kars kaşarı, trüf yağında sotelenmiş yabani mantar, trüflü aioli sos.', 'Smash burger patty, aged Kars kashar cheese, wild mushrooms sautéed in truffle oil, truffle aioli sauce.', 540, NULL, '[{"label_tr":"S - 80 g","label_en":"S - 80 g","price":540},{"label_tr":"M - 160 g","label_en":"M - 160 g","price":690},{"label_tr":"L - 240 g","label_en":"L - 240 g","price":840}]'::jsonb, '/images/menu/burger-truflu-mantarli.jpg', 2, true, true, false, true, false, false),
    (cat_0, 'Beef Special', 'Beef Special Burger', 'Smash burger köftesi, kuru et, tütsülü peynir, kibrit patates, roka.', 'Smash burger patty, cured smoked beef, smoked cheese, shoestring fries, fresh arugula.', 610, NULL, '[{"label_tr":"S - 80 g","label_en":"S - 80 g","price":610},{"label_tr":"M - 160 g","label_en":"M - 160 g","price":760},{"label_tr":"L - 240 g","label_en":"L - 240 g","price":910}]'::jsonb, '/images/menu/burger-beef-special.jpg', 3, false, true, false, true, false, false),
    (cat_0, 'Cheese Burger', 'Classic Cheese Burger', 'Smash burger köftesi, marul, domates, turşu, cheddar peyniri.', 'Smash burger patty, lettuce, tomato, pickles, cheddar cheese.', 510, NULL, '[{"label_tr":"S - 80 g","label_en":"S - 80 g","price":510},{"label_tr":"M - 160 g","label_en":"M - 160 g","price":660},{"label_tr":"L - 240 g","label_en":"L - 240 g","price":810}]'::jsonb, '/images/menu/burger-cheeseburger.jpg', 4, false, true, false, false, false, false),
    (cat_0, 'TAAM Burger', 'TAAM Signature Burger', 'Smash burger köftesi, karamelize soğan, mantar, cheddar peyniri, kornişon turşusu ve ranch sos.', 'Smash burger patty, caramelized onion, mushrooms, cheddar cheese, gherkin pickles, and ranch sauce.', 520, NULL, '[{"label_tr":"S - 80 g","label_en":"S - 80 g","price":520},{"label_tr":"M - 160 g","label_en":"M - 160 g","price":670},{"label_tr":"L - 240 g","label_en":"L - 240 g","price":820}]'::jsonb, '/images/menu/burger-taam-burger.jpg', 5, true, true, false, true, false, false),
    (cat_0, 'Mexican Burger', 'Mexican Burger', 'Smash burger köftesi, Meksika fasulyesi, mor soğan, jalapeno, roka, sriracha sos.', 'Smash burger patty, red kidney beans, red onion, jalapeño, fresh arugula, sriracha sauce.', 520, NULL, '[{"label_tr":"S - 80 g","label_en":"S - 80 g","price":520},{"label_tr":"M - 160 g","label_en":"M - 160 g","price":670},{"label_tr":"L - 240 g","label_en":"L - 240 g","price":820}]'::jsonb, '/images/menu/burger-mexican.jpg', 6, false, true, false, false, true, false),
    (cat_1, 'Ranch Sauce Tavuk Burger', 'Ranch Sauce Chicken Burger', 'Çıtır tavuk burger, taze marul, turşu ve özel ranch sos. • ~690 kcal', 'Crispy chicken burger with fresh lettuce, pickles, and signature ranch sauce. • ~690 kcal', 410, '~690 kcal', '[]'::jsonb, '/images/menu/tavuk-burger-ranch.jpg', 1, false, true, false, true, false, false),
    (cat_1, 'Spicy Jam Tavuk Burger', 'Spicy Jam Chicken Burger', 'Özel acı reçel sosu, jalapeno biberi ve eritilmiş peynir ile çıtır tavuk burger. • ~680 kcal', 'Crispy chicken burger glazed with dark spicy jam, jalapeños, and melted cheese. • ~680 kcal', 420, '~680 kcal', '[]'::jsonb, '/images/menu/tavuk-burger-spicy-jam.jpg', 2, false, true, true, false, true, false),
    (cat_1, 'Classic Chicken Burger', 'Classic Chicken Burger', 'Çıtır tavuk burger, taze marul ve özel mayonez sos. • ~660 kcal', 'Crispy chicken burger with fresh lettuce and mayo. • ~660 kcal', 395, '~660 kcal', '[]'::jsonb, '/images/menu/tavuk-burger-classic.jpg', 3, false, true, false, false, false, false),
    (cat_1, 'Coleslaw Chicken Burger', 'Coleslaw Chicken Burger', 'Kremalı taze coleslaw salatası ile taçlandırılmış çıtır tavuk burger. • ~700 kcal', 'Crispy chicken burger topped with creamy house coleslaw. • ~700 kcal', 410, '~700 kcal', '[]'::jsonb, '/images/menu/tavuk-burger-coleslaw.jpg', 4, false, true, false, false, false, false),
    (cat_2, 'Crispy Wings (Çıtır Kanat)', 'Crispy Wings', '1 garnitür ve soslar dahildir. (6 Adet: 800 kcal | 10 Adet: 1220 kcal | 14 Adet: 1620 kcal)', 'Includes 1 garnish and sauces. (6 Pcs: 800 kcal | 10 Pcs: 1220 kcal | 14 Pcs: 1620 kcal)', 320, NULL, '[{"label_tr":"6 Adet (800 kcal)","label_en":"6 Pcs (800 kcal)","price":320},{"label_tr":"10 Adet (1220 kcal)","label_en":"10 Pcs (1220 kcal)","price":460},{"label_tr":"14 Adet (1620 kcal)","label_en":"14 Pcs (1620 kcal)","price":590}]'::jsonb, '/images/menu/tavuk-crispy-wings.jpg', 1, false, true, false, true, false, false),
    (cat_2, 'Crispy Chicken Pieces (Çıtır Tavuk Parçaları)', 'Crispy Chicken Pieces', '24 saat özel marinasyonlu çıtır tavuk parçaları. (6 Adet: 540 kcal | 10 Adet: 900 kcal | 14 Adet: 1260 kcal)', '24-hour marinated crispy chicken pieces. (6 Pcs: 540 kcal | 10 Pcs: 900 kcal | 14 Pcs: 1260 kcal)', 270, NULL, '[{"label_tr":"6 Adet (540 kcal)","label_en":"6 Pcs (540 kcal)","price":270},{"label_tr":"10 Adet (900 kcal)","label_en":"10 Pcs (900 kcal)","price":390},{"label_tr":"14 Adet (1260 kcal)","label_en":"14 Pcs (1260 kcal)","price":510}]'::jsonb, '/images/menu/tavuk-crispy-pieces.jpg', 2, false, true, false, false, false, false),
    (cat_2, 'Crispy Chicken Wrap (Çıtır Tavuk Dürüm)', 'Crispy Chicken Wrap', 'Lübnan ekmeği içerisinde çıtır tavuk, taze marul ve ranch sos.', 'Lebanese bread wrap with crispy chicken, lettuce, and ranch sauce.', 250, NULL, '[]'::jsonb, '/images/menu/tavuk-crispy-wrap.jpg', 3, false, true, false, false, false, false),
    (cat_3, 'Yarım Tavuk Tabağı', 'Half Rotisserie Chicken Platter', 'Rotisserie fırında pişmiş yarım tavuk, 2 garnitür, Lübnan ekmeği, gravy sos. • 1020 kcal', 'Rotisserie oven-roasted half chicken, 2 sides, Lebanese bread, and gravy sauce. • 1020 kcal', 540, '1020 kcal', '[]'::jsonb, '/images/menu/rotisserie-yarim-tavuk.jpg', 1, false, true, false, true, false, false),
    (cat_3, 'Bütün Tavuk / Aile Kutusu', 'Whole Chicken / Family Box', '1 bütün tavuk + 3 garnitür, Lübnan ekmeği, 4 kişilik paylaşım kutusu. • 1900 kcal', '1 whole rotisserie chicken + 3 sides, Lebanese bread, 4-person sharing box. • 1900 kcal', 760, '4 Kişilik • 1900 kcal', '[]'::jsonb, '/images/menu/rotisserie-butun-aile.jpg', 2, true, true, false, true, false, false),
    (cat_3, 'Tavuklu Pilav', 'Rotisserie Chicken & Pilaf', 'Tavuk, pilav, turşu ve ayran ile servis edilir. • 680 kcal', 'Shredded rotisserie chicken over pilaf, served with pickles and ayran. • 680 kcal', 350, '680 kcal', '[]'::jsonb, '/images/menu/rotisserie-tavuklu-pilav.jpg', 3, false, true, false, false, false, false),
    (cat_4, 'Margherita', 'Margherita Pizza', 'Domates sos, mozzarella, fesleğen, roka, parmesan peyniri. (Uzun fermentasyonlu 180 g özel hamur) • 840 kcal', 'Tomato sauce, mozzarella, fresh basil, arugula, parmesan cheese. (Long-fermented 180 g dough) • 840 kcal', 420, '840 kcal', '[]'::jsonb, '/images/menu/pizza-margherita.jpg', 1, false, true, false, false, false, true),
    (cat_4, 'Kastamonu Sucuklu Pizza', 'Kastamonu Sucuk Pizza', 'Domates sos, mozzarella, chili kırmızı biber, Kastamonu sucuğu. • 1080 kcal', 'Tomato sauce, mozzarella, red chili pepper, traditional Kastamonu sucuk. • 1080 kcal', 600, '1080 kcal', '[]'::jsonb, '/images/menu/pizza-kastamonu-sucuklu.jpg', 2, false, true, false, true, true, false),
    (cat_4, 'Kastamonu Pastırmalı Pizza', 'Kastamonu Pastrami Pizza', 'Harissa sos, mozzarella, Kastamonu pastırma, kibrit patates, roka. • ~1000 kcal', 'Harissa sauce, mozzarella, Kastamonu pastrami, shoestring fries, fresh arugula. • ~1000 kcal', 600, '~1000 kcal', '[]'::jsonb, '/images/menu/pizza-kastamonu-pastirmali.jpg', 3, true, true, false, true, false, false),
    (cat_4, 'Trüflü Fungi Pizza', 'Truffle Fungi Pizza', 'Trüflü muskatlı krema, taze biberiye, mantar, karamelize soğan, roka. • 1040 kcal', 'Truffle nutmeg cream, fresh rosemary, mushrooms, caramelized onion, arugula. • 1040 kcal', 560, '1040 kcal', '[]'::jsonb, '/images/menu/pizza-truflu-fungi.jpg', 4, false, true, false, false, false, true),
    (cat_4, 'Quattro Formaggi', 'Quattro Formaggi Pizza', 'Küflü peynir, İzmir tulum, Kars gravyer, muskatlı krema, taze kekik, parmesan, kırık Antep fıstığı, roka. • 1100 kcal', 'Blue cheese, Izmir tulum, Kars gruyere, nutmeg cream, fresh thyme, parmesan, crushed pistachio, arugula. • 1100 kcal', 580, '1100 kcal', '[]'::jsonb, '/images/menu/pizza-quattro-formaggi.jpg', 5, false, true, false, false, false, true),
    (cat_4, 'BBQ Tavuklu Pizza', 'BBQ Chicken Pizza', 'Domates sos, mozzarella, çıtır panelenmiş BBQ soslu tavuk, kırmızı soğan, maydanoz. • 960 kcal', 'Tomato sauce, mozzarella, crispy breaded BBQ chicken, red onion, fresh parsley. • 960 kcal', 550, '960 kcal', '[]'::jsonb, '/images/menu/pizza-bbq-tavuklu.jpg', 6, false, true, false, false, false, false),
    (cat_4, 'Vejetaryen Pizza', 'Vegetarian Pizza', 'Domates sos, mozzarella, kızarmış patlıcan, fesleğen, kabak, taze kekik, kibrit patates, pesto sos. • 850 kcal', 'Tomato sauce, mozzarella, fried eggplant, basil, zucchini, fresh thyme, shoestring fries, pesto sauce. • 850 kcal', 450, '850 kcal', '[]'::jsonb, '/images/menu/pizza-vejetaryen.jpg', 7, false, true, false, false, false, true),
    (cat_4, 'Dubai Pizza', 'Dubai Pistachio & Kunafa Pizza', 'Fıstık kreması, çıtır kadayıf, Antep fıstığı, kakaolu fındık kreması, pudra şekeri. • 1100 kcal', 'Pistachio cream, crispy kunafa threads, crushed pistachios, chocolate hazelnut spread, powdered sugar. • 1100 kcal', 580, '1100 kcal', '[]'::jsonb, '/images/menu/pizza-dubai.jpg', 8, true, true, true, true, false, true),
    (cat_4, 'Çikolatalı Pizza', 'Chocolate Fruit Pizza', 'Muz, çilek, file badem, krep kırığı, pudra şekeri. • 860 kcal', 'Chocolate base topped with banana, strawberries, sliced almonds, crispy crepe flakes, powdered sugar. • 860 kcal', 580, '860 kcal', '[]'::jsonb, '/images/menu/pizza-cikolatali.jpg', 9, false, true, false, false, false, true),
    (cat_5, 'Sosisli Panuozzo', 'Beef Sausage Panuozzo', 'Cheddar sos, kornişon turşusu, kibrit patates, dana helal sosis, parmesan peyniri. (180 g hamur) • 870 kcal', 'Cheddar sauce, gherkin pickles, shoestring fries, halal beef sausage, parmesan cheese. • 870 kcal', 580, '870 kcal', '[]'::jsonb, '/images/menu/panuozzo-sosisli.jpg', 1, false, true, false, false, false, false),
    (cat_5, 'Acılı Tavuklu Panuozzo', 'Spicy Chicken Panuozzo', 'Panelenmiş çıtır tavuk parçaları, sriracha sos, kırmızı soğan, roka. • 870 kcal', 'Breaded crispy chicken tenders, sriracha sauce, red onion, fresh arugula. • 870 kcal', 540, '870 kcal', '[]'::jsonb, '/images/menu/panuozzo-acili-tavuklu.jpg', 2, false, true, false, false, true, false),
    (cat_5, 'Caprese Classic Panuozzo', 'Caprese Classic Panuozzo', 'Pembe domates, suda mozzarella, pesto sos, fesleğen, domates sos. • 870 kcal', 'Pink tomatoes, fresh mozzarella, basil pesto sauce, fresh basil leaves, tomato sauce. • 870 kcal', 540, '870 kcal', '[]'::jsonb, '/images/menu/panuozzo-caprese.jpg', 3, false, true, false, false, false, true),
    (cat_5, 'Etli Panuozzo', 'Kastamonu Pastrami Panuozzo', 'Kastamonu pastırma, Kars gravyer, mor soğan, harissa sos, roka. • 870 kcal', 'Kastamonu pastrami, Kars gruyere cheese, red onion, harissa sauce, fresh arugula. • 870 kcal', 650, '870 kcal', '[]'::jsonb, '/images/menu/panuozzo-etli.jpg', 4, true, true, false, true, false, false),
    (cat_6, 'Çocuk Menüsü Tavuk Burger', 'Kids Menu Chicken Burger', '1 adet tavuk but burger, marul, domates ve kornişon turşusu; yanında patates kızartması ve ayran. • 780 kcal', '1 chicken thigh burger with lettuce, tomato, and pickles; served with french fries and ayran. • 780 kcal', 420, '780 kcal', '[]'::jsonb, '/images/menu/cocuk-tavuk-burger.jpg', 1, false, true, false, false, false, false),
    (cat_6, 'Çocuk Menüsü Et Burger', 'Kids Menu Beef Burger', '1 adet smash burger köftesi, marul, domates ve kornişon turşusu; yanında patates kızartması ve ayran. • 780 kcal', '1 smash beef burger with lettuce, tomato, and pickles; served with french fries and ayran. • 780 kcal', 420, '780 kcal', '[]'::jsonb, '/images/menu/cocuk-et-burger.jpg', 2, false, true, false, false, false, false),
    (cat_7, 'French Fries (Patates Kızartması)', 'French Fries', 'Altın sarısı çıtır patates kızartması.', 'Golden crispy French fries.', 150, NULL, '[]'::jsonb, '/images/menu/patates-french-fries.jpg', 1, false, true, false, false, false, true),
    (cat_7, 'Cheddar Sauce French Fries', 'Cheddar Sauce French Fries', 'Eritilmiş sıcak cheddar peynir soslu çıtır patates kızartması.', 'Golden French fries topped with rich melted cheddar cheese sauce.', 210, NULL, '[]'::jsonb, '/images/menu/patates-cheddar.jpg', 2, false, true, false, false, false, true),
    (cat_7, 'Sweet French Fries (Tatlı Patates)', 'Sweet French Fries', 'Özel kesim çıtır tatlı patates kızartması.', 'Crispy sweet potato French fries.', 260, NULL, '[]'::jsonb, '/images/menu/patates-tatli.jpg', 3, false, true, false, false, false, true),
    (cat_8, 'Kendi Salatanı Kendin Yap', 'Build Your Own Salad', 'Taze yeşillikler ve seçeceğiniz gurme malzemelerle kendi salatanızı oluşturun. • 320 kcal', 'Build your own fresh gourmet salad bowl with seasonal greens and toppings. • 320 kcal', 440, '320 kcal', '[]'::jsonb, '/images/menu/salata-kendin-yap.jpg', 1, false, true, false, true, false, true),
    (cat_8, 'Salata Bar Ekstra Ürün (1 Çeşit)', 'Salad Bar Extra Topping (1 Item)', 'Salatanız için ekstra gurme malzeme seçimi (1 çeşit). • ~40 kcal', 'Extra salad bar topping selection (1 item). • ~40 kcal', 50, '~40 kcal', '[]'::jsonb, '/images/menu/salata-ekstra-urun.jpg', 2, false, true, false, false, false, true),
    (cat_8, 'Fırınlanmış Patates', 'Oven-Roasted Potatoes', 'Taze biberiye ve baharatlarla fırınlanmış elma dilim patates. • 240 kcal', 'Oven-roasted potato wedges with fresh rosemary and herbs. • 240 kcal', 150, '240 kcal', '[]'::jsonb, '/images/menu/garnitur-firin-patates.jpg', 3, false, true, false, false, false, true),
    (cat_8, 'Coleslaw', 'Coleslaw', 'Taze lahana, havuç ve özel kremalı sos. • 220 kcal', 'Fresh shredded cabbage and carrots in signature creamy dressing. • 220 kcal', 130, '220 kcal', '[]'::jsonb, '/images/menu/garnitur-coleslaw.jpg', 4, false, true, false, false, false, true),
    (cat_8, 'Akdeniz Salatası', 'Mediterranean Salad', 'Domates, salatalık, kırmızı soğan, maydanoz ve zeytinyağı-limon sos. • 110 kcal', 'Tomatoes, cucumber, red onion, parsley, and extra virgin olive oil dressing. • 110 kcal', 160, '110 kcal', '[]'::jsonb, '/images/menu/garnitur-akdeniz-salatasi.jpg', 5, false, true, false, false, false, true),
    (cat_8, 'Yasemin Pilavı', 'Jasmine Rice', 'Tane tane demlenmiş aromatik yasemin pilavı. • 300 kcal', 'Fluffy aromatic steamed jasmine rice. • 300 kcal', 140, '300 kcal', '[]'::jsonb, '/images/menu/garnitur-yasemin-pilavi.jpg', 6, false, true, false, false, false, true),
    (cat_8, 'Taam Siyez Bulgur Pilavı', 'TAAM Siyez Bulgur Pilaf', 'Kastamonu ata tohumu siyez bulgurundan özel pilav. • 280 kcal', 'Traditional pilaf made from heirloom Kastamonu einkorn siyez bulgur. • 280 kcal', 150, '280 kcal', '[]'::jsonb, '/images/menu/garnitur-siyez-bulgur.jpg', 7, false, true, false, true, false, true),
    (cat_8, 'Patates Püresi Kaşarlı', 'Mashed Potatoes with Kashar Cheese', 'Fırında eritilmiş kaşar peynirli ipeksi patates püresi. • 320 kcal', 'Silky mashed potatoes gratinated with melted kashar cheese. • 320 kcal', 160, '320 kcal', '[]'::jsonb, '/images/menu/garnitur-patates-puresi.jpg', 8, false, true, false, false, false, true),
    (cat_8, 'Süt Mısır, Baby Patates, Pancar', 'Sweet Corn, Baby Potatoes & Beetroot', 'Tatlı süt mısır, fırın baby patates ve pancar üçlüsü. • ~150 kcal', 'Sweet corn kernels, roasted baby potatoes, and tender beetroot trio. • ~150 kcal', 160, '~150 kcal', '[]'::jsonb, '/images/menu/garnitur-sut-misir-pancar.jpg', 9, false, true, false, false, false, true),
    (cat_8, 'Köz Kapya, Biberler, Domates, Mantar', 'Roasted Capia, Peppers, Tomato & Mushrooms', 'Ateşte közlenmiş kapya biber, yeşil biber, çeri domates ve mantar. • ~90 kcal', 'Char-roasted red capia pepper, green pepper, cherry tomatoes, and mushrooms. • ~90 kcal', 130, '~90 kcal', '[]'::jsonb, '/images/menu/garnitur-koz-kapya.jpg', 10, false, true, false, false, false, true),
    (cat_8, 'Tereyağlı Nohutlu Pilav', 'Buttery Chickpea Rice Pilaf', 'Tereyağlı ve nohutlu geleneksel pirinç pilavı. • ~330 kcal', 'Traditional buttery rice pilaf topped with tender chickpeas. • ~330 kcal', 140, '~330 kcal', '[]'::jsonb, '/images/menu/garnitur-nohutlu-pilav.jpg', 11, false, true, false, false, false, true),
    (cat_8, 'Mac & Cheese', 'Mac & Cheese', 'Fırınlanmış yoğun peynir soslu Mac & Cheese. • ~420 kcal', 'Oven-baked creamy cheesy macaroni. • ~420 kcal', 160, '~420 kcal', '[]'::jsonb, '/images/menu/garnitur-mac-and-cheese.jpg', 12, false, true, false, false, false, true),
    (cat_8, 'Ekstra Sos', 'Extra Dipping Sauce', 'Özel ev yapımı gurme sos seçimi. • ~90 kcal', 'House-made signature dipping sauce. • ~90 kcal', 50, '~90 kcal', '[]'::jsonb, '/images/menu/garnitur-ekstra-sos.jpg', 13, false, true, false, false, false, true),
    (cat_9, 'Ekşi Mayalı Kahvaltı', 'Sourdough Breakfast Plate', 'Yumuşacık çırpılmış yumurta (üzerinde taze frenk soğanı), çeri domates, taze roka, dilimlenmiş avokado, pancar, ceviz, küçük kasede çilek reçeli, İzmir tulum peyniri ve Kars kaşar peyniri. • ~750 kcal', 'Fluffy scrambled eggs with chives, cherry tomatoes, fresh arugula, sliced avocado, beetroot, walnuts, strawberry jam, Izmir tulum cheese, and Kars kashar cheese. • ~750 kcal', 590, '~750 kcal', '[]'::jsonb, '/images/menu/kahvalti-eksi-mayali.jpg', 1, false, true, false, true, false, true),
    (cat_9, 'Kruvasanlı Kahvaltı', 'Croissant Breakfast Plate', 'Büyük fırınlanmış tereyağlı kruvasan, mozzarella, Kars kaşarı, taze fesleğen, halhalı zeytin, çeri domates, salatalık, bir adet göz yumurta, üzeri pirinç fındıklı fıstık kreması ve taze roka. • ~900 kcal', 'Large baked butter croissant, mozzarella, Kars kashar, fresh basil, olives, cherry tomatoes, cucumber, sunny-side-up egg, pistachio cream with crushed hazelnuts, and fresh arugula. • ~900 kcal', 590, '~900 kcal', '[]'::jsonb, '/images/menu/kahvalti-kruvasanli.jpg', 2, false, true, false, true, false, true),
    (cat_9, 'Simitli Kahvaltı', 'Traditional Simit Breakfast Plate', 'Geleneksel bol susamlı çıtır simit, küçük kasede çilek reçeli, ikiye bölünmüş haşlanmış yumurta, çeri domates, salatalık, üçgen eritme peyniri ve İzmir tulum peyniri. • ~720 kcal', 'Traditional crispy sesame simit, strawberry jam, halved boiled egg, cherry tomatoes, cucumber, melted triangle cheese, and Izmir tulum cheese. • ~720 kcal', 590, '~720 kcal', '[]'::jsonb, '/images/menu/kahvalti-simitli.jpg', 3, false, true, false, false, false, true),
    (cat_10, 'Bal Petekli Dondurma', 'Honeycomb Ice Cream', 'Doğal bal peteği parçalı günlük taze ve doğal dondurma. • ~250 kcal', 'Daily fresh and natural artisanal ice cream topped with honeycomb. • ~250 kcal', 240, '~250 kcal', '[]'::jsonb, '/images/menu/dondurma-bal-petekli.jpg', 1, false, true, false, true, false, true),
    (cat_10, 'Tuzlu Karamelli Dondurma', 'Salted Caramel Ice Cream', 'Deniz tuzlu karamel soslu ve karamel parçacıklı günlük taze dondurma. • ~250 kcal', 'Daily fresh artisanal ice cream drizzled with sea-salted caramel. • ~250 kcal', 240, '~250 kcal', '[]'::jsonb, '/images/menu/dondurma-tuzlu-karamelli.jpg', 2, false, true, false, false, false, true),
    (cat_10, 'Tiramisu Dondurma', 'Tiramisu Ice Cream', 'Kakao ve espresso aromalı günlük taze tiramisu dondurma. • ~260 kcal', 'Rich tiramisu-inspired ice cream dusted with fine cocoa. • ~260 kcal', 240, '~260 kcal', '[]'::jsonb, '/images/menu/dondurma-tiramisu.jpg', 3, false, true, false, false, false, true),
    (cat_10, 'Frozen Yoğurt Sade', 'Plain Frozen Yogurt', 'Günlük taze ve doğal sade frozen yoğurt. • ~140 kcal', 'Daily fresh and natural plain frozen yogurt. • ~140 kcal', 130, '~140 kcal', '[]'::jsonb, '/images/menu/dondurma-frozen-yogurt.jpg', 4, false, true, false, false, false, true),
    (cat_10, 'Dondurma Sade', 'Plain Milk Ice Cream', 'Günlük taze ve doğal sade sütlü dondurma. • ~200 kcal', 'Daily fresh and natural plain milk ice cream. • ~200 kcal', 130, '~200 kcal', '[]'::jsonb, '/images/menu/dondurma-sade.jpg', 5, false, true, false, false, false, true),
    (cat_10, 'Özgür Ol, Dondurmalı Kaseni Yap', 'Create Your Own Ice Cream Bowl', 'Dilediğin dondurma topları, çikolata sosu, renkli şekerlemeler ve külah ile kendi dondurma kaseni yap. • ~600 kcal', 'Create your own custom ice cream bowl with assorted scoops, chocolate drizzle, candies, and waffle cone. • ~600 kcal', 130, '~600 kcal', '[]'::jsonb, '/images/menu/dondurma-kaseni-yap.jpg', 6, false, true, true, false, false, true),
    (cat_11, 'Sıcak Elmalı Crumble', 'Warm Apple Crumble', 'Fırından sıcak çıkan tarçınlı elma dolgulu kıtır crumble. • ~380 kcal', 'Warm oven-baked cinnamon apple crumble with golden oat topping. • ~380 kcal', 340, '~380 kcal', '[]'::jsonb, '/images/menu/tatli-elmali-crumble.jpg', 1, false, true, false, false, false, true),
    (cat_11, 'Sıcak Vişneli Crumble', 'Warm Sour Cherry Crumble', 'Fırından sıcak çıkan vişne dolgulu tereyağlı kıtır crumble. • ~380 kcal', 'Warm oven-baked sour cherry crumble with buttery oat crust. • ~380 kcal', 340, '~380 kcal', '[]'::jsonb, '/images/menu/tatli-visneli-crumble.jpg', 2, false, true, false, false, false, true),
    (cat_11, 'Tahin Cinnamon Roll', 'Tahini Cinnamon Roll', 'Tahinli glazür soslu sıcak tarçınlı rulo çörek. • ~450 kcal', 'Warm cinnamon roll topped with rich stone-ground tahini glaze. • ~450 kcal', 310, '~450 kcal', '[]'::jsonb, '/images/menu/tatli-tahin-cinnamon-roll.jpg', 3, false, true, false, true, false, true),
    (cat_11, 'Deniz Tuzlu & Karamel', 'Sea Salt & Caramel Cookie', 'Deniz tuzu kristalleri ve akışkan karamel dolgulu fırın lezzeti. • ~490 kcal', 'Freshly baked cookie infused with flaky sea salt and gooey caramel. • ~490 kcal', 330, '~490 kcal', '[]'::jsonb, '/images/menu/tatli-deniz-tuzlu-karamel.jpg', 4, false, true, false, false, false, true),
    (cat_11, 'Çıtır Çikolatalı Kek', 'Crispy Chocolate Cake', 'Yoğun çikolata katmanlı ve çıtır dokulu çikolatalı kek. • ~420 kcal', 'Rich chocolate layer cake topped with crispy chocolate crunch. • ~420 kcal', 320, '~420 kcal', '[]'::jsonb, '/images/menu/tatli-citir-cikolatali-kek.jpg', 5, false, true, false, false, false, true),
    (cat_11, 'Çikolatalı Pancake', 'Chocolate Pancake Stack', 'Yoğun çikolata soslu kabarık Amerikan pancake kulesi. • ~520 kcal', 'Fluffy American pancake stack generously topped with rich chocolate ganache. • ~520 kcal', 450, '~520 kcal', '[]'::jsonb, '/images/menu/tatli-cikolatali-pancake.jpg', 6, false, true, false, true, false, true),
    (cat_11, 'Vişneli Pancake', 'Sour Cherry Pancake Stack', 'Taze vişne taneli sos ile servis edilen kabarık Amerikan pancake kulesi. • ~520 kcal', 'Fluffy American pancake stack topped with sour cherry compote. • ~520 kcal', 450, '~520 kcal', '[]'::jsonb, '/images/menu/tatli-visneli-pancake.jpg', 7, false, true, false, false, false, true),
    (cat_12, 'Espresso', 'Espresso', '%100 Arabica çekirdeklerden yoğun ve kremalı espresso shot. • ~5 kcal', 'Rich and velvety 100% Arabica espresso shot. • ~5 kcal', 170, '~5 kcal', '[]'::jsonb, '/images/menu/sicak-espresso.jpg', 1, false, true, false, false, false, true),
    (cat_12, 'Türk Kahvesi', 'Turkish Coffee', 'Geleneksel usulde taze çekilmiş bol köpüklü Türk kahvesi. • ~10 kcal', 'Traditionally brewed finely ground Turkish coffee. • ~10 kcal', 160, '~10 kcal', '[]'::jsonb, '/images/menu/sicak-turk-kahvesi.jpg', 2, false, true, false, false, false, true),
    (cat_12, 'Filtre Kahve', 'Filter Coffee', 'Taze demlenmiş dengeli aromalı filtre kahve. • ~5 kcal', 'Freshly brewed balanced filter coffee. • ~5 kcal', 170, '~5 kcal', '[]'::jsonb, '/images/menu/sicak-filtre-kahve.jpg', 3, false, true, false, false, false, true),
    (cat_12, 'Americano', 'Americano', 'Sıcak su ile inceltilmiş çift shot espresso. • ~10 kcal', 'Double espresso shots over hot water. • ~10 kcal', 220, '~10 kcal', '[]'::jsonb, '/images/menu/sicak-americano.jpg', 4, false, true, false, false, false, true),
    (cat_12, 'Cafe Latte', 'Cafe Latte', 'İpeksi buharda ısıtılmış süt ve espresso dengesi. • ~150 kcal', 'Silky steamed milk poured over rich espresso. • ~150 kcal', 240, '~150 kcal', '[]'::jsonb, '/images/menu/sicak-cafe-latte.jpg', 5, false, true, false, false, false, true),
    (cat_12, 'Cappuccino', 'Cappuccino', 'Yoğun süt köpüğü, sıcak süt ve espresso. • ~120 kcal', 'Espresso topped with steamed milk and thick velvety foam. • ~120 kcal', 240, '~120 kcal', '[]'::jsonb, '/images/menu/sicak-cappuccino.jpg', 6, false, true, false, false, false, true),
    (cat_12, 'Cortado', 'Cortado', 'Eşit oranda espresso ve ılık süt. • ~90 kcal', 'Equal parts espresso and warm steamed milk. • ~90 kcal', 225, '~90 kcal', '[]'::jsonb, '/images/menu/sicak-cortado.jpg', 7, false, true, false, false, false, true),
    (cat_12, 'Flat White', 'Flat White', 'Çift shot espresso üzerine ince mikro köpüklü süt. • ~130 kcal', 'Double espresso topped with smooth microfoam milk. • ~130 kcal', 225, '~130 kcal', '[]'::jsonb, '/images/menu/sicak-flat-white.jpg', 8, false, true, false, false, false, true),
    (cat_12, 'Cafe Mocha', 'Cafe Mocha', 'Çikolata sosu, espresso ve buharda ısıtılmış süt. • ~250 kcal', 'Rich chocolate blended with espresso and steamed milk. • ~250 kcal', 285, '~250 kcal', '[]'::jsonb, '/images/menu/sicak-cafe-mocha.jpg', 9, false, true, false, false, false, true),
    (cat_12, 'White Chocolate Mocha', 'White Chocolate Mocha', 'Beyaz çikolata sosu, espresso ve kremalı sıcak süt. • ~320 kcal', 'White chocolate cream combined with espresso and steamed milk. • ~320 kcal', 285, '~320 kcal', '[]'::jsonb, '/images/menu/sicak-white-chocolate-mocha.jpg', 10, false, true, false, false, false, true),
    (cat_12, 'Chai Tea Latte', 'Chai Tea Latte', 'Aromatik baharat harmanlı siyah çay özü ve köpüklü sıcak süt. • ~200 kcal', 'Spiced black tea infusion with velvety steamed milk. • ~200 kcal', 295, '~200 kcal', '[]'::jsonb, '/images/menu/sicak-chai-tea-latte.jpg', 11, false, true, false, false, false, true),
    (cat_12, 'Affogato', 'Affogato', 'Vanilyalı dondurma topu üzerine dökülen sıcak espresso. • ~220 kcal', 'Vanilla ice cream scoop drowned in a shot of hot espresso. • ~220 kcal', 295, '~220 kcal', '[]'::jsonb, '/images/menu/sicak-affogato.jpg', 12, false, true, false, false, false, true),
    (cat_12, 'Hot Chocolate', 'Hot Chocolate', 'Yoğun çikolata ve sıcak süt lezzeti. • ~300 kcal', 'Rich melted chocolate with creamy hot milk. • ~300 kcal', 270, '~300 kcal', '[]'::jsonb, '/images/menu/sicak-hot-chocolate.jpg', 13, false, true, false, false, false, true),
    (cat_12, 'Sahlep', 'Traditional Sahlep', 'Tarçın dokunuşlu geleneksel sıcak sahlep. • ~250 kcal', 'Traditional hot orchid root drink dusted with cinnamon. • ~250 kcal', 280, '~250 kcal', '[]'::jsonb, '/images/menu/sicak-sahlep.jpg', 14, false, true, false, false, false, true),
    (cat_13, 'Iced Americano', 'Iced Americano', 'Buz üzerine çift shot espresso ve soğuk su. • ~10 kcal', 'Double espresso poured over ice and cold water. • ~10 kcal', 235, '~10 kcal', '[]'::jsonb, '/images/menu/soguk-iced-americano.jpg', 1, false, true, false, false, false, true),
    (cat_13, 'Iced Filter Coffee', 'Iced Filter Coffee', 'Buzla servis edilen taze demlenmiş soğuk filtre kahve. • ~5 kcal', 'Freshly brewed filter coffee served chilled over ice. • ~5 kcal', 190, '~5 kcal', '[]'::jsonb, '/images/menu/soguk-iced-filter-coffee.jpg', 2, false, true, false, false, false, true),
    (cat_13, 'Iced Latte', 'Iced Latte', 'Buz, soğuk süt ve taze espresso buluşması. • ~150 kcal', 'Cold milk and rich espresso served over ice. • ~150 kcal', 250, '~150 kcal', '[]'::jsonb, '/images/menu/soguk-iced-latte.jpg', 3, false, true, false, false, false, true),
    (cat_13, 'Iced Mocha', 'Iced Mocha', 'Çikolata sosu, soğuk süt, buz ve espresso. • ~260 kcal', 'Chocolate sauce, cold milk, and espresso over ice. • ~260 kcal', 320, '~260 kcal', '[]'::jsonb, '/images/menu/soguk-iced-mocha.jpg', 4, false, true, false, false, false, true),
    (cat_13, 'Iced White Chocolate Mocha', 'Iced White Chocolate Mocha', 'Beyaz çikolata aroması, soğuk süt, buz ve espresso. • ~330 kcal', 'White chocolate sauce, cold milk, and espresso on ice. • ~330 kcal', 320, '~330 kcal', '[]'::jsonb, '/images/menu/soguk-iced-white-mocha.jpg', 5, false, true, false, false, false, true),
    (cat_13, 'Iced Chocolate', 'Iced Chocolate', 'Buzlu soğuk süt ve yoğun çikolata lezzeti. • ~280 kcal', 'Rich chocolate blended with ice-cold milk. • ~280 kcal', 260, '~280 kcal', '[]'::jsonb, '/images/menu/soguk-iced-chocolate.jpg', 6, false, true, false, false, false, true),
    (cat_13, 'Limonata', 'Homemade Lemonade', 'Taze sıkılmış ferahlatıcı ev yapımı limonata. • ~120 kcal', 'Refreshing freshly squeezed homemade lemonade. • ~120 kcal', 230, '~120 kcal', '[]'::jsonb, '/images/menu/soguk-limonata.jpg', 7, false, true, false, false, false, true),
    (cat_13, 'Sütlü Limonata', 'Creamy Milk Lemonade', 'Taze limonata ve sütün yumuşak ferahlatıcı uyumu. • ~180 kcal', 'Refreshing lemonade blended with smooth creamy milk. • ~180 kcal', 250, '~180 kcal', '[]'::jsonb, '/images/menu/soguk-sutlu-limonata.jpg', 8, false, true, false, true, false, true),
    (cat_14, 'Demleme Çay', 'Brewed Turkish Tea', 'Taze demlenmiş geleneksel ince belli bardakta çay. • ~2 kcal', 'Freshly brewed traditional Turkish black tea. • ~2 kcal', 80, '~2 kcal', '[]'::jsonb, '/images/menu/cay-demleme.jpg', 1, false, true, false, false, false, true),
    (cat_14, 'Yeşil Çay', 'Green Tea', 'Doğal yapraklardan demlenmiş ferahlatıcı yeşil çay. • ~2 kcal', 'Delicate antioxidant-rich whole leaf green tea. • ~2 kcal', 250, '~2 kcal', '[]'::jsonb, '/images/menu/cay-yesil.jpg', 2, false, true, false, false, false, true),
    (cat_14, 'Kış Çayı', 'Winter Herbal Tea', 'Tarçın, karanfil, narenciye ve şifalı bitkilerle demlenmiş kış çayı. • ~10 kcal', 'Warm herbal winter infusion with cinnamon, clove, and citrus. • ~10 kcal', 250, '~10 kcal', '[]'::jsonb, '/images/menu/cay-kis.jpg', 3, false, true, false, false, false, true),
    (cat_15, 'Su', 'Natural Spring Water', 'Doğal kaynak suyu. • ~0 kcal', 'Natural spring water. • ~0 kcal', 75, '~0 kcal', '[]'::jsonb, '/images/menu/mesrubat-sise.jpg', 1, false, true, false, false, false, true),
    (cat_15, 'Ayran', 'Ayran', 'Serinletici geleneksel ayran. • ~90 kcal', 'Refreshing traditional Turkish yogurt drink. • ~90 kcal', 90, '~90 kcal', '[]'::jsonb, '/images/menu/mesrubat-ayran.jpg', 2, false, true, false, false, false, true),
    (cat_15, 'Soda', 'Sparkling Mineral Water', 'Doğal maden suyu. • ~0 kcal', 'Natural sparkling mineral water. • ~0 kcal', 120, '~0 kcal', '[]'::jsonb, '/images/menu/mesrubat-sise.jpg', 3, false, true, false, false, false, true),
    (cat_15, 'Meyveli Soda', 'Fruit Flavored Mineral Water', 'Meyve aromalı doğal maden suyu. • ~90 kcal', 'Fruit-flavored sparkling mineral water. • ~90 kcal', 130, '~90 kcal', '[]'::jsonb, '/images/menu/mesrubat-sise.jpg', 4, false, true, false, false, false, true),
    (cat_15, 'Niğde Gazozu', 'Niğde Gazozu', 'Geleneksel Niğde gazozu. • ~110 kcal', 'Traditional Turkish Niğde soda. • ~110 kcal', 150, '~110 kcal', '[]'::jsonb, '/images/menu/mesrubat-sise.jpg', 5, false, true, false, false, false, true),
    (cat_15, 'Cola Turka', 'Cola Turka', 'Soğuk kutu Cola Turka. • ~105 kcal', 'Chilled Cola Turka. • ~105 kcal', 150, '~105 kcal', '[]'::jsonb, '/images/menu/mesrubat-kutu.jpg', 6, false, true, false, false, false, true),
    (cat_15, 'Cola Turka Şekersiz', 'Cola Turka Sugar-Free', 'Şekersiz soğuk Cola Turka. • ~2 kcal', 'Sugar-free chilled Cola Turka. • ~2 kcal', 150, '~2 kcal', '[]'::jsonb, '/images/menu/mesrubat-kutu.jpg', 7, false, true, false, false, false, true),
    (cat_15, 'Meysu Portakallı Gazoz', 'Meysu Orange Soda', 'Ferahlatıcı portakallı gazoz. • ~110 kcal', 'Refreshing orange soda. • ~110 kcal', 150, '~110 kcal', '[]'::jsonb, '/images/menu/mesrubat-kutu.jpg', 8, false, true, false, false, false, true),
    (cat_15, 'Juss Tea Limon', 'Juss Tea Lemon', 'Limon aromalı soğuk çay. • ~90 kcal', 'Lemon flavored iced tea. • ~90 kcal', 150, '~90 kcal', '[]'::jsonb, '/images/menu/mesrubat-bardak.jpg', 9, false, true, false, false, false, true),
    (cat_15, 'Juss Tea Şeftali', 'Juss Tea Peach', 'Şeftali aromalı soğuk çay. • ~90 kcal', 'Peach flavored iced tea. • ~90 kcal', 150, '~90 kcal', '[]'::jsonb, '/images/menu/mesrubat-bardak.jpg', 10, false, true, false, false, false, true),
    (cat_15, 'Juss Tea Ananas Mango', 'Juss Tea Pineapple Mango', 'Ananas ve mango aromalı tropikal soğuk çay. • ~95 kcal', 'Tropical pineapple & mango iced tea. • ~95 kcal', 150, '~95 kcal', '[]'::jsonb, '/images/menu/mesrubat-bardak.jpg', 11, false, true, false, false, false, true);

  INSERT INTO instagram_posts (image_url, instagram_url, caption_tr, caption_en, sort_order, is_active) VALUES
    ('/images/menu/burger-kastamonu-atesi.jpg', 'https://www.instagram.com/taamclub/', 'Kastamonu Ateşi Smash Burger 🔥', 'Kastamonu Fire Smash Burger 🔥', 1, true),
    ('/images/menu/pizza-dubai.jpg', 'https://www.instagram.com/taamclub/', 'Dubai Pizza & Kastamonu Pastırmalı Pizza 🍕', 'Dubai Pizza & Kastamonu Pastrami Pizza 🍕', 2, true),
    ('/images/menu/rotisserie-butun-aile.jpg', 'https://www.instagram.com/taamclub/', 'Rotisserie Bütün Tavuk / Aile Kutusu 🍗', 'Rotisserie Whole Chicken Family Box 🍗', 3, true),
    ('/images/menu/panuozzo-etli.jpg', 'https://www.instagram.com/taamclub/', 'Etli Panuozzo & Gurme Lezzetler 🥖', 'Kastamonu Pastrami Panuozzo 🥖', 4, true),
    ('/images/menu/kahvalti-kruvasanli.jpg', 'https://www.instagram.com/taamclub/', 'Kruvasanlı & Ekşi Mayalı Kahvaltı 🥐', 'Croissant & Sourdough Breakfast 🥐', 5, true),
    ('/images/menu/tatli-tahin-cinnamon-roll.jpg', 'https://www.instagram.com/taamclub/', 'Tahin Cinnamon Roll & Bal Petekli Dondurma 🍨', 'Tahini Cinnamon Roll & Honeycomb Ice Cream 🍨', 6, true);
END $$;
