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
  ('Smash Burger', 'Smash Burgers', 'smash-burger', 1, true),
  ('Tavuk & Kanat', 'Chicken & Wings', 'tavuk-ve-kanat', 2, true),
  ('Pizza (24 cm)', 'Pizza (24 cm)', 'pizza', 3, true),
  ('Patates & Garnitür', 'Fries & Sides', 'patates-ve-garnitur', 4, true),
  ('Tatlılar & Dondurma', 'Desserts & Ice Cream', 'tatlilar-ve-dondurma', 5, true),
  ('Kahvaltı', 'Breakfast', 'kahvalti', 6, true),
  ('Sıcak İçecekler', 'Hot Drinks', 'sicak-icecekler', 7, true),
  ('Soğuk İçecekler', 'Cold Drinks', 'soguk-icecekler', 8, true)
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
BEGIN
  SELECT id INTO cat_0 FROM categories WHERE slug = 'smash-burger';
  SELECT id INTO cat_1 FROM categories WHERE slug = 'tavuk-ve-kanat';
  SELECT id INTO cat_2 FROM categories WHERE slug = 'pizza';
  SELECT id INTO cat_3 FROM categories WHERE slug = 'patates-ve-garnitur';
  SELECT id INTO cat_4 FROM categories WHERE slug = 'tatlilar-ve-dondurma';
  SELECT id INTO cat_5 FROM categories WHERE slug = 'kahvalti';
  SELECT id INTO cat_6 FROM categories WHERE slug = 'sicak-icecekler';
  SELECT id INTO cat_7 FROM categories WHERE slug = 'soguk-icecekler';

  INSERT INTO products (
    category_id, name_tr, name_en, description_tr, description_en,
    price, portion, variants, image_url, sort_order,
    is_featured, is_active, is_new, is_signature, is_spicy, is_vegetarian
  ) VALUES
    (cat_0, 'TAAM Signature Smash', 'TAAM Signature Smash', 'Özel TAAM sosu, karamelize soğan, eritilmiş cheddar ve ev yapımı brioche ekmek.', 'Special TAAM sauce, caramelized onion, melted cheddar, and artisanal brioche bun.', 390, NULL, '[{"label_tr":"S (80g)","label_en":"S (80g)","price":390},{"label_tr":"M (160g)","label_en":"M (160g)","price":620},{"label_tr":"L (240g)","label_en":"L (240g)","price":840}]'::jsonb, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', 1, true, true, false, true, false, false),
    (cat_0, 'Truffle & Forest Smash', 'Truffle & Forest Smash', 'Yabani orman mantarları sotesi, trüflü mayonez, füme peynir ve taze yeşillikler.', 'Wild forest mushroom sauté, truffle mayo, smoked cheese, and fresh greens.', 390, NULL, '[{"label_tr":"S (80g)","label_en":"S (80g)","price":390},{"label_tr":"M (160g)","label_en":"M (160g)","price":620},{"label_tr":"L (240g)","label_en":"L (240g)","price":840}]'::jsonb, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80', 2, true, true, false, true, false, false),
    (cat_0, 'The TAAM Deli Smash', 'The TAAM Deli Smash', 'Özel füme antrikot dilimleri, çıtır kornişon relish, hardal emülsiyonu ve çift cheddar.', 'Pastrami style smoked beef slices, crispy cornichon relish, mustard emulsion, double cheddar.', 420, NULL, '[{"label_tr":"S (80g)","label_en":"S (80g)","price":420},{"label_tr":"M (160g)","label_en":"M (160g)","price":470},{"label_tr":"L (240g)","label_en":"L (240g)","price":860}]'::jsonb, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80', 3, false, true, true, false, false, false),
    (cat_0, 'Spicy Orient Smash', 'Spicy Orient Smash', 'Acılı harissa sos, közlenmiş kapya biber, jalapeno turşusu ve baharatlı smash köftesi.', 'Fiery harissa glaze, fire-roasted capsicum, pickled jalapenos, spiced smash patties.', 410, NULL, '[{"label_tr":"S (80g)","label_en":"S (80g)","price":410},{"label_tr":"M (160g)","label_en":"M (160g)","price":620},{"label_tr":"L (240g)","label_en":"L (240g)","price":840}]'::jsonb, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80', 4, false, true, false, false, true, false),
    (cat_1, 'Acı Bal Soslu Tavuk Burger', 'Hot Honey Chicken Burger', 'Çıtır panelenmiş but fileto, acı bal glaze sos, çıtır lahana salatası ve tereyağlı brioche.', 'Crispy fried thigh fillet, artisanal hot honey glaze, fresh slaw, and butter brioche.', 390, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&q=80', 1, true, true, true, true, true, false),
    (cat_1, 'Ranch Soslu Tavuk Burger', 'Ranch Chicken Burger', 'Altın sarısı çıtır tavuk, ev yapımı taze otlu ranch sos ve kornişon turşu.', 'Golden crispy chicken breast, house-made herb ranch dressing, and crunchy pickles.', 390, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80', 2, false, true, false, false, false, false),
    (cat_1, 'Çıtır Tavuk Parçaları', 'Crispy Chicken Tenders', 'Özel baharat marinasyonlu, dışı ekstra çıtır, içi sulu tavuk göğüs şeritleri.', 'Buttermilk spiced marinade, ultra crispy coated tender chicken breast strips.', 320, NULL, '[{"label_tr":"6''lı","label_en":"6 pcs","price":320},{"label_tr":"10''lu","label_en":"10 pcs","price":460},{"label_tr":"14''lü","label_en":"14 pcs","price":590}]'::jsonb, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80', 3, true, true, false, true, false, false),
    (cat_1, 'Çeyrek Piliç Çevirme Tabağı', 'Quarter Rotisserie Chicken Platter', 'Ağır ateşte nar gibi kızarmış taze piliç çevirme tabağı.', 'Slow-roasted rotisserie quarter chicken served with house spices.', 360, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80', 4, false, true, false, false, false, false),
    (cat_1, 'Yarım Piliç Çevirme Tabağı', 'Half Rotisserie Chicken Platter', 'Özel baharat karışımı ile dinlendirilmiş, nar gibi kızarmış yarım piliç.', 'Herb marinated succulent half roasted rotisserie chicken platter.', 540, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80', 5, false, true, false, false, false, false),
    (cat_1, 'Piliç Çevirme Family Box', 'Rotisserie Family Feast Box', 'Kalabalık sofralar için tam piliç çevirme ve özel eşlikçiler.', 'Whole roasted chicken family feast with signature seasonings.', 760, 'Family Box', '[]'::jsonb, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80', 6, false, true, false, true, false, false),
    (cat_1, 'Tavuk Pilav Kasesi', 'Chicken & Rice Comfort Bowl', 'Tiftiklenmiş piliç eti, tereyağlı pilav ve taze baharatlar.', 'Shredded roasted chicken served over buttery fragrant rice bowl.', 350, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', 7, false, true, false, false, false, false),
    (cat_1, 'Kanat + Garnitür (Harissa Soslu)', 'Harissa Glazed Wings + Side', 'Közlenmiş biberli harissa sosu ile marine edilmiş çıtır kanatlar, garnitür eşliğinde.', 'Crispy fried wings tossed in north-african harissa chili glaze + side included.', 320, NULL, '[{"label_tr":"6+1 Adet","label_en":"6+1 Wings","price":320},{"label_tr":"10+1 Adet","label_en":"10+1 Wings","price":460},{"label_tr":"14+1 Adet","label_en":"14+1 Wings","price":590}]'::jsonb, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80', 8, false, true, true, false, true, false),
    (cat_1, 'Kanat + Garnitür (Ballı Barbekü Soslu)', 'Honey BBQ Wings + Side', 'Tatlı ve tütsülü ballı barbekü sosuyla kaplanmış taze çıtır tavuk kanatları.', 'Tossed in rich honey smoky barbecue sauce with choice of signature side.', 320, NULL, '[{"label_tr":"6+1 Adet","label_en":"6+1 Wings","price":320},{"label_tr":"10+1 Adet","label_en":"10+1 Wings","price":460},{"label_tr":"14+1 Adet","label_en":"14+1 Wings","price":590}]'::jsonb, 'https://images.unsplash.com/photo-1527477321005-4d01d75ba89f?w=600&q=80', 9, false, true, false, false, false, false),
    (cat_1, 'Kanat + Garnitür (Ranch Soslu)', 'Ranch Wings + Side', 'Özel taze sarımsak ve frenk maydanozlu ranch sos eşliğinde çıtır kanatlar.', 'Tossed in signature creamy herb ranch dressing with side included.', 320, NULL, '[{"label_tr":"6+1 Adet","label_en":"6+1 Wings","price":320},{"label_tr":"10+1 Adet","label_en":"10+1 Wings","price":460},{"label_tr":"14+1 Adet","label_en":"14+1 Wings","price":590}]'::jsonb, 'https://images.unsplash.com/photo-1524182576066-1be9613770ec?w=600&q=80', 10, false, true, false, false, false, false),
    (cat_2, 'Pizza Margherita', 'Pizza Margherita', 'San Marzano domates sosu, fior di latte mozzarella, taze fesleğen, sızma zeytinyağı (24 cm).', 'San Marzano tomato sauce, fior di latte mozzarella, fresh basil, extra virgin olive oil (24 cm).', 270, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', 1, false, true, false, false, false, true),
    (cat_2, 'Pizza Vejeteryan', 'Vegetarian Pizza', 'Mevsim sebzeleri, közlenmiş biber, enginar kalbi, siyah zeytin ve mozzarella (24 cm).', 'Seasonal chargrilled veggies, artichoke hearts, black olives, mozzarella (24 cm).', 340, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80', 2, false, true, false, false, false, true),
    (cat_2, 'Pepperoni & Acı Bal Soslu Pizza', 'Pepperoni & Hot Honey Pizza', 'Dana pepperoni dilimleri, mozzarella ve fırından çıkar çıkmaz gezdirilen acı bal sosu (24 cm).', 'Beef pepperoni, mozzarella, and house-infused chili hot honey drizzle (24 cm).', 370, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80', 3, true, true, true, true, true, false),
    (cat_2, 'Pastırmalı & Eski Kaşarlı Pizza', 'Pastrami & Aged Kashar Pizza', 'Kayseri çemensiz pastırma, Kars eski kaşarı, karamelize arpacık soğan ve taze kekik (24 cm).', 'Artisanal cured pastrami, aged kashar cheese, caramelized shallots, fresh thyme (24 cm).', 460, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', 4, true, true, false, true, false, false),
    (cat_2, 'Dört Peynirli Pizza (Quattro Formaggi)', 'Quattro Formaggi Pizza', 'Mozzarella, gorgonzola, parmesan ve ezine peyniri harmanı (24 cm).', 'Mozzarella, gorgonzola, parmesan, and local aged brine cheese blend (24 cm).', 370, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1573821663912-569905455b1a?w=600&q=80', 5, false, true, false, false, false, true),
    (cat_2, 'Mantarlı & Trüflü Pizza', 'Truffle Mushroom Pizza', 'Kestane ve istiridye mantarları, beyaz trüf yağı dokunuşu, taze biberiye ve mozzarella (24 cm).', 'Chestnut & oyster mushrooms, aromatic white truffle oil, rosemary, mozzarella (24 cm).', 410, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80', 6, false, true, false, false, false, true),
    (cat_2, 'Sucuklu & Acı Bal Soslu Pizza', 'Turkish Sucuk & Hot Honey Pizza', 'Geleneksel kasap sucuk, mozzarella, biber turşusu ve acı bal sosu (24 cm).', 'Butcher sucuk sausage, rich mozzarella, peppers, and hot honey finish (24 cm).', 370, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&q=80', 7, false, true, false, false, true, false),
    (cat_2, 'TAAM Supreme Pizza', 'TAAM Supreme Pizza', 'Özel TAAM şarküteri seçkisi, mantar, köz biber, zeytin ve çift peynir katmanı (24 cm).', 'House charcuterie selection, mushrooms, roasted peppers, kalamata olives, double cheese (24 cm).', 460, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=600&q=80', 8, true, true, false, true, false, false),
    (cat_2, 'Tavuklu & Harissa Soslu Pizza', 'Chicken & Harissa Pizza', 'Fırınlanmış tavuk dilimleri, baharatlı harissa bazı, kırmızı soğan ve maydanoz (24 cm).', 'Roasted chicken slices, spicy harissa spread, red onion rings, fresh parsley (24 cm).', 370, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80', 9, false, true, true, false, true, false),
    (cat_2, 'Orman Meyveli & Cheesecake''li Pizza', 'Forest Berries & Cheesecake Dessert Pizza', 'Özel tatlı pizza hamuru, labne cheesecake kreması, taze böğürtlen ve frambuaz sosu (24 cm).', 'Sweet pastry pizza crust, rich cheesecake cream base, wild forest berries coulis (24 cm).', 390, '24 cm', '[]'::jsonb, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80', 10, false, true, true, true, false, true),
    (cat_3, 'Triple Cooked Patates', 'Triple Cooked Chunky Fries', 'Üç aşamalı özel pişirme tekniğiyle dışı çıtır cam gibi, içi kadife patates.', 'Triple blanched and crisped artisanal potatoes seasoned with sea salt.', 360, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&q=80', 1, true, true, false, true, false, true),
    (cat_3, 'Peynir Soslu Patates', 'Loaded Melted Cheese Fries', 'Sıcak cheddar sosu ve taze frenk soğanı ile servis edilen çıtır patates.', 'Warm aged cheddar cheese sauce and chives drizzled over golden fries.', 540, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&q=80', 2, false, true, false, false, false, true),
    (cat_3, 'Tatlı Patates Kızartması', 'Crispy Sweet Potato Fries', 'Hafif karamelize, özel baharatlı çıtır tatlı patates çubukları.', 'Naturally sweet and crispy sweet potato fries served with dip.', 760, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1605698802011-8973617be3a6?w=600&q=80', 3, false, true, true, false, false, true),
    (cat_3, 'Fırın Patates', 'Oven Roasted Herb Potatoes', 'Biberiye, sarımsak ve sızma zeytinyağı ile fırınlanmış bebek patatesler.', 'Baby potatoes roasted with rosemary, garlic, and cold pressed olive oil.', 150, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1536768139911-e290a59011e4?w=600&q=80', 4, false, true, false, false, false, true),
    (cat_3, 'Coleslaw', 'House Coleslaw', 'Taze mor ve beyaz lahana, rendelenmiş havuç ve hafif hardallı sos.', 'Crunchy red and white cabbage, shredded carrots, and creamy mustard dressing.', 130, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=600&q=80', 5, false, true, false, false, false, true),
    (cat_3, 'Akdeniz Salatası', 'Mediterranean Garden Salad', 'Taze roka, göbek, kiraz domates, salatalık, zeytinyağı ve limon sos.', 'Fresh wild arugula, cherry tomatoes, cucumbers, extra virgin olive oil vinaigrette.', 160, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80', 6, false, true, false, false, false, true),
    (cat_3, 'Yasemin Pilavı', 'Fragrant Jasmine Rice', 'Tane tane pişmiş, hafif aromatik tereyağlı yasemin pilavı.', 'Fluffy steamed jasmine rice delicately infused with butter.', 140, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80', 7, false, true, false, false, false, true),
    (cat_3, 'TAAM Siyez Bulgur Pilavı', 'TAAM Ancient Siyez Bulgur Pilaf', 'Kastamonu ata tohumu siyez bulguru, domates ve biber tereyağı lezzetiyle.', 'Anatolian heirloom einkorn wheat bulgur cooked slowly with tomatoes and peppers.', 150, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&q=80', 8, false, true, true, true, false, true),
    (cat_3, 'Patates Püresi', 'Creamy Butter Mashed Potatoes', 'Taze süt ve bol tereyağı ile ipeksi kıvama getirilmiş taze patates püresi.', 'Silky smooth whipped potatoes with sweet butter and cream.', 160, 'Standart', '[]'::jsonb, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80', 9, false, true, false, false, false, true),
    (cat_4, 'Bal Petekli Dondurma', 'Honeycomb Gelato', 'Doğal petek bal parçaları ve manda sütlü yoğun İtalyan usulü dondurma.', 'Authentic buffalo milk gelato swirled with crunchy natural honeycomb chunks.', 240, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80', 1, false, true, false, false, false, true),
    (cat_4, 'Tuzlu Karamelli Dondurma', 'Salted Caramel Gelato', 'Deniz tuzuyla dengelenmiş yoğun ev yapımı sıcak karamel dokusu.', 'Handcrafted sea salted caramel gelato with rich butter ribbon swirl.', 240, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=80', 2, false, true, false, false, false, true),
    (cat_4, 'Tiramisu Dondurma', 'Tiramisu Gelato', 'Mascarpone kreması, espresso çekirdekleri ve kakao tozlu İtalyan lezzeti.', 'Italian mascarpone gelato with espresso soaked sponge and dark cocoa.', 240, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=600&q=80', 3, false, true, false, false, false, true),
    (cat_4, 'Çikolatalı Amerikan Pancake', 'Chocolate American Pancake Stack', 'Üç kat kabarık pancake, Belçika çikolatası ganajı ve taze meyveler.', 'Triple fluffy buttermilk pancake stack with Belgian chocolate ganache.', 360, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80', 4, true, true, false, true, false, true),
    (cat_4, 'Vişneli Amerikan Pancake', 'Sour Cherry American Pancake Stack', 'Kabarık sıcak pancake, mayhoş vişne kompostosu ve vanilyalı krema.', 'Fluffy pancake stack paired with tangy sour cherry compote & vanilla cream.', 360, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&q=80', 5, false, true, false, false, false, true),
    (cat_4, 'Muz & Karamelli Pancake', 'Banana & Salted Toffee Pancake', 'Karamelize taze muz dilimleri, sıcak toffee karameli ve ceviz kırıkları.', 'Caramelized fresh bananas, warm butter toffee sauce, and toasted walnuts.', 370, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&q=80', 6, false, true, false, false, false, true),
    (cat_4, 'Sıcak Elmalı Crumble', 'Warm Apple Crumble', 'Tarçınlı elma dilimleri, fırınlanmış tereyağlı çıtır crumble hamuru ve vanilyalı dondurma.', 'Cinnamon spiced apples baked under buttery crispy oat crumble with vanilla gelato.', 340, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600&q=80', 7, true, true, true, true, false, true),
    (cat_4, 'Sıcak Vişneli Crumble', 'Warm Sour Cherry Crumble', 'Fırından sıcak çıkan mayhoş vişne dolgusu ve altın rengi tereyağlı kıtır kabuk.', 'Baked tart sour cherry filling topped with golden crumbly pastry.', 340, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80', 8, false, true, false, false, false, true),
    (cat_4, 'Tahin Cinnamon Roll', 'Tahini Cinnamon Roll', 'Taş değirmen tahini, esmer şeker ve tarçın harmanı ile sıcacık fırın çöreği.', 'Warm artisan brioche roll with stone-ground tahini, brown sugar & cinnamon glaze.', 310, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80', 9, false, true, true, true, false, true),
    (cat_4, 'Deniz Tuzlu & Karamelli Brownie', 'Sea Salt & Salted Caramel Brownie', 'Yoğun bitter çikolatalı ıslak brownie, deniz tuzu pulları ve sıcak karamel dolgusu.', 'Fudgy dark chocolate brownie infused with Maldon sea salt and butter caramel.', 330, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80', 10, false, true, false, false, false, true),
    (cat_4, 'Çıtır Çikolatalı Kek', 'Crispy Crunchy Chocolate Cake', 'Fırınlanmış çıtır çikolata katmanları ve yumuşacık çikolatalı sünger kek.', 'Crispy feuilletine crunch layers layered with moist chocolate sponge.', 320, 'Porsiyon', '[]'::jsonb, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 11, false, true, false, false, false, true),
    (cat_5, 'Danimarka Kahvaltı Tabağı', 'Danish Breakfast Platter', 'Ekşi mayalı çavdar ekmeği, füme peynir, haşlanmış yumurta, tereyağı, taze reçel, meyveler ve dana jambon.', 'Sourdough rye bread, smoked Havarti cheese, soft boiled egg, whipped butter, berries, cold cuts.', 480, 'Tek Kişilik Zengin Tabak', '[]'::jsonb, 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80', 1, true, true, true, true, false, false),
    (cat_6, 'Türk Kahvesi', 'Traditional Turkish Coffee', 'Taze çekilmiş özel harman çekirdekler, bakır cezvede ağır ateşte pişirilir.', 'Freshly ground premium blend slowly brewed in traditional copper pots.', 160, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=600&q=80', 1, false, true, false, false, false, true),
    (cat_6, 'Espresso', 'Espresso Single', '%100 Arabica nitelikli çekirdeklerden yoğun ve kremalı tek shot.', '100% Arabica specialty beans, velvety crema and rich body.', 170, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80', 2, false, true, false, false, false, true),
    (cat_6, 'Filtre Kahve', 'Batch Brew Filter Coffee', 'Günün taze demlenmiş dengeli gövdeli filtre kahvesi.', 'Freshly brewed daily batch filter coffee with delicate notes.', 170, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80', 3, false, true, false, false, false, true),
    (cat_6, 'Americano', 'Caffè Americano', 'Çift shot espresso ve sıcak suyun sade ve berrak buluşması.', 'Double espresso shots poured over hot water for a clean cup.', 220, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&q=80', 4, false, true, false, false, false, true),
    (cat_6, 'Cafe Latte', 'Caffè Latte', 'İpeksi mikro köpürtülmüş taze süt ve espresso dengesi.', 'Silky steamed milk poured over rich espresso shot.', 240, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&q=80', 5, false, true, false, false, false, true),
    (cat_6, 'Cappuccino', 'Cappuccino', 'Yoğun kadifemsi süt köpüğü ve aromatik espresso.', 'Equal parts espresso, steamed milk, and velvety thick milk foam.', 240, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80', 6, false, true, false, false, false, true),
    (cat_6, 'Cortado', 'Cortado', 'Bire bir oranda espresso ve ılık buharda süt.', 'Equal ratio of espresso to warm steamed milk in a small cup.', 225, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&q=80', 7, false, true, false, false, false, true),
    (cat_6, 'Flat White', 'Flat White', 'Çift ristretto shot üzerine ince mikro köpük süt.', 'Double ristretto with a smooth thin layer of microfoam.', 225, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&q=80', 8, false, true, false, false, false, true),
    (cat_6, 'Cafe Mocha', 'Caffè Mocha', 'Yoğun bitter çikolata sosu, espresso ve kremalı süt.', 'Dark chocolate sauce melted with espresso and steamed milk.', 285, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&q=80', 9, false, true, false, false, false, true),
    (cat_6, 'White Chocolate Mocha', 'White Chocolate Mocha', 'Beyaz çikolata aroması, espresso ve buharda ısıtılmış süt.', 'White chocolate cream combined with rich espresso and milk.', 285, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', 10, false, true, false, false, false, true),
    (cat_6, 'Chai Tea Latte', 'Spiced Chai Tea Latte', 'Zencefil, tarçın, kakule ve karanfil baharat karışımlı sütlü siyah çay.', 'Black tea infused with cardamom, cinnamon, ginger, and steamed milk.', 295, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80', 11, false, true, false, false, false, true),
    (cat_6, 'Affogato', 'Classic Affogato', 'Bir top vanilyalı dondurma üzerine dökülen sıcak taze espresso shot.', 'A scoop of premium vanilla bean gelato drowned in hot espresso shot.', 295, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=600&q=80', 12, false, true, false, true, false, true),
    (cat_6, 'Hot Chocolate (Sıcak Çikolata)', 'Artisanal Hot Chocolate', 'Gerçek eritilmiş Belçika çikolatası ve tam yağlı sıcak süt.', 'Rich melted Belgian chocolate blended with creamy hot milk.', 270, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&q=80', 13, false, true, false, false, false, true),
    (cat_6, 'Geleneksel Sahlep', 'Traditional Orchid Sahlep', 'Doğal dağ sahlebi, tarçın tozu ve sıcak süt ile geleneksel kış lezzeti.', 'Authentic wild orchid sahlep root drink dusted with ground cinnamon.', 280, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', 14, false, true, false, false, false, true),
    (cat_6, 'Demleme Çay', 'Traditional Brewed Turkish Tea', 'Doğu Karadeniz ilk hasat yapraklarından taze demlenmiş berrak çay.', 'Freshly brewed loose-leaf black tea from Rize gardens.', 80, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80', 15, false, true, false, false, false, true),
    (cat_6, 'Yeşil Çay', 'Pure Green Tea', 'Antioksidan zengini narin yeşil çay yaprakları.', 'Delicate whole-leaf green tea rich in antioxidants.', 250, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&q=80', 16, false, true, false, false, false, true),
    (cat_6, 'Kış Çayı', 'Herbal Winter Blend Tea', 'Ihlamur, zencefil, elma kurusu, tarçın kabuğu ve karanfil harmanı.', 'Soothing blend of linden, dried apple, cinnamon bark, and cloves.', 250, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&q=80', 17, false, true, false, false, false, true),
    (cat_7, 'Caffe Americano (Buzlu)', 'Iced Caffè Americano', 'Buz küpleri üzerine çift shot espresso ve soğuk filtrelenmiş su.', 'Double espresso poured over ice and crisp cold filtered water.', 235, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80', 1, false, true, false, false, false, true),
    (cat_7, 'Soğuk Filtre Kahve', 'Iced Filter Coffee', 'Buz üzerinde demlenen ferahlatıcı taze filtre kahve.', 'Slow-cooled specialty filter coffee served over clear ice blocks.', 190, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80', 2, false, true, false, false, false, true),
    (cat_7, 'Soğuk Caffe Latte', 'Iced Caffè Latte', 'Bol buz, soğuk süt ve espresso katmanları.', 'Chilled milk layered with fresh espresso over ice.', 250, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80', 3, false, true, false, false, false, true),
    (cat_7, 'Soğuk Caffe Mocha', 'Iced Caffè Mocha', 'Soğuk bitter çikolata şurubu, taze espresso ve süt.', 'Dark chocolate syrup, espresso, and cold milk over ice.', 320, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80', 4, false, true, false, false, false, true),
    (cat_7, 'Soğuk White Chocolate Mocha', 'Iced White Chocolate Mocha', 'Beyaz çikolata, espresso, soğuk süt ve buz ferahlığı.', 'Velvety white chocolate, cold milk, and espresso on ice.', 320, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', 5, false, true, false, false, false, true),
    (cat_7, 'Soğuk Çikolata (Iced Chocolate)', 'Iced Rich Chocolate', 'Yoğun kakao ve soğuk süt lezzeti.', 'Rich chocolate ganache shaken with ice cold whole milk.', 260, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&q=80', 6, false, true, false, false, false, true),
    (cat_7, 'Ev Yapımı Limonata', 'Fresh Homemade Lemonade', 'Sıkma taze limon, nane yaprakları ve hafif pancar şekeri dengesi.', 'Fresh squeezed lemons, crushed mint leaves, and light cane sugar balance.', 230, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80', 7, true, true, false, true, false, true),
    (cat_7, 'Sütlü Tahinli Limonata', 'Creamy Tahini Lemonade', 'TAAM özel tarifi: Taze limon ferahlığı, taş değirmen tahini ve badem sütü uyumu.', 'TAAM specialty creation: fresh lemon zest blended with stone-ground tahini & almond milk.', 250, NULL, '[]'::jsonb, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&q=80', 8, true, true, true, true, false, true);

  INSERT INTO instagram_posts (image_url, instagram_url, caption_tr, caption_en, sort_order, is_active) VALUES
    ('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', 'https://www.instagram.com/taamclub/', 'TAAM Signature Smash 🔥', 'TAAM Signature Smash 🔥', 1, true),
    ('https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Pepperoni & Acı Bal Pizza 🍕', 'Pepperoni & Hot Honey Pizza 🍕', 2, true),
    ('https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Çıtır Tavuk Parçaları 🍗', 'Crispy Chicken Tenders 🍗', 3, true),
    ('https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Triple Cooked Patates 🍟', 'Triple Cooked Fries 🍟', 4, true),
    ('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Çikolatalı Amerikan Pancake 🥞', 'Chocolate American Pancake 🥞', 5, true),
    ('https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&q=80', 'https://www.instagram.com/taamclub/', 'Sütlü Tahinli Limonata 🍋', 'Creamy Tahini Lemonade 🍋', 6, true);
END $$;
