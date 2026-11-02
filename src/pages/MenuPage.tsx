import { useState, useEffect, useRef } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '@/hooks/useLang';
import { getCategories, getAllProducts } from '@/lib/supabase/queries';
import { demoCategories, demoProducts } from '@/data/demo';
import type { Category, Product } from '@/types';
import { Flame, Leaf, Star, Sparkles } from 'lucide-react';
import { TaamMotifs } from '@/components/ui/Logo';

// ─── Product Card ────────────────────────────────────
function MenuProductCard({ product, lang }: { product: Product; lang: string }) {
  const name = lang === 'en' ? product.name_en : product.name_tr;
  const desc = lang === 'en' ? (product.description_en ?? '') : (product.description_tr ?? '');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="flex gap-4 p-4 rounded-xl hover:bg-taam-off-white transition-colors duration-200">
        {/* Image */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden flex-shrink-0 img-zoom">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={name}
              loading="lazy"
              width={120}
              height={120}
              className="zoom-target w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-taam-tile flex items-center justify-center">
              <span className="font-display text-taam-gray text-3xl">{name[0]}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {product.is_new && (
                  <span className="inline-flex items-center gap-1 bg-taam-red text-white text-xs font-accent font-700 uppercase tracking-wide px-1.5 py-0.5 rounded">
                    <Sparkles size={10} /> New
                  </span>
                )}
                {product.is_signature && (
                  <span className="inline-flex items-center gap-1 bg-taam-blue text-white text-xs font-accent uppercase tracking-wide px-1.5 py-0.5 rounded">
                    <Star size={10} /> Signature
                  </span>
                )}
                {product.is_spicy && (
                  <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 text-xs font-accent uppercase tracking-wide px-1.5 py-0.5 rounded">
                    <Flame size={10} /> Spicy
                  </span>
                )}
                {product.is_vegetarian && (
                  <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 text-xs font-accent uppercase tracking-wide px-1.5 py-0.5 rounded">
                    <Leaf size={10} /> Veg
                  </span>
                )}
                {product.portion && (
                  <span className="inline-flex items-center text-taam-gray bg-taam-off-white border border-taam-tile text-xs font-accent px-1.5 py-0.5 rounded">
                    {product.portion}
                  </span>
                )}
              </div>

              <h3 className="font-display text-taam-charcoal text-lg md:text-xl leading-tight mb-1">
                {name}
              </h3>
              <p className="font-accent text-taam-gray text-sm leading-relaxed line-clamp-2">{desc}</p>

              {/* Variant price chips */}
              {product.variants && product.variants.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {product.variants.map((v, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-taam-off-white text-taam-charcoal text-xs font-accent px-2 py-0.5 rounded border border-taam-tile">
                      <span className="font-semibold text-taam-gray">{lang === 'en' ? v.label_en : v.label_tr}:</span>
                      <span className="text-taam-blue font-bold">₺{v.price}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex-shrink-0 sm:text-right mt-1 sm:mt-0">
              {product.variants && product.variants.length > 0 ? (
                <div>
                  <span className="font-display text-taam-blue text-lg md:text-xl leading-none block">
                    ₺{product.variants[0].price} – ₺{product.variants[product.variants.length - 1].price}
                  </span>
                  <span className="font-accent text-taam-gray text-[11px] block mt-1">
                    {lang === 'en' ? 'Portion options' : 'Gramaj/Porsiyon'}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="font-display text-taam-blue text-xl md:text-2xl leading-none block">
                    ₺{product.price.toFixed(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-taam-tile/60 mx-4" />
    </motion.article>
  );
}

// ─── Category Section ────────────────────────────────────
function CategorySection({ category, products, lang }: { category: Category; products: Product[]; lang: string }) {
  const name = lang === 'en' ? category.name_en : category.name_tr;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  if (products.length === 0) return null;

  return (
    <section
      ref={ref}
      id={`category-${category.slug}`}
      className="mb-12 md:mb-16 scroll-mt-32"
      aria-labelledby={`category-title-${category.slug}`}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="w-1 h-10 bg-taam-red" aria-hidden="true" />
        <h2
          id={`category-title-${category.slug}`}
          className="font-display text-taam-charcoal leading-none"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
        >
          {name}
        </h2>
        <div className="flex-1 h-px bg-taam-tile" aria-hidden="true" />
        <span className="font-accent text-taam-gray text-sm">{products.length} ürün</span>
      </motion.div>

      <div className="divide-y divide-taam-tile/50">
        {products.map((product) => (
          <MenuProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
    </section>
  );
}

// ─── MENU PAGE ────────────────────────────────────
export default function MenuPage() {
  const { t } = useTranslation();
  const { lang } = useLangStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const [cats, prods] = await Promise.all([getCategories(), getAllProducts()]);
        setCategories(cats.length ? cats : demoCategories);
        setProducts(prods.length ? prods : demoProducts);
      } catch {
        setCategories(demoCategories);
        setProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const productsByCategory = (categoryId: string) =>
    products.filter((p) => p.category_id === categoryId && p.is_active);

  const filteredCategories =
    activeCategory === 'all'
      ? categories
      : categories.filter((c) => c.slug === activeCategory);

  const scrollToCategory = (slug: string) => {
    setActiveCategory(slug);
    if (slug !== 'all') {
      setTimeout(() => {
        const el = document.getElementById(`category-${slug}`);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const menuSchema = {
    '@type': 'Menu',
    '@id': 'https://taamclub.com/menu#menu',
    'name': lang === 'en' ? 'TAAM Club Menu' : 'TAAM Club Menüsü',
    'description': lang === 'en' ? 'Gourmet burgers, crispy chicken, fries and desserts at TAAM Club Istanbul.' : 'TAAM Club İstanbul gurme burger, çıtır tavuk, patates ve tatlı menüsü.',
    'inLanguage': ['tr-TR', 'en-US'],
    'hasMenuSection': categories.map((cat) => ({
      '@type': 'MenuSection',
      'name': lang === 'en' ? cat.name_en : cat.name_tr,
      'hasMenuItem': productsByCategory(cat.id).map((p) => ({
        '@type': 'MenuItem',
        'name': lang === 'en' ? p.name_en : p.name_tr,
        'description': lang === 'en' ? (p.description_en ?? '') : (p.description_tr ?? ''),
        'offers': {
          '@type': 'Offer',
          'price': p.price,
          'priceCurrency': 'TRY',
          'availability': 'https://schema.org/InStock',
        },
      })),
    })),
  };

  return (
    <>
      <SEOHead
        title={lang === 'tr' ? 'Gurme Burger ve Çıtır Tavuk Menüsü | TAAM Club' : 'Gourmet Burgers & Crispy Chicken Menu | TAAM Club'}
        description={lang === 'tr' ? 'TAAM Club zengin lezzet menüsü: Ranch Tavuk Burger, çıtır tavuk tenders, Fries Duo ve fırından yeni çıkmış gurme tatlılar. Güncel fiyatlar.' : 'TAAM Club full menu: Ranch Chicken Burger, crispy chicken tenders, Fries Duo, and warm artisanal desserts with current prices in Istanbul.'}
        canonicalPath="/menu"
        breadcrumbs={[
          { name: lang === 'tr' ? 'Ana Sayfa' : 'Home', item: '/' },
          { name: lang === 'tr' ? 'Menü' : 'Menu', item: '/menu' },
        ]}
        schema={menuSchema}
      />

      {/* ─── Hero Banner ─── */}
      <div className="bg-taam-blue pt-20 pb-12 md:pt-28 md:pb-16" aria-label="Menü başlığı">
        <div className="container-taam">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-accent text-white/50 text-xs uppercase tracking-widest block mb-2">
                — Good sofra, better days
              </span>
              <h1 className="text-display-lg text-white leading-none">
                {t('menu.title')}
              </h1>
              <div className="mt-4">
                <TaamMotifs className="text-white/60" />
              </div>
            </div>
            <div
              className="font-display text-white/5 leading-none hidden md:block select-none"
              style={{ fontSize: 'clamp(80px, 10vw, 140px)' }}
              aria-hidden="true"
            >
              MENU
            </div>
          </div>
        </div>
      </div>

      {/* ─── Sticky Category Nav ─── */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-taam-tile shadow-sm">
        <div className="container-taam">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide" role="tablist" aria-label="Menü kategorileri">
            <button
              onClick={() => scrollToCategory('all')}
              className={`category-nav-item ${activeCategory === 'all' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeCategory === 'all'}
            >
              {t('menu.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.slug)}
                className={`category-nav-item ${activeCategory === cat.slug ? 'active' : ''}`}
                role="tab"
                aria-selected={activeCategory === cat.slug}
              >
                {lang === 'en' ? cat.name_en : cat.name_tr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Products ─── */}
      <div className="bg-white py-10 md:py-16">
        <div className="container-taam">
          {loading ? (
            <div className="space-y-8">
              {Array(3).fill(0).map((_, i) => (
                <div key={i}>
                  <div className="skeleton h-10 w-48 mb-4 rounded" />
                  {Array(3).fill(0).map((_, j) => (
                    <div key={j} className="flex gap-4 p-4 mb-2">
                      <div className="skeleton w-24 h-24 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-5 w-40 rounded" />
                        <div className="skeleton h-4 w-full rounded" />
                        <div className="skeleton h-4 w-2/3 rounded" />
                      </div>
                      <div className="skeleton h-8 w-16 rounded" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-taam-tile text-6xl mb-4">:)</p>
              <p className="font-accent text-taam-gray">{t('menu.empty')}</p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                products={productsByCategory(category.id)}
                lang={lang}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── Extractable Menu Specifications & Nutrition Facts for LLMs & AI Engines ─── */}
      <section className="bg-taam-off-white py-12 border-t border-taam-tile" aria-label="Menü Özeti ve Besin Standartları">
        <div className="container-taam">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-taam-charcoal text-2xl md:text-3xl mb-3">
              {lang === 'tr' ? 'Menü Standartları ve Fiyat Tablosu' : 'Menu Standards & Price Specifications'}
            </h2>
            <p className="font-accent text-taam-gray text-sm mb-6">
              {lang === 'tr'
                ? 'Tüm ürünlerimiz günlük taze malzemeler ve yerel tedarikçiler ile hazırlanır. Fiyatlarımıza KDV dahildir.'
                : 'All items are prepared with fresh daily ingredients and domestic sourcing. VAT included in all listed prices.'}
            </p>

            <div className="bg-white rounded-xl border border-taam-tile overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-accent text-sm">
                  <thead className="bg-taam-charcoal text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="p-3.5">{lang === 'tr' ? 'Ürün / Lezzet' : 'Item / Flavor'}</th>
                      <th scope="col" className="p-3.5">{lang === 'tr' ? 'Kategori' : 'Category'}</th>
                      <th scope="col" className="p-3.5">{lang === 'tr' ? 'Özellik / İçerik' : 'Characteristics / Ingredients'}</th>
                      <th scope="col" className="p-3.5 text-right">{lang === 'tr' ? 'Fiyat' : 'Price'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-taam-tile">
                    {products.slice(0, 6).map((prod) => (
                      <tr key={prod.id} className="hover:bg-taam-off-white/50 transition-colors">
                        <td className="p-3.5 font-semibold text-taam-charcoal">
                          {lang === 'en' ? prod.name_en : prod.name_tr}
                        </td>
                        <td className="p-3.5 text-taam-gray">
                          {lang === 'en' ? prod.category?.name_en : prod.category?.name_tr}
                        </td>
                        <td className="p-3.5 text-taam-gray text-xs">
                          {lang === 'en' ? prod.description_en : prod.description_tr}
                        </td>
                        <td className="p-3.5 font-display text-taam-blue text-base text-right whitespace-nowrap">
                          ₺{prod.price.toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
