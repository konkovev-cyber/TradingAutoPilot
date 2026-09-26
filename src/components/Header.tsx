import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';

const navLinks = [
  { key: 'nav.products', href: '/#products' },
  { key: 'nav.howItWorks', href: '/#how-it-works' },
  { key: 'nav.faq', href: '/#faq' },
  { key: 'nav.support', href: '/#support' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  const langLabel = lang === 'ru' ? 'RU' : 'EN';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-transparent via-[#00FFB2]/50 to-transparent" />
      <header className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between rounded-2xl transition-all duration-500 ${scrolled ? 'glass-strong px-5 py-2.5' : 'bg-transparent px-2 py-1'}`}>
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
                            <img src="/logo-dark.png" alt="Coinsofter" className="h-8 w-auto dark:hidden" />
              <img src="/logo-light.png" alt="Coinsofter" className="h-8 w-auto hidden dark:block" />

              <span className="text-lg font-display font-bold text-[#F1F5F9] tracking-tight">Coin<span className="text-[#00FFB2]">soft</span>er</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="relative px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors duration-200 rounded-xl hover:bg-white/5">{t(link.key)}</a>
              ))}
            </nav>
            <div className="hidden lg:flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 transition-all" title="Toggle theme">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 transition-all">
                <Globe size={14} /><span className="font-medium">{langLabel}</span>
              </button>
              <button className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors font-medium">{t('nav.login')}</button>
              <button className="btn-primary px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-[#00FFB2]/10">{t('nav.start')}</button>
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors rounded-xl hover:bg-white/5">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.2 }} className="lg:hidden overflow-hidden">
              <div className="mx-4 mt-2 glass-strong rounded-2xl p-5 space-y-3">
                {navLinks.map((link) => (<a key={link.href} href={link.href} className="block px-4 py-3 rounded-xl text-sm text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 transition-colors">{t(link.key)}</a>))}
                <div className="my-2 border-t border-white/5" />
                <div className="flex items-center gap-3">
                  <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 transition-all">
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                  </button>
                  <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 transition-all">
                    <Globe size={16} /><span className="font-medium">{langLabel}</span>
                  </button>
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="btn-secondary flex-1 py-3 rounded-xl text-sm font-medium">{t('nav.login')}</button>
                  <button className="btn-primary flex-1 py-3 rounded-xl text-sm font-semibold">{t('nav.startShort')}</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
