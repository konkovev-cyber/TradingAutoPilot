import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';

const navLinks = [
  { label: 'Продукты', href: '/#products' },
  { label: 'Как это работает', href: '/#how-it-works' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Поддержка', href: '/#support' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong py-2' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <svg width="32" height="32" viewBox="0 0 64 64" className="shrink-0">
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00FFB2" />
                  <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="14" fill="rgba(0,255,178,0.08)" />
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
            <span className="text-xl font-display font-bold text-[#E6EDF7]">
              Coinsofter
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#8B95A7] hover:text-[#E6EDF7] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
              className="flex items-center gap-1.5 text-sm text-[#8B95A7] hover:text-[#E6EDF7] transition-colors"
            >
              <Globe size={16} />
              <span className="font-medium">{lang}</span>
            </button>
            <button className="text-sm text-[#E6EDF7] hover:text-[#00FFB2] transition-colors font-medium">
              Войти
            </button>
            <button className="btn-primary px-5 py-2.5 rounded-xl text-sm">
              Начать бесплатно
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-[#E6EDF7]"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 glass-strong rounded-2xl p-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm text-[#8B95A7] hover:text-[#E6EDF7] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-1.5 text-sm text-[#8B95A7] pt-2 border-t border-white/5">
              <Globe size={16} />
              <button onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')} className="font-medium">
                {lang}
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="btn-secondary flex-1 py-2.5 rounded-xl text-sm">
                Войти
              </button>
              <button className="btn-primary flex-1 py-2.5 rounded-xl text-sm">
                Начать
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
