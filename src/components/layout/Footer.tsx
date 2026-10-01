import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '@/hooks/useLang';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';

export default function Footer() {
  const { t } = useTranslation();
  const { lang, setLang } = useLangStore();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.menu'), href: '/menu' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  return (
    <footer className="bg-taam-charcoal text-white relative overflow-hidden" role="contentinfo">
      {/* Big watermark logo */}
      <div
        className="footer-logo-text absolute bottom-0 left-0 right-0 text-center pointer-events-none select-none"
        aria-hidden="true"
      >
        TAAM
      </div>

      <div className="container-taam relative z-10">
        {/* Top section */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-taam-blue border-2 border-white/20 flex items-center justify-center">
                <span className="font-display text-white text-sm leading-none tracking-wider">TAAM</span>
              </div>
              <div>
                <div className="font-display text-white text-xl leading-none">TAAM CLUB</div>
                <div className="text-white/50 text-xs font-accent mt-0.5 uppercase tracking-widest">Restaurant</div>
              </div>
            </div>
            <p className="text-white/60 font-accent text-sm leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
            <a
              href="https://www.instagram.com/taamclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-white/70 hover:text-white transition-colors text-sm font-accent group"
              aria-label="TAAM Club Instagram sayfasını ziyaret et"
            >
              <InstagramIcon size={16} />
              @taamclub
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-accent text-white/40 text-xs uppercase tracking-widest mb-5">
              Sayfalar
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white font-accent text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-accent text-white/40 text-xs uppercase tracking-widest mb-5">
              {t('contact.title')}
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              <li className="flex items-start gap-2 text-white/70">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-taam-red" />
                <span className="font-accent text-sm">{t('contact.addressValue')}</span>
              </li>
              <li>
                <a
                  href="tel:+905000000000"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-accent text-sm"
                  aria-label="TAAM Club telefon numarası"
                >
                  <Phone size={14} className="flex-shrink-0 text-taam-red" />
                  +90 500 000 00 00
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/70">
                <Clock size={14} className="mt-0.5 flex-shrink-0 text-taam-red" />
                <span className="font-accent text-sm whitespace-pre-line">{t('contact.hoursValue')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/40 text-xs font-accent">
            <span>© {currentYear} TAAM Club. {t('footer.rights')}</span>
            <span className="text-white/20">•</span>
            <a
              href="https://www.samer.life/"
              target="_blank"
              rel="nofollow noopener"
              title="Developer Portfolio"
              style={{ color: 'inherit', textDecoration: 'none' }}
              className="hover:text-white/70 transition-colors"
            >
              Built by
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang('tr')}
              className={`text-xs font-accent uppercase tracking-widest transition-colors ${lang === 'tr' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
              aria-label="Türkçe"
            >
              TR
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setLang('en')}
              className={`text-xs font-accent uppercase tracking-widest transition-colors ${lang === 'en' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
              aria-label="English"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
