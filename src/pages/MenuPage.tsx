import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '@/hooks/useLang';
import { getCategories, getAllProducts } from '@/lib/supabase/queries';
import { demoCategories, demoProducts } from '@/data/demo';
import type { Category, Product } from '@/types';
import { Flame, Leaf, Star, Sparkles } from 'lucide-react';

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
      <div className="flex gap-4 p-4 rounded-xl hover:bg-taam-off-white transition-colors duration-200 cursor-pointer">
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
          <div className="flex items-start justify-between gap-2">
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
              </div>

              <h3 className="font-display text-taam-charcoal text-lg md:text-xl leading-tight mb-1 truncate">
                {name}
              </h3>
              <p className="font-accent text-taam-gray text-sm leading-relaxed line-clamp-2">{desc}</p>
            </div>

            {/* Price */}
            <div className="flex-shrink-0 text-right">
              <span className="font-display text-taam-blue text-xl md:text-2xl leading-none">
                ₺{product.price.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-taam-tile mx-4" />
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

  return (
    <>
      <Helmet>
        <title>Menü | TAAM Club</title>
        <meta name="description" content="TAAM Club menüsü – Burgerler, tavuk, patates, tatlılar ve içecekler. Her lokma özel, her tat benzersiz." />
        <meta property="og:title" content="Menü | TAAM Club" />
        <link rel="canonical" href="https://taamclub.com/menu" />
      </Helmet>

      {/* ─── Hero Banner ─── */}
      <div className="bg-taam-blue pt-20 pb-12 md:pt-28 md:pb-16" aria-label="Menü başlığı">
        <div className="container-taam">
          <div className="flex items-end justify-between">
            <div>
              <span className="font-accent text-white/50 text-xs uppercase tracking-widest">— TAAM Club</span>
              <h1 className="text-display-lg text-white leading-none mt-2">
                {t('menu.title')}
              </h1>
            </div>
            <div
              className="font-display text-white/5 leading-none hidden md:block"
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
    </>
  );
}
