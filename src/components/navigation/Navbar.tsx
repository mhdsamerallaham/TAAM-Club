import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '@/hooks/useLang';
import { TaamLogo } from '@/components/ui/Logo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { lang, setLang } = useLangStore();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.menu'), href: '/menu' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.careers', 'Kariyer'), href: '/careers' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  const isTransparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isTransparent ? 'transparent' : 'rgba(0, 38, 100, 0.97)',
          backdropFilter: isTransparent ? 'none' : 'blur(16px)',
          boxShadow: isTransparent ? 'none' : '0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <div className="container-taam">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group py-2" aria-label="TAAM Club - Ana Sayfa">
              <TaamLogo className="h-6 md:h-8 w-auto text-white transition-opacity duration-200 group-hover:opacity-90" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Ana navigasyon">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="nav-link nav-link-white text-white/90 hover:text-white"
                  aria-current={location.pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-6">
              {/* Lang Toggle */}
              <button
                onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                className="font-accent font-700 text-xs tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200"
                aria-label={`Switch to ${lang === 'tr' ? 'English' : 'Turkish'}`}
              >
                <span className={lang === 'tr' ? 'text-white' : 'text-white/50'}>TR</span>
                <span className="text-white/30 mx-1">|</span>
                <span className={lang === 'en' ? 'text-white' : 'text-white/50'}>EN</span>
              </button>

              <Link
                to="/menu"
                className="btn-taam btn-taam-red text-sm px-5 py-2.5"
              >
                {t('nav.viewMenu')}
              </Link>
            </div>

            {/* Mobile: Lang + Hamburger */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                className="font-accent font-700 text-xs tracking-widest uppercase text-white/70"
                aria-label="Dil değiştir"
              >
                <span className={lang === 'tr' ? 'text-white' : 'text-white/50'}>TR</span>
                <span className="text-white/30 mx-1">|</span>
                <span className={lang === 'en' ? 'text-white' : 'text-white/50'}>EN</span>
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-white"
                aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                aria-expanded={menuOpen}
              >
                <motion.span
                  animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
                  className="block w-6 h-0.5 bg-current origin-center transition-all"
                />
                <motion.span
                  animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                  className="block w-6 h-0.5 bg-current"
                />
                <motion.span
                  animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
                  className="block w-6 h-0.5 bg-current origin-center"
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-menu-overlay"
          >
            {/* Close header */}
            <div className="flex items-center justify-between mb-12">
              <Link to="/" onClick={() => setMenuOpen(false)} aria-label="TAAM Club">
                <TaamLogo className="h-6 w-auto text-white" />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white/70 hover:text-white text-sm font-accent uppercase tracking-widest"
                aria-label="Kapat"
              >
                Kapat ✕
              </button>
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col gap-2" role="navigation" aria-label="Mobil navigasyon">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block font-display text-white leading-none py-3 border-b border-white/10 hover:text-taam-red transition-colors"
                    style={{ fontSize: 'clamp(36px, 10vw, 56px)' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-auto pt-12"
            >
              <Link
                to="/menu"
                onClick={() => setMenuOpen(false)}
                className="btn-taam btn-taam-red w-full text-center text-base py-4"
              >
                {t('nav.viewMenu')}
              </Link>
              <p className="text-white/40 text-xs font-accent text-center mt-4 uppercase tracking-widest">
                @taamclub
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
