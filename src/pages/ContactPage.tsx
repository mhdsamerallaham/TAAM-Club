import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '@/hooks/useLang';
import { MapPin, Clock, Phone, Mail, ArrowUpRight, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';

export default function ContactPage() {
  const { t } = useTranslation();
  const { lang } = useLangStore();

  const contactItems = [
    {
      icon: <MapPin size={22} className="text-taam-red" />,
      label: t('contact.address'),
      value: t('contact.addressValue'),
      href: 'https://maps.google.com',
      external: true,
    },
    {
      icon: <Phone size={22} className="text-taam-red" />,
      label: t('contact.phone'),
      value: '+90 500 000 00 00',
      href: 'tel:+905000000000',
      external: false,
    },
    {
      icon: <Mail size={22} className="text-taam-red" />,
      label: t('contact.email'),
      value: t('contact.emailValue'),
      href: `mailto:${t('contact.emailValue')}`,
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

  return (
    <>
      <Helmet>
        <title>İletişim | TAAM Club</title>
        <meta name="description" content="TAAM Club iletişim bilgileri – Adres, telefon, çalışma saatleri ve harita. İstanbul'da bizi ziyaret edin." />
        <meta property="og:title" content="İletişim | TAAM Club" />
        <link rel="canonical" href="https://taamclub.com/contact" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "TAAM Club",
          "telephone": "+905000000000",
          "email": "merhaba@taamclub.com",
          "url": "https://taamclub.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Istanbul",
            "addressCountry": "TR"
          },
          "openingHoursSpecification": [
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "11:00", "closes": "22:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday","Sunday"], "opens": "10:00", "closes": "23:00" }
          ]
        })}</script>
      </Helmet>

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

          {/* Map CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-taam-charcoal rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="font-accent text-white/50 text-xs uppercase tracking-widest mb-2">{t('contact.directions')}</div>
              <h2 className="font-display text-white text-3xl md:text-5xl leading-none">
                {lang === 'tr' ? 'Yolun Buradan\nGeçiyor.' : 'Your Route\nStarts Here.'}
              </h2>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-taam btn-taam-red text-sm px-8 py-4 group inline-flex flex-shrink-0"
              aria-label="Google Maps'te yol tarifi al"
            >
              {t('contact.directions')}
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
