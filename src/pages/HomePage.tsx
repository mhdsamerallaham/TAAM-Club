import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/seo/SEOHead';
import { ArrowRight, MapPin, Clock, Phone, HelpCircle } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { useLangStore } from '@/hooks/useLang';
import { getFeaturedProducts, getInstagramPosts } from '@/lib/supabase/queries';
import { demoProducts, demoInstagramPosts } from '@/data/demo';
import type { Product, InstagramPost } from '@/types';

// ─── Animation variants ────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// ─── Animated Section Wrapper ────────────────────────────────────
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Marquee Component ────────────────────────────────────
function MarqueeText({ text, className = '' }: { text: string; className?: string }) {
  const items = Array(8).fill(text);
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="flex whitespace-nowrap">
        <div className="marquee-track flex gap-8 pr-8">
          {items.map((item, i) => (
            <span key={i} className="font-display text-4xl md:text-5xl lg:text-6xl leading-none">
              {item} <span className="text-taam-red">✦</span>
            </span>
          ))}
          {items.map((item, i) => (
            <span key={`dup-${i}`} className="font-display text-4xl md:text-5xl lg:text-6xl leading-none">
              {item} <span className="text-taam-red">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Signature Product Card ────────────────────────────────────
function SignatureCard({ product, lang, index }: { product: Product; lang: string; index: number }) {
  const name = lang === 'en' ? product.name_en : product.name_tr;
  const desc = lang === 'en' ? (product.description_en ?? '') : (product.description_tr ?? '');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
      className="product-card group rounded-xl overflow-hidden"
      style={{ aspectRatio: index % 3 === 0 ? '3/4' : '1/1' }}
    >
      {/* Image */}
      <div className="img-zoom absolute inset-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={name}
            className="zoom-target w-full h-full object-cover"
            loading="lazy"
            width={600}
            height={600}
          />
        ) : (
          <div className="w-full h-full bg-taam-off-white flex items-center justify-center">
            <span className="font-display text-taam-tile text-6xl">{name[0]}</span>
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="card-overlay">
        <div className="card-content">
          {/* Badges */}
          <div className="flex gap-2 mb-2 flex-wrap">
            {product.is_new && (
              <span className="bg-taam-red text-white text-xs font-accent font-700 uppercase tracking-widest px-2 py-0.5 rounded">
                NEW
              </span>
            )}
            {product.is_signature && (
              <span className="bg-white/20 text-white text-xs font-accent uppercase tracking-widest px-2 py-0.5 rounded backdrop-blur-sm">
                ✦ Signature
              </span>
            )}
          </div>
          <h3 className="font-display text-white text-2xl md:text-3xl leading-tight mb-1">{name}</h3>
          <p className="text-white/70 font-accent text-sm leading-relaxed line-clamp-2 mb-3">{desc}</p>
          <div className="flex items-center justify-between">
            <span className="font-display text-white text-xl">
              ₺{product.price.toFixed(0)}
            </span>
            <Link
              to="/menu"
              className="text-white/80 hover:text-white font-accent text-xs uppercase tracking-widest flex items-center gap-1 group/arrow"
              aria-label={`Menüde ${name} görüntüle`}
            >
              Menüde Gör
              <ArrowRight size={12} className="group-hover/arrow:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Instagram Grid Item ────────────────────────────────────
function InstagramItem({ post, index }: { post: InstagramPost; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  return (
    <motion.a
      ref={ref}
      href={post.instagram_url ?? 'https://www.instagram.com/taamclub/'}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      className="instagram-item"
      aria-label={`TAAM Club Instagram gönderisi ${index + 1}`}
    >
      <img
        src={post.image_url}
        alt={post.caption_tr ?? `TAAM Club ${index + 1}`}
        loading="lazy"
        width={400}
        height={400}
        className="w-full h-full object-cover"
      />
      <div className="ig-overlay">
        <InstagramIcon size={28} className="text-white" />
      </div>
    </motion.a>
  );
}

// ─── HOME PAGE ────────────────────────────────────
export default function HomePage() {
  const { t } = useTranslation();
  const { lang } = useLangStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [igPosts, setIgPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    async function loadData() {
      try {
        const [products, posts] = await Promise.all([
          getFeaturedProducts(),
          getInstagramPosts(),
        ]);
        setFeaturedProducts(products.length ? products : demoProducts.filter(p => p.is_featured));
        setIgPosts(posts.length ? posts : demoInstagramPosts);
      } catch {
        setFeaturedProducts(demoProducts.filter(p => p.is_featured));
        setIgPosts(demoInstagramPosts);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const faqItems = [
    {
      q: lang === 'tr' ? 'TAAM Club nedir ve nerede bulunur?' : 'What is TAAM Club and where is it located?',
      a: lang === 'tr'
        ? "TAAM Club, İstanbul Güzide Mertcan adresinde yer alan, taze el yapımı burgerler, çıtır marine tavuk ve özel tarifler sunan yeni nesil gurme fast-casual restorandır."
        : 'TAAM Club is a next-generation gourmet fast-casual restaurant located at Güzide Mertcan, Istanbul, offering fresh handcrafted burgers, crispy marinated chicken, and signature recipes.',
    },
    {
      q: lang === 'tr' ? 'Menüde en çok tercih edilen imza lezzetler hangileridir?' : 'What are the signature menu items at TAAM Club?',
      a: lang === 'tr'
        ? "En popüler imza lezzetlerimiz Ranch Tavuk Burger, dana etli TAAM Klasik Burger, çıtır tavuk tenders, çift soslu Fries Duo ve fırından yeni çıkmış Cookie Dondurma'dır."
        : 'Our top signature items include the Ranch Chicken Burger, prime beef TAAM Classic Burger, crispy chicken tenders, dual-sauced Fries Duo, and warm Cookie Ice Cream.',
    },
    {
      q: lang === 'tr' ? 'Vejetaryen ve acı seçenekler mevcut mu?' : 'Are there vegetarian and spicy options available?',
      a: lang === 'tr'
        ? 'Evet, özel soslu Fries Duo patates kızartmamız ve Cookie Dondurma tatlımız vejetaryendir; ayrıca acı severler için özel acı marine çıtır tavuk ve sos seçeneklerimiz bulunmaktadır.'
        : 'Yes, our Fries Duo and artisanal Cookie Ice Cream are vegetarian; we also offer specially seasoned spicy crispy chicken and dipping sauces.',
    },
    {
      q: lang === 'tr' ? 'Çalışma saatleri ve paket servis hizmeti nedir?' : 'What are the operating hours and takeaway options?',
      a: lang === 'tr'
        ? 'Hafta içi 11:00–22:00, hafta sonu 10:00–23:00 saatleri arasında açığız. Restoran içi deneyimin yanı sıra hızlı gel-al (takeaway) servisimiz mevcuttur.'
        : 'We are open Monday–Friday 11:00–22:00 and Saturday–Sunday 10:00–23:00, offering both dine-in experience and fast takeaway service.',
    },
  ];

  const homePageFaqSchema = {
    '@type': 'FAQPage',
    '@id': 'https://taamclub.com/#faq',
    'mainEntity': faqItems.map((item) => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a,
      },
    })),
  };

  return (
    <>
      <SEOHead
        title={lang === 'tr' ? 'TAAM Club | Gurme Burger & Çıtır Tavuk İstanbul' : 'TAAM Club | Gourmet Burgers & Crispy Chicken Istanbul'}
        description={lang === 'tr' ? "TAAM Club – İstanbul'un en özel gurme burgerleri, çıtır tavuk ve tatlı deneyimi. Taze malzemeler, lezzetin yeni kuralları." : "TAAM Club – Istanbul's premier gourmet burgers, crispy chicken, and artisanal desserts. Fresh ingredients and bold flavors."}
        canonicalPath="/"
        schema={homePageFaqSchema}
      />

      {/* ═══ SECTION 1: HERO ═══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="hero-section bg-taam-blue grain-overlay"
        aria-label="TAAM Club hero bölümü"
      >
        {/* Background food image with parallax */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=85')`,
              filter: 'brightness(0.25) saturate(0.8)',
            }}
          />
          {/* Blue tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-taam-blue/80 via-taam-blue/60 to-taam-blue-dark/90" />
        </motion.div>

        {/* Tile grid overlay */}
        <div
          className="absolute inset-0 opacity-5 z-[1]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="container-taam relative z-10 py-24 md:py-0 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 md:gap-0 min-h-screen"
        >
          {/* Left: Main headline */}
          <div className="md:mb-20 lg:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-1 h-6 bg-taam-red" aria-hidden="true" />
              <span className="font-accent text-white/60 text-xs uppercase tracking-widest">
                @taamclub • Istanbul
              </span>
            </motion.div>

            {/* Main TAAM text */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-display-xl text-white leading-none block"
              >
                <span>TAAM</span>
                <span className="text-taam-red block -mt-4 md:-mt-6">CLUB</span>
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="font-display text-white/80 mt-4 md:mt-6 tracking-wide"
              style={{ fontSize: 'clamp(18px, 3vw, 32px)' }}
            >
              {t('hero.tagline')} {t('hero.tagline2')}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Link
                to="/menu"
                className="btn-taam btn-taam-red text-sm px-6 py-3.5 group"
              >
                {t('hero.cta')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="btn-taam btn-taam-outline-white text-sm px-6 py-3.5"
              >
                TAAM Nedir?
              </Link>
            </motion.div>
          </div>

          {/* Right: Vertical stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden lg:flex flex-col gap-6 md:mb-20 lg:mb-24 text-right"
          >
            {[
              { number: '12K+', label: 'Takipçi' },
              { number: '100%', label: 'Taze Malzeme' },
              { number: '5★', label: 'Lezzet' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-white text-4xl leading-none">{stat.number}</div>
                <div className="font-accent text-white/50 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="font-accent text-white/40 text-xs uppercase tracking-widest">{t('hero.scroll')}</span>
          <div className="scroll-indicator w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: BRAND STATEMENT ═══════════════════════════════════════ */}
      <section className="bg-taam-off-white section-padding overflow-hidden" aria-label="Marka ifadesi">
        <div className="container-taam">
          <RevealSection>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-1 h-8 bg-taam-red flex-shrink-0 mt-2" aria-hidden="true" />
              <span className="font-accent text-taam-gray text-xs uppercase tracking-widest">TAAM Club Felsefesi</span>
            </div>
          </RevealSection>

          <div className="max-w-5xl">
            {[t('brand.line1'), t('brand.line2'), t('brand.line3')].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.div
                  initial={{ y: '100%' }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ delay: i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className={`text-display-lg leading-none ${i === 2 ? 'text-taam-red' : 'text-taam-charcoal'}`}
                >
                  {line}
                </motion.div>
              </div>
            ))}
          </div>

          <RevealSection className="mt-8 flex items-center gap-6">
            <p className="text-taam-gray font-accent text-base max-w-xs leading-relaxed">
              {t('brand.sub')}
            </p>
            <Link
              to="/about"
              className="flex-shrink-0 btn-taam btn-taam-outline text-sm px-5 py-3 group"
              aria-label="TAAM Club hakkında daha fazla bilgi"
            >
              Daha Fazla
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ═══ SECTION 3: SIGNATURE ITEMS ═══════════════════════════════════════ */}
      <section className="bg-white section-padding" aria-label="İmza lezzetler">
        <div className="container-taam">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <RevealSection>
              <h2 className="text-display-sm text-taam-charcoal leading-none">
                {t('sections.signature')}
              </h2>
              <p className="font-accent text-taam-gray text-sm mt-2">{t('sections.signatureSub')}</p>
            </RevealSection>
            <RevealSection>
              <Link
                to="/menu"
                className="btn-taam btn-taam-primary text-sm px-5 py-3 self-start group"
                aria-label="Tam menüyü gör"
              >
                {t('sections.menuTeaser')}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </RevealSection>
          </div>

          {/* Asymmetric Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className={`skeleton rounded-xl ${i === 0 ? 'row-span-2' : ''}`} style={{ height: i === 0 ? 480 : 220 }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" style={{ gridAutoRows: '220px' }}>
              {featuredProducts.slice(0, 5).map((product, i) => (
                <div
                  key={product.id}
                  className={`relative ${i === 0 ? 'row-span-2' : ''} ${i === 3 ? 'col-span-2 md:col-span-1' : ''}`}
                >
                  <SignatureCard product={product} lang={lang} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ SECTION 4: MARQUEE SEPARATOR ═══════════════════════════════════════ */}
      <section className="bg-taam-blue py-5 overflow-hidden" aria-hidden="true">
        <MarqueeText
          text="TAAM CLUB"
          className="text-white/30"
        />
      </section>

      {/* ═══ SECTION 5: MENU TEASER ═══════════════════════════════════════ */}
      <section className="bg-taam-charcoal section-padding relative overflow-hidden" aria-label="Menü önizleme">
        {/* BG image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550547660-d9450f859349?w=1400&q=80')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-taam-charcoal via-taam-charcoal/90 to-transparent" aria-hidden="true" />

        <div className="container-taam relative z-10">
          <div className="max-w-2xl">
            <RevealSection>
              <span className="font-accent text-taam-red text-xs uppercase tracking-widest">— Menü</span>
              <h2 className="text-display-lg text-white leading-none mt-3 mb-6">
                {lang === 'tr' ? 'Tüm\nLezzetleri\nKeşfet.' : 'Discover\nAll\nFlavors.'}
              </h2>
              <p className="font-accent text-white/60 text-base leading-relaxed mb-10 max-w-sm">
                {lang === 'tr'
                  ? 'Burgerden çıtır tavuğa, cookie dondurmasından özel içeceklere. TAAM menüsü sizi bekliyor.'
                  : 'From burgers to crispy chicken, cookie ice cream to special drinks. The TAAM menu awaits.'}
              </p>
              <Link
                to="/menu"
                className="btn-taam btn-taam-red text-base px-8 py-4 group inline-flex"
                aria-label="TAAM Club menüsüne git"
              >
                {t('sections.menuTeaser')}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: EXPERIENCE ═══════════════════════════════════════ */}
      <section className="bg-taam-off-white section-padding" aria-label="TAAM deneyimi">
        <div className="container-taam">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <RevealSection>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-taam-blue" aria-hidden="true" />
                  <span className="font-accent text-taam-gray text-xs uppercase tracking-widest">TAAM Experience</span>
                </div>
                <h2 className="text-display-md text-taam-charcoal leading-none mb-6">
                  {t('sections.experience')}
                </h2>
                <p className="font-accent text-taam-gray leading-relaxed text-base mb-8">
                  {t('sections.experienceSub')}
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { emoji: '🍔', label: lang === 'tr' ? 'Yemek' : 'Food' },
                    { emoji: '🎵', label: lang === 'tr' ? 'Müzik' : 'Music' },
                    { emoji: '✨', label: lang === 'tr' ? 'Deneyim' : 'Experience' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 bg-white rounded-xl">
                      <div className="text-2xl mb-1">{item.emoji}</div>
                      <div className="font-accent text-taam-charcoal text-xs font-600 uppercase tracking-wide">{item.label}</div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/about"
                  className="btn-taam btn-taam-primary text-sm px-6 py-3 inline-flex group"
                  aria-label="TAAM Club hakkında daha fazla bilgi"
                >
                  {lang === 'tr' ? 'Bizi Tanı' : 'Know Us'}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </RevealSection>
            </div>

            {/* Right: Images mosaic */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80', alt: 'Çıtır tavuk', tall: true },
                { src: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80', alt: 'Cookie dondurma', tall: false },
                { src: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80', alt: 'Fries duo', tall: false },
                { src: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80', alt: 'Burger', tall: false },
              ].map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`img-zoom rounded-xl overflow-hidden ${i === 0 ? 'row-span-2' : ''}`}
                  style={{ height: i === 0 ? 'auto' : '160px' }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    width={400}
                    height={400}
                    className="zoom-target w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7: INSTAGRAM ═══════════════════════════════════════ */}
      <section className="bg-white section-padding" aria-label="Instagram galerimiz">
        <div className="container-taam">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <RevealSection>
              <h2 className="text-display-sm text-taam-charcoal leading-none">
                {t('sections.instagram')}
              </h2>
              <p className="font-accent text-taam-red text-sm mt-1 font-600">{t('sections.instagramSub')}</p>
            </RevealSection>
            <RevealSection>
              <a
                href="https://www.instagram.com/taamclub/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-taam btn-taam-outline text-sm px-5 py-3 self-start group inline-flex"
                aria-label="TAAM Club Instagram sayfasını ziyaret et"
              >
                <InstagramIcon size={14} />
                Instagram'da Takip Et
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </RevealSection>
          </div>

          {/* Instagram grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {igPosts.slice(0, 6).map((post, i) => (
              <InstagramItem key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8: MARQUEE RED ═══════════════════════════════════════ */}
      <section className="bg-taam-red py-5 overflow-hidden" aria-hidden="true">
        <MarqueeText
          text="İYİ YEMEK İYİ ENERJİ"
          className="text-white/30"
        />
      </section>

      {/* ═══ SECTION 9: LOCATION ═══════════════════════════════════════ */}
      <section className="bg-taam-blue section-padding" aria-label="Konum ve iletişim">
        <div className="container-taam">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left */}
            <div>
              <RevealSection>
                <span className="font-accent text-white/50 text-xs uppercase tracking-widest">— {lang === 'tr' ? 'Bize Ulaş' : 'Find Us'}</span>
                <h2 className="text-display-md text-white leading-none mt-3 mb-8">
                  {t('sections.location')}
                </h2>
              </RevealSection>

              <div className="flex flex-col gap-6">
                {[
                  { icon: <MapPin size={20} className="text-taam-red flex-shrink-0" />, label: t('contact.address'), value: t('contact.addressValue') },
                  { icon: <Clock size={20} className="text-taam-red flex-shrink-0" />, label: t('contact.hours'), value: t('contact.hoursValue') },
                  { icon: <Phone size={20} className="text-taam-red flex-shrink-0" />, label: t('contact.phone'), value: '+90 500 000 00 00' },
                ].map((item) => (
                  <RevealSection key={item.label} className="flex items-start gap-4">
                    <div className="mt-0.5">{item.icon}</div>
                    <div>
                      <div className="font-accent text-white/50 text-xs uppercase tracking-widest mb-1">{item.label}</div>
                      <div className="font-accent text-white text-sm whitespace-pre-line">{item.value}</div>
                    </div>
                  </RevealSection>
                ))}
              </div>

              <RevealSection className="flex flex-wrap gap-4 mt-10">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-taam btn-taam-red text-sm px-6 py-3 group inline-flex"
                  aria-label="Google Maps'te yol tarifi al"
                >
                  {t('contact.directions')}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  to="/contact"
                  className="btn-taam btn-taam-outline-white text-sm px-6 py-3"
                  aria-label="İletişim sayfasına git"
                >
                  {t('sections.location')}
                </Link>
              </RevealSection>
            </div>

            {/* Right: Large text */}
            <RevealSection>
              <div
                className="font-display text-white/10 leading-none text-right"
                style={{ fontSize: 'clamp(80px, 15vw, 180px)' }}
                aria-hidden="true"
              >
                {t('contact.comeSayHi').split(' ').map((word, i) => (
                  <div key={i}>{word}</div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 10: FAQ & CULINARY SPECIFICATIONS (GEO CITATION READY) ═══════════════════════ */}
      <section className="bg-taam-off-white section-padding border-t border-taam-tile" aria-label="Sıkça Sorulan Sorular ve Mutfak Detayları">
        <div className="container-taam">
          <div className="max-w-4xl mx-auto">
            <RevealSection className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-3">
                <HelpCircle size={16} className="text-taam-red" />
                <span className="font-accent text-taam-red text-xs uppercase tracking-widest">
                  {lang === 'tr' ? 'Merak Edilenler & Detaylar' : 'FAQ & Specifications'}
                </span>
              </div>
              <h2 className="text-display-sm text-taam-charcoal leading-none">
                {lang === 'tr' ? 'TAAM Club Hakkında Sıkça Sorulan Sorular' : 'Frequently Asked Questions About TAAM Club'}
              </h2>
              <p className="font-accent text-taam-gray text-sm mt-3">
                {lang === 'tr' ? 'Gastronomi felsefemiz, malzemelerimiz ve restoran detaylarımız.' : 'Our culinary philosophy, fresh ingredients, and restaurant specifications.'}
              </p>
            </RevealSection>

            {/* Direct Concise Answer FAQ grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-taam-tile shadow-xs">
                  <h3 className="font-display text-taam-charcoal text-xl leading-tight mb-3">
                    {item.q}
                  </h3>
                  <p className="font-accent text-taam-gray text-sm leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Machine-Readable & High-Density Structured Table */}
            <div className="bg-white rounded-2xl border border-taam-tile p-6 md:p-8 shadow-xs">
              <h3 className="font-display text-taam-charcoal text-xl mb-4">
                {lang === 'tr' ? 'TAAM Club Kurumsal & Mutfak Özeti' : 'TAAM Club Culinary & Entity Specifications'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-accent text-sm">
                  <tbody className="divide-y divide-taam-tile">
                    <tr>
                      <th scope="row" className="py-3 font-semibold text-taam-charcoal w-1/3">
                        {lang === 'tr' ? 'Mutfak Konsepti' : 'Cuisine Concept'}
                      </th>
                      <td className="py-3 text-taam-gray">
                        {lang === 'tr' ? 'Gurme Burgerler, Çıtır Marine Tavuk, Patates & El Yapımı Tatlılar' : 'Gourmet Burgers, Crispy Marinated Chicken, Fries & Artisanal Desserts'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                        {lang === 'tr' ? 'Et & Malzeme Kalitesi' : 'Meat & Ingredient Quality'}
                      </th>
                      <td className="py-3 text-taam-gray">
                        {lang === 'tr' ? '%100 Yerli taze dana eti, günlük taze pişen brioche ekmekleri' : '100% Fresh domestic beef, daily-baked artisanal brioche buns'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                        {lang === 'tr' ? 'Adres & Şehir' : 'Location & City'}
                      </th>
                      <td className="py-3 text-taam-gray">
                        Güzide Mertcan, İstanbul, Türkiye
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                        {lang === 'tr' ? 'Çalışma Saatleri' : 'Operating Hours'}
                      </th>
                      <td className="py-3 text-taam-gray">
                        {lang === 'tr' ? 'Hafta içi 11:00–22:00 | Hafta sonu 10:00–23:00' : 'Mon–Fri 11:00–22:00 | Sat–Sun 10:00–23:00'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                        {lang === 'tr' ? 'Geliştirici & Mimari' : 'Engineering & Architecture'}
                      </th>
                      <td className="py-3 text-taam-gray">
                        <a href="https://www.samer.life/" target="_blank" rel="noopener noreferrer" className="text-taam-blue font-semibold hover:underline">
                          Samer
                        </a>
                      </td>
                    </tr>
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
