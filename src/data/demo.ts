// TAAM Club — Demo data fallback when Supabase is not configured
import type { Category, Product, InstagramPost } from '@/types';

export const demoCategories: Category[] = [
  { id: '1', name_tr: 'Burgerler', name_en: 'Burgers', slug: 'burgerler', sort_order: 1, is_active: true, created_at: '' },
  { id: '2', name_tr: 'Tavuk', name_en: 'Chicken', slug: 'tavuk', sort_order: 2, is_active: true, created_at: '' },
  { id: '3', name_tr: 'Patates', name_en: 'Fries', slug: 'patates', sort_order: 3, is_active: true, created_at: '' },
  { id: '4', name_tr: 'Tatlılar', name_en: 'Desserts', slug: 'tatlilar', sort_order: 4, is_active: true, created_at: '' },
  { id: '5', name_tr: 'İçecekler', name_en: 'Drinks', slug: 'icecekler', sort_order: 5, is_active: true, created_at: '' },
];

export const demoProducts: Product[] = [
  {
    id: '1', category_id: '1',
    name_tr: 'Ranch Tavuk Burger', name_en: 'Ranch Chicken Burger',
    description_tr: 'Çıtır tavuk, ranch sos, taze yeşillikler, özel brioche ekmek', description_en: 'Crispy chicken, ranch sauce, fresh greens, special brioche bun',
    price: 280, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    sort_order: 1, is_featured: true, is_active: true, is_new: true, is_signature: true, is_spicy: false, is_vegetarian: false,
    created_at: '', updated_at: '',
    category: demoCategories[0]
  },
  {
    id: '2', category_id: '1',
    name_tr: 'TAAM Klasik Burger', name_en: 'TAAM Classic Burger',
    description_tr: 'Dana eti, cheddar peyniri, turşu, özel TAAM sosu', description_en: 'Beef patty, cheddar cheese, pickles, special TAAM sauce',
    price: 260, image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80',
    sort_order: 2, is_featured: true, is_active: true, is_new: false, is_signature: true, is_spicy: false, is_vegetarian: false,
    created_at: '', updated_at: '',
    category: demoCategories[0]
  },
  {
    id: '3', category_id: '2',
    name_tr: 'Çıtır Tavuk Parçaları', name_en: 'Crispy Chicken Tenders',
    description_tr: 'El yapımı baharat karışımı ile marine edilmiş çıtır tavuk', description_en: 'Crispy chicken marinated with house-made spice blend',
    price: 220, image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80',
    sort_order: 1, is_featured: true, is_active: true, is_new: false, is_signature: false, is_spicy: true, is_vegetarian: false,
    created_at: '', updated_at: '',
    category: demoCategories[1]
  },
  {
    id: '4', category_id: '3',
    name_tr: 'Fries Duo', name_en: 'Fries Duo',
    description_tr: 'Çift sos seçenekli özel patates kızartması. Ranch + Sriracha', description_en: 'Special fries with dual sauce options. Ranch + Sriracha',
    price: 140, image_url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&q=80',
    sort_order: 1, is_featured: true, is_active: true, is_new: true, is_signature: false, is_spicy: false, is_vegetarian: true,
    created_at: '', updated_at: '',
    category: demoCategories[2]
  },
  {
    id: '5', category_id: '4',
    name_tr: 'Cookie Dondurma', name_en: 'Cookie Ice Cream',
    description_tr: 'El yapımı çikolatalı cookie üzerine vanilyalı dondurma', description_en: 'Homemade chocolate chip cookie with vanilla ice cream',
    price: 180, image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80',
    sort_order: 1, is_featured: true, is_active: true, is_new: true, is_signature: true, is_spicy: false, is_vegetarian: true,
    created_at: '', updated_at: '',
    category: demoCategories[3]
  },
  {
    id: '6', category_id: '1',
    name_tr: 'Üçlü Kule Burger', name_en: 'Triple Tower Burger',
    description_tr: 'Üç kat et, üç farklı lezzet. TAAM\'ın en iddialı burgeri.', description_en: 'Three layers of meat, three different flavors. TAAM\'s boldest burger.',
    price: 380, image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80',
    sort_order: 3, is_featured: false, is_active: true, is_new: false, is_signature: true, is_spicy: false, is_vegetarian: false,
    created_at: '', updated_at: '',
    category: demoCategories[0]
  },
];

export const demoInstagramPosts: InstagramPost[] = [
  { id: '1', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', instagram_url: 'https://www.instagram.com/taamclub/', caption_tr: 'Ranch Tavuk Burger 🔥', caption_en: 'Ranch Chicken Burger 🔥', sort_order: 1, is_active: true, created_at: '' },
  { id: '2', image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80', instagram_url: 'https://www.instagram.com/taamclub/', caption_tr: 'TAAM Klasik 🍔', caption_en: 'TAAM Classic 🍔', sort_order: 2, is_active: true, created_at: '' },
  { id: '3', image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80', instagram_url: 'https://www.instagram.com/taamclub/', caption_tr: 'Çıtır her şeyden iyi 🍗', caption_en: 'Crispy is everything 🍗', sort_order: 3, is_active: true, created_at: '' },
  { id: '4', image_url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80', instagram_url: 'https://www.instagram.com/taamclub/', caption_tr: 'Fries Duo. İki sos, bir mutluluk 🍟', caption_en: 'Fries Duo. Two sauces, one happiness 🍟', sort_order: 4, is_active: true, created_at: '' },
  { id: '5', image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80', instagram_url: 'https://www.instagram.com/taamclub/', caption_tr: 'Cookie dondurma sezonu 🍪', caption_en: 'Cookie ice cream season 🍪', sort_order: 5, is_active: true, created_at: '' },
  { id: '6', image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80', instagram_url: 'https://www.instagram.com/taamclub/', caption_tr: 'Üçlü kule, büyük zevk 🗼', caption_en: 'Triple tower, big pleasure 🗼', sort_order: 6, is_active: true, created_at: '' },
];
