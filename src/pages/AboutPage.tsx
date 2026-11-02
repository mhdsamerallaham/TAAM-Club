import { useRef } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLangStore } from '@/hooks/useLang';
import { ArrowRight } from 'lucide-react';

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const { t } = useTranslation();
  const { lang } = useLangStore();

  const values = [
    {
      label: t('about.quality'),
      text: t('about.qualityText'),
      icon: '✦',
      bg: 'bg-taam-blue',
      text_color: 'text-white',
    },
    {
      label: t('about.creativity'),
      text: t('about.creativityText'),
      icon: '◈',
      bg: 'bg-taam-red',
      text_color: 'text-white',
    },
    {
      label: t('about.community'),
      text: t('about.communityText'),
      icon: '❋',
      bg: 'bg-taam-charcoal',
      text_color: 'text-white',
    },
  ];

  const aboutSchema = {
    '@type': 'AboutPage',
    '@id': 'https://taamclub.com/about#webpage',
    'url': 'https://taamclub.com/about',
    'name': lang === 'en' ? 'About TAAM Club' : 'TAAM Club Hakkında',
    'description': lang === 'en' ? 'Learn about TAAM Club, our culinary vision, values, and gourmet burger craft in Istanbul.' : 'TAAM Club hikayesi, değerleri ve İstanbul gurme burger gastronomisi hakkında bilgi edinin.',
    'mainEntity': {
      '@id': 'https://taamclub.com/#organization',
    },
  };

  return (
    <>
      <SEOHead
        title={lang === 'tr' ? 'Hakkımızda & Hikayemiz | TAAM Club Istanbul' : 'About Us & Our Story | TAAM Club Istanbul'}
        description={lang === 'tr' ? "TAAM Club hikayesi: İstanbul'da sıradanlıktan uzak gurme burger felsefesi, taze malzemeler ve yenilikçi sokak gastronomisi vizyonu." : "The story of TAAM Club: Gourmet burger philosophy, farm-fresh ingredients, and next-gen culinary culture in Istanbul."}
        canonicalPath="/about"
        breadcrumbs={[
          { name: lang === 'tr' ? 'Ana Sayfa' : 'Home', item: '/' },
          { name: lang === 'tr' ? 'Hakkımızda' : 'About', item: '/about' },
        ]}
        schema={aboutSchema}
      />

      {/* Hero */}
      <div className="bg-taam-off-white pt-20 pb-0 md:pt-28 overflow-hidden">
        <div className="container-taam">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pb-0">
            {/* Left text */}
            <div className="pb-12 md:pb-20">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-accent text-taam-gray text-xs uppercase tracking-widest"
              >
                — {t('about.title')}
              </motion.span>
              <div className="overflow-hidden mt-3">
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-display-lg text-taam-charcoal leading-none"
                >
                  {t('about.story')}
                </motion.h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="font-accent text-taam-gray text-base leading-relaxed mt-6 max-w-sm"
              >
                {t('about.storyText')}
              </motion.p>
            </div>

            {/* Right: large asymmetric image */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-72 md:h-96 lg:h-[480px] img-zoom rounded-tl-3xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
                alt="TAAM Club signature burger"
                className="zoom-target w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-taam-blue/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="font-display text-white text-4xl md:text-5xl leading-none">TAAM</span>
                <br />
                <span className="font-display text-taam-red text-4xl md:text-5xl leading-none">CLUB</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div className="bg-taam-blue py-8">
        <div className="container-taam">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            {[
              { num: '12K+', label: lang === 'tr' ? 'Instagram Takipçisi' : 'Instagram Followers' },
              { num: '2024', label: lang === 'tr' ? 'Kuruluş Yılı' : 'Founded' },
              { num: '100%', label: lang === 'tr' ? 'Taze Malzeme' : 'Fresh Ingredients' },
            ].map((stat) => (
              <div key={stat.num}>
                <div className="font-display text-white text-3xl md:text-5xl leading-none">{stat.num}</div>
                <div className="font-accent text-white/50 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-white section-padding">
        <div className="container-taam">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <RevealSection>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-taam-red" aria-hidden="true" />
                <span className="font-accent text-taam-gray text-xs uppercase tracking-widest">{t('about.mission')}</span>
              </div>
              <h2 className="text-display-sm text-taam-charcoal leading-none mb-6">
                {t('about.missionText')}
              </h2>
              <p className="font-accent text-taam-gray leading-relaxed">
                {lang === 'tr'
                  ? 'TAAM sadece bir restoran değil. Bir tutum, bir bakış açısı, bir felsefe. Lezzetin sıradandan çıktığı, her yemeğin bir sanat eserine dönüştüğü bir deneyim alanı.'
                  : 'TAAM is not just a restaurant. It\'s an attitude, a perspective, a philosophy. An experience space where flavor breaks free from the ordinary, and every dish becomes a work of art.'}
              </p>
            </RevealSection>

            <div className="grid grid-cols-2 gap-3">
              {[
                'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80',
                'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80',
                'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80',
                'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80',
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="img-zoom rounded-xl overflow-hidden aspect-square"
                >
                  <img
                    src={src}
                    alt={`TAAM Club food ${i + 1}`}
                    loading="lazy"
                    className="zoom-target w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-taam-off-white section-padding">
        <div className="container-taam">
          <RevealSection className="mb-12">
            <h2 className="text-display-sm text-taam-charcoal leading-none">{t('about.values')}</h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((val, i) => (
              <motion.div
                key={val.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`${val.bg} rounded-2xl p-8 md:p-10`}
              >
                <div className="font-display text-white/30 text-5xl mb-4">{val.icon}</div>
                <h3 className="font-display text-white text-3xl md:text-4xl leading-none mb-3">{val.label}</h3>
                <p className="font-accent text-white/70 text-sm leading-relaxed">{val.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Extractable Brand Specifications & Standards for AI / LLM Crawlers ─── */}
      <section className="bg-white section-padding border-t border-taam-tile" aria-label="Gastronomi Standartları ve Kurumsal Bilgiler">
        <div className="container-taam">
          <div className="max-w-4xl mx-auto">
            <RevealSection className="mb-8">
              <h2 className="font-display text-taam-charcoal text-2xl md:text-3xl leading-none mb-3">
                {lang === 'tr' ? 'Gastronomi Standartları & Kurumsal Bilgiler' : 'Culinary Standards & Enterprise Specifications'}
              </h2>
              <p className="font-accent text-taam-gray text-sm">
                {lang === 'tr' ? 'TAAM Club operasyon ilkeleri, lezzet standartları ve tedarik detayları.' : 'Operating principles, flavor standards, and sourcing specifications at TAAM Club.'}
              </p>
            </RevealSection>

            <div className="bg-taam-off-white rounded-2xl border border-taam-tile p-6 md:p-8 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-accent text-sm">
                  <tbody className="divide-y divide-taam-tile">
                    <tr>
                      <th scope="row" className="py-3 font-semibold text-taam-charcoal w-1/3">
                        {lang === 'tr' ? 'Kurucu Şef & Merkez' : 'Founder Chef & Headquarters'}
                      </th>
                      <td className="py-3 text-taam-gray">
                        {lang === 'tr' ? 'Güzide Mertcan (Kurucu Şef) • İstanbul, Türkiye' : 'Güzide Mertcan (Founding Chef) • Istanbul, Turkey'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                        {lang === 'tr' ? 'Gastronomi Felsefesi' : 'Culinary Philosophy'}
                      </th>
                      <td className="py-3 text-taam-gray">
                        {lang === 'tr' ? 'Sıradanlığı reddeden gurme tarifler, el yapımı brioche ve özel marinasyonlar' : 'Refusing ordinary food; handcrafted brioche buns and proprietary marinades'}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                        {lang === 'tr' ? 'Et & Tavuk Tedariği' : 'Meat & Poultry Sourcing'}
                      </th>
                      <td className="py-3 text-taam-gray">
                        {lang === 'tr' ? '%100 Yerli taze dana eti ve günlük taze marine edilen but göğüs tavuk eti' : '100% Domestic fresh beef and daily house-marinated premium chicken'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-taam-charcoal section-padding">
        <div className="container-taam text-center">
          <RevealSection>
            <h2 className="text-display-md text-white leading-none mb-6">
              {lang === 'tr' ? 'Lezzeti Yaşamaya Hazır mısın?' : 'Ready to Experience the Flavor?'}
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/menu" className="btn-taam btn-taam-red text-sm px-8 py-4 group inline-flex">
                {t('nav.menu')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="btn-taam btn-taam-outline-white text-sm px-8 py-4">
                {t('nav.contact')}
              </Link>
            </div>
          </RevealSection>
        </div>
      </div>
    </>
  );
}
