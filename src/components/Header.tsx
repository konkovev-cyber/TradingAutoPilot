import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/theme';

const navLinks = [
  { label: 'Боты', href: '/#bots' },
  { label: 'Как работает', href: '/#how' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-transparent via-[#00FFB2]/50 to-transparent" />
      <header className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between rounded-2xl transition-all duration-300 ${scrolled ? 'glass-strong px-6 py-3' : 'bg-transparent px-4 py-2'}`}>
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <svg width="32" height="32" viewBox="0 0 64 64" className="shrink-0">
                <defs>
                  <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00FFB2" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="16" fill="rgba(0,255,178,0.08)" stroke="url(#logo-grad)" strokeWidth="2" />
                <path d="M16 40 L24 28 L32 34 L40 20 L48 26" stroke="url(#logo-grad)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="48" cy="26" r="4" fill="#00FFB2" />
              </svg>
              <span className="text-xl font-display font-bold text-[var(--text)] tracking-tight">Coin<span className="text-[var(--primary)]">soft</span>er</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-xl hover:bg-[var(--white-10)]">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--white-10)] transition-all" title="Сменить тему">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a href="/#bots" className="btn-primary hidden sm:inline-flex text-sm px-5 py-2.5">
                Выбрать бота
              </a>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-xl">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="mx-4 mt-2 glass-strong rounded-2xl p-5 space-y-3">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="block px-4 py-3 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--white-10)] transition-colors">
                    {link.label}
                  </a>
                ))}
                <div className="my-2 border-t border-[var(--border)]" />
                <div className="flex items-center gap-3">
                  <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--white-10)] transition-all">
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span>{theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>
                  </button>
                </div>
                <a href="/#bots" className="btn-primary w-full justify-center text-sm py-3">
                  Выбрать бота
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
