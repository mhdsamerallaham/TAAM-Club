import SEOHead from '@/components/seo/SEOHead';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '@/hooks/useLang';
import { MapPin, Clock, Mail, ArrowUpRight, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';

export default function ContactPage() {
  const { t } = useTranslation();
  const { lang } = useLangStore();

  const contactItems = [
    {
      icon: <MapPin size={22} className="text-taam-red" />,
      label: t('contact.address'),
      value: t('contact.addressValue'),
      href: 'https://maps.app.goo.gl/LjcB8p5Uq7dKkBBA7',
      external: true,
    },
    {
      icon: <Mail size={22} className="text-taam-red" />,
      label: t('contact.email'),
      value: 'info@taamclub.com',
      href: 'mailto:info@taamclub.com',
      external: false,
    },
    {
      icon: <Clock size={22} className="text-taam-red" />,
      label: t('contact.hours'),
      value: t('contact.hoursValue'),
      href: null,
      external: false,
    },
    {
      icon: <InstagramIcon size={22} className="text-taam-red" />,
      label: 'Instagram',
      value: '@taamclub',
      href: 'https://www.instagram.com/taamclub/',
      external: true,
    },
  ];

  const contactSchema = {
    '@type': 'ContactPage',
    '@id': 'https://taamclub.com/contact#webpage',
    'url': 'https://taamclub.com/contact',
    'name': lang === 'en' ? 'Contact TAAM Club' : 'TAAM Club İletişim',
    'description': lang === 'en' ? 'Contact details, address, opening hours, and location for TAAM Club Istanbul.' : 'TAAM Club İstanbul iletişim bilgileri, adres, çalışma saatleri ve konum detayları.',
    'mainEntity': {
      '@id': 'https://taamclub.com/#organization',
    },
  };

  return (
    <>
      <SEOHead
        title={lang === 'tr' ? 'İletişim & Konum Bilgileri | TAAM Club Istanbul' : 'Contact & Location Info | TAAM Club Istanbul'}
        description={lang === 'tr' ? "TAAM Club iletişim bilgileri, adres, e-posta ve çalışma saatleri. İstanbul'da lezzetin kalbine yol tarifi alın ve bizi ziyaret edin." : "Contact details, address, email, and hours for TAAM Club. Get directions to Istanbul's premier gourmet burger restaurant."}
        canonicalPath="/contact"
        breadcrumbs={[
          { name: lang === 'tr' ? 'Ana Sayfa' : 'Home', item: '/' },
          { name: lang === 'tr' ? 'İletişim' : 'Contact', item: '/contact' },
        ]}
        schema={contactSchema}
      />

      {/* Hero */}
      <div className="bg-taam-blue pt-20 pb-16 md:pt-28 md:pb-20 relative overflow-hidden">
        {/* BG texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />
        <div className="container-taam relative z-10">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-accent text-white/50 text-xs uppercase tracking-widest"
          >
            — {t('contact.title')}
          </motion.span>
          <div className="overflow-hidden mt-3">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-display-lg text-white leading-none"
            >
              {t('contact.comeSayHi')}
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-accent text-white/60 text-base leading-relaxed mt-5 max-w-sm"
          >
            {t('sections.locationSub')}
          </motion.p>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="bg-taam-off-white section-padding">
        <div className="container-taam">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {contactItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`bg-white rounded-2xl p-6 md:p-8 ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-taam-off-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-accent text-taam-gray text-xs uppercase tracking-widest mb-1.5">{item.label}</div>
                      <div className="font-accent text-taam-charcoal text-sm leading-relaxed whitespace-pre-line">{item.value}</div>
                    </div>
                  </div>

                  {item.href && (
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : '_self'}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="w-9 h-9 rounded-full bg-taam-off-white hover:bg-taam-blue hover:text-white flex items-center justify-center transition-all duration-200 flex-shrink-0 text-taam-blue"
                      aria-label={`${item.label} – ${item.value}`}
                    >
                      {item.external ? <ArrowUpRight size={14} /> : <ExternalLink size={14} />}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Embedded Google Map Section */}
          <div className="mt-8 rounded-2xl overflow-hidden border border-taam-tile shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96267.06245838925!2d28.86875567458753!3d41.06143545761176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab12a1e97f799%3A0x9eb5562c9296d851!2sTAAM!5e0!3m2!1str!2str!4v1793618870913!5m2!1str!2str"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="TAAM Google Maps Konumu"
              className="w-full h-[400px] md:h-[480px]"
            />
          </div>

          {/* Map CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-taam-charcoal rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 mt-8"
          >
            <div>
              <div className="font-accent text-white/50 text-xs uppercase tracking-widest mb-2">{t('contact.directions')}</div>
              <h2 className="font-display text-white text-3xl md:text-5xl leading-none">
                {lang === 'tr' ? 'Yolun Buradan\nGeçiyor.' : 'Your Route\nStarts Here.'}
              </h2>
            </div>
            <a
              href="https://maps.app.goo.gl/LjcB8p5Uq7dKkBBA7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-taam btn-taam-red text-sm px-8 py-4 group inline-flex flex-shrink-0"
              aria-label="Google Maps'te yol tarifi al"
            >
              {t('contact.directions')}
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>

          {/* Machine-Readable Contact & Hours Specification Table */}
          <div className="bg-white rounded-2xl border border-taam-tile p-6 md:p-8 mt-12 shadow-xs">
            <h3 className="font-display text-taam-charcoal text-2xl leading-none mb-3">
              {lang === 'tr' ? 'Resmî İletişim & Çalışma Saatleri Tablosu' : 'Official Contact & Operating Hours Specifications'}
            </h3>
            <p className="font-accent text-taam-gray text-sm mb-6">
              {lang === 'tr' ? 'Mekân erişimi, rezervasyon prensipleri ve coğrafi konum bilgileri.' : 'Venue access, seating policies, and geographic location specifications.'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-accent text-sm">
                <tbody className="divide-y divide-taam-tile">
                  <tr>
                    <th scope="row" className="py-3 font-semibold text-taam-charcoal w-1/3">
                      {lang === 'tr' ? 'Tam Adres' : 'Full Address'}
                    </th>
                    <td className="py-3 text-taam-gray">
                      İstanbul, Türkiye (<a href="https://maps.app.goo.gl/LjcB8p5Uq7dKkBBA7" target="_blank" rel="noopener noreferrer" className="text-taam-blue underline">Google Maps</a>)
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                      {lang === 'tr' ? 'E-posta' : 'Email'}
                    </th>
                    <td className="py-3 text-taam-gray">
                      info@taamclub.com
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                      {lang === 'tr' ? 'Hafta İçi Çalışma Saatleri' : 'Weekday Hours (Mon–Fri)'}
                    </th>
                    <td className="py-3 text-taam-gray">
                      11:00 – 22:00
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                      {lang === 'tr' ? 'Hafta Sonu Çalışma Saatleri' : 'Weekend Hours (Sat–Sun)'}
                    </th>
                    <td className="py-3 text-taam-gray">
                      10:00 – 23:00
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3 font-semibold text-taam-charcoal">
                      {lang === 'tr' ? 'Sipariş & Oturum Türü' : 'Ordering & Dining Formats'}
                    </th>
                    <td className="py-3 text-taam-gray">
                      {lang === 'tr' ? 'Restoran içi oturum ve Hızlı Gel-Al (Takeaway)' : 'Dine-in Seating and Express Takeaway'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
