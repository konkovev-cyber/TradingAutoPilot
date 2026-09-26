import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Products', href: '/#products' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Support', href: '/#support' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<'RU' | 'EN'>('RU');
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-transparent via-[#00FFB2]/50 to-transparent" />

      <header
        className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between rounded-2xl transition-all duration-500 ${
            scrolled
              ? 'glass-strong px-5 py-2.5'
              : 'bg-transparent px-2 py-1'
          }`}>
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative w-8 h-8">
                <svg width="32" height="32" viewBox="0 0 64 64" className="shrink-0">
                  <defs>
                    <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00FFB2" />
                      <stop offset="100%" stopColor="#00D4FF" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" rx="16" fill="rgba(0,255,178,0.08)" />
                  <path
                    d="M16 40 L24 28 L32 34 L40 20 L48 26"
                    stroke="url(#logo-grad)"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="48" cy="26" r="4" fill="#00FFB2" />
                </svg>
              </div>
              <span className="text-lg font-display font-bold text-[#F1F5F9] tracking-tight">
                Coin<span className="text-[#00FFB2]">soft</span>er
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors duration-200 rounded-xl hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 transition-all duration-200"
              >
                <Globe size={14} />
                <span className="font-medium">{lang}</span>
                <ChevronDown size={12} className="text-[#64748B]" />
              </button>

              <button className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors font-medium">
                Sign in
              </button>

              <button className="btn-primary px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-[#00FFB2]/10">
                Get started free
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors rounded-xl hover:bg-white/5"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
              className="lg:hidden overflow-hidden"
            >
              <div className="mx-4 mt-2 glass-strong rounded-2xl p-5 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-sm text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="my-3 border-t border-white/5" />
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#94A3B8]">
                  <Globe size={14} />
                  <button
                    onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
                    className="font-medium hover:text-[#F1F5F9] transition-colors"
                  >
                    {lang}
                  </button>
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="btn-secondary flex-1 py-3 rounded-xl text-sm font-medium">
                    Sign in
                  </button>
                  <button className="btn-primary flex-1 py-3 rounded-xl text-sm font-semibold">
                    Get started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
