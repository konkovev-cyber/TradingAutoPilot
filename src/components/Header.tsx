import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

const navLinks = [
  { key: "nav.bots", href: "/#bots" },
  { key: "nav.how", href: "/#how" },
  { key: "nav.faq", href: "/#faq" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t, langLabel } = useI18n();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60" />
      <header className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between rounded-2xl transition-all duration-300 ${scrolled ? "glass-strong px-5 py-2.5" : "bg-transparent px-2 py-1"}`}>
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <svg width="32" height="32" viewBox="0 0 64 64" className="shrink-0">
                <defs>
                  <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--secondary)" />
                  </linearGradient>
                </defs>
                <rect width="64" height="64" rx="16" fill="rgba(0,255,178,0.08)" />
                <path d="M16 40 L24 28 L32 34 L40 20 L48 26" stroke="url(#logo-grad)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="48" cy="26" r="4" fill="var(--primary)" />
              </svg>
              <span className="text-lg font-display font-bold text-[var(--text)] tracking-tight">Coin<span className="text-[var(--primary)]">soft</span>er</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-xl hover:bg-[var(--surface-hover)]">
                  {t(link.key)}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all" title="Toggle theme">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setLang(lang === "ru" ? "en" : "ru")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all">
                <Globe size={14} />
                <span className="font-medium">{langLabel}</span>
              </button>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-xl hover:bg-[var(--surface-hover)]">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="mx-4 mt-2 glass-strong rounded-2xl p-5 space-y-3">
                  {navLinks.map((link) => (
                    <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors">
                      {t(link.key)}
                    </a>
                  ))}
                  <div className="my-2 border-t border-[var(--border)]" />
                  <div className="flex items-center gap-3">
                    <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all">
                      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                      <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
                    </button>
                    <button onClick={() => setLang(lang === "ru" ? "en" : "ru")} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all">
                      <Globe size={16} />
                      <span className="font-medium">{langLabel}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
