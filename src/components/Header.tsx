import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { useSections } from "@/lib/sections";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { sections } = useSections();
  const c = useContent();

  const navMap: Record<string, { href: string; domId: string; label: string }> = {
    products: { href: "/#bots", domId: "bots", label: c("nav", "bots", t("nav.bots")) },
    connect: { href: "/#how", domId: "how", label: c("nav", "how", t("nav.how")) },
    faq: { href: "/#faq", domId: "faq", label: c("nav", "faq", t("nav.faq")) },
  };
  const enabledKeys = new Set(sections.filter((s) => s.enabled).map((s) => s.key));
  const navLinks = Object.entries(navMap)
    .filter(([key]) => enabledKeys.has(key))
    .map(([key, v]) => ({ id: key, domId: v.domId, ...v }));
  const navDomIds = navLinks.map((l) => l.domId).join(",");

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = navDomIds.split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [navDomIds]);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const id = href.split("#")[1];
    const el = id ? document.getElementById(id) : null;
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-transparent focus:text-[#2563EB] focus:rounded-lg"
      >
        {t("ui.skip")}
      </a>

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-950/95 border-b border-gray-100 dark:border-gray-800 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Trading Auto Pilot" className="h-8 w-auto" />
            <span className="text-sm font-bold leading-tight text-gray-900 dark:text-white">
              Trading
              <br />
              Auto Pilot
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className={`text-sm font-medium transition-colors ${
                  active === link.domId
                    ? "text-[#2563EB]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={theme === "dark" ? t("ui.themeLight") : t("ui.themeDark")}
              aria-label={theme === "dark" ? t("ui.themeLight") : t("ui.themeDark")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Language"
            >
              <Globe size={16} />
              <span>{lang === "ru" ? "RU" : "EN"}</span>
            </button>

            <a
              href="#bots"
              onClick={(e) => handleAnchor(e, "/#bots")}
              className="hidden sm:inline-flex px-5 py-2.5 border border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-200 dark:border-blue-300/30 dark:bg-blue-400/10 text-sm font-semibold rounded-lg hover:bg-blue-500/20 dark:hover:bg-blue-400/20 transition-colors cursor-pointer"
            >
              {c("nav", "cta", lang === "en" ? "View bots" : "Смотреть роботов")}
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label={t("ui.menu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchor(e, link.href)}
                className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#bots"
              onClick={(e) => handleAnchor(e, "/#bots")}
              className="block w-full text-center px-5 py-2.5 border border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-200 dark:border-blue-300/30 dark:bg-blue-400/10 text-sm font-semibold rounded-lg cursor-pointer"
            >
              {c("nav", "cta", lang === "en" ? "View bots" : "Смотреть роботов")}
            </a>
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 h-[2px] bg-[#2563EB] transition-[width] duration-150"
          style={{ width: progress + "%" }}
          aria-hidden="true"
        />
      </header>
    </>
  );
}
