import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '@/hooks/useLang';
import { MapPin, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { TaamLogo, TaamMotifs } from '@/components/ui/Logo';

export default function Footer() {
  const { t } = useTranslation();
  const { lang, setLang } = useLangStore();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.menu'), href: '/menu' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.careers', 'Kariyer'), href: '/careers' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  return (
    <footer className="bg-taam-charcoal text-white relative overflow-hidden" role="contentinfo">
      {/* Big watermark logo */}
      <div
        className="footer-logo-text absolute bottom-0 left-0 right-0 text-center pointer-events-none select-none opacity-5 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <TaamLogo className="w-full max-w-4xl h-auto text-white" />
      </div>

      <div className="container-taam relative z-10">
        {/* Top section */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Link to="/" aria-label="TAAM Club">
                <TaamLogo className="h-8 md:h-10 w-auto text-white" />
              </Link>
              <div className="mt-3">
                <TaamMotifs className="text-white/60" />
              </div>
            </div>
            <p className="text-white/70 font-accent text-sm leading-relaxed max-w-xs mt-3">
              Good sofra, better days.
            </p>
            <p className="text-white/50 font-accent text-xs mt-1">
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
              <li>
                <a
                  href="https://maps.app.goo.gl/LjcB8p5Uq7dKkBBA7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-white/70 hover:text-white transition-colors group"
                >
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-taam-red group-hover:scale-110 transition-transform" />
                  <span className="font-accent text-sm">{t('contact.addressValue')}</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@taamclub.com"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-accent text-sm"
                  aria-label="TAAM e-posta adresi"
                >
                  <Mail size={14} className="flex-shrink-0 text-taam-red" />
                  info@taamclub.com
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
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-white/40 text-xs font-accent">
            <span>© {currentYear} TAAM Club. {t('footer.rights')}</span>
            <span className="text-white/20">•</span>
            <a
              href="https://samer.life"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors underline underline-offset-4"
            >
              Made by Samer
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
