import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, AlertTriangle, Share2, Send, ShieldCheck, Info, TrendingUp, Sparkles } from "lucide-react";
import { useBots } from "@/lib/use-bots";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import BotCard, { BotAvatar } from "@/components/bots/BotCard";
import BotStrategySteps from "@/components/bots/BotStrategySteps";
import BotTradeExample from "@/components/bots/BotTradeExample";
import BotVideo from "@/components/bots/BotVideo";
import BotBacktest from "@/components/bots/BotBacktest";
import Calculator from "@/components/Calculator";
import FAQ from "@/components/FAQ";
import Compare from "@/components/Compare";
import { useI18n } from "@/lib/i18n";
import { useContent, useContacts } from "@/lib/site-content";
import { useSeo } from "@/lib/seo";
import { botText, colorDimFrom } from "@/data/bots";
import { recordPageView } from "@/lib/page-views";

export default function BotDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const c = useContent();
  const contacts = useContacts();
  const bots = useBots();
  const bot = bots.find((b) => b.slug === slug || ((slug === "cryptosuperstock" || slug === "synchro-bot") && b.slug === "synchrobot")) ?? null;
  const [copied, setCopied] = useState(false);

  const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    window.scrollTo(0, 0);
    recordPageView(`/bots/${slug || ""}`);
  }, [slug]);

  useSeo({
    title: bot?.metaTitle || (bot ? botText(bot, lang).name + " — TradingAutoPilot" : "TradingAutoPilot"),
    description: bot?.metaDescription || (bot ? botText(bot, lang).shortDesc : "TradingAutoPilot trading bots"),
    image: bot?.ogImage || bot?.imageUrl,
    path: bot ? `/bots/${bot.slug}` : undefined,
    jsonLd: bot
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": botText(bot, lang).name,
          "description": bot?.metaDescription || botText(bot, lang).shortDesc,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
        }
      : undefined,
  });

  const share = async () => {
    const url = window.location.href;
    if (isTouch && navigator.share) {
      try {
        await navigator.share({ title: bot ? botText(bot, lang).name : "TradingAutoPilot", url });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard unavailable
      }
    }
  };

  const accentColor = bot ? (bot.color === "#00FFB2" ? "#00c98d" : bot.color) : "#00c98d";

  // Чистый текст для торгуемых пар (гарантированно без названий бирж)
  const rawPairs = bot ? botText(bot, lang).pairs : "";
  const cleanPairs = rawPairs.replace(/,\s*(Bybit|BingX|OKX)[^.]*/gi, "").trim() ||
    (lang === "ru"
      ? "BTC/USDT, ETH/USDT, SOL/USDT, XAUT/USDT, LTC/USDT и многие другие пары. Робот способен торговать любые активы, доступные на бирже"
      : "BTC/USDT, ETH/USDT, SOL/USDT, XAUT/USDT, LTC/USDT and many other pairs. The bot is capable of trading any assets available on the exchange");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Header />

      {bot ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          {/* ═══════════════════════════════════════════════
              HERO SECTION — Светлая современная палитра
              Слева: инфо + карточка доходности + CTA
              Справа: БАННЕР SynchroBot
          ═══════════════════════════════════════════════ */}
          <section className="relative overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
            {/* Нежное акцентное свечение */}
            <div
              className="pointer-events-none absolute -top-28 -right-28 h-[420px] w-[420px] rounded-full opacity-15 blur-3xl"
              style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
              aria-hidden="true"
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Верхняя навигация */}
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>{c("botDetail", "back", t("botDetail.back"))}</span>
                </Link>
                <button
                  onClick={share}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  aria-label={copied ? c("botDetail", "copied", t("botDetail.copied")) : c("botDetail", "share", t("botDetail.share"))}
                >
                  {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                  <span>{copied ? c("botDetail", "copied", t("botDetail.copied")) : c("botDetail", "share", t("botDetail.share"))}</span>
                </button>
              </div>

              {/* Хлебные крошки */}
              <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 dark:text-slate-500 mb-6" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{c("botDetail", "home", t("botDetail.home"))}</Link>
                <span>/</span>
                <Link to="/#bots" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{c("nav", "bots", t("nav.bots"))}</Link>
                <span>/</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{botText(bot, lang).name}</span>
              </nav>

              {/* Сетка Hero: 
                  Слева (3 колонки): Заголовок, слоган, описание, ДОХОДНОСТЬ, кнопки
                  Справа (2 колонки): БАННЕР SynchroBot 
              */}
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-center">
                
                {/* ЛЕВАЯ КОЛОНКА — Инфо + Доходность + CTA */}
                <div className="lg:col-span-3 min-w-0 flex flex-col gap-5">
                  {/* Бейдж */}
                  <div className="flex flex-wrap items-center gap-2">
                    {botText(bot, lang).badge && (
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm"
                        style={{ background: colorDimFrom(bot.color), color: accentColor }}
                      >
                        <Sparkles size={13} />
                        {botText(bot, lang).badge}
                      </span>
                    )}
                    {bot.inDevelopment && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" aria-hidden="true" />
                        {c("products", "inDevelopment", t("products.inDevelopment"))}
                      </span>
                    )}
                  </div>

                  {/* Аватар + Название */}
                  <div className="flex items-center gap-4">
                    <BotAvatar bot={bot} size={64} />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight min-w-0 break-words">
                      {botText(bot, lang).name}
                    </h1>
                  </div>

                  {/* Слоган */}
                  <p className="text-lg sm:text-xl font-bold leading-snug" style={{ color: accentColor }}>
                    {botText(bot, lang).slogan}
                  </p>

                  {/* Краткое описание */}
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {botText(bot, lang).shortDesc}
                  </p>

                  {/* ── БЛОК ДОХОДНОСТИ (поменялся местами с баннером) ── */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white dark:bg-slate-800/90 dark:border-slate-700 p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          {c("botDetail", "income", t("botDetail.income"))}
                        </span>
                      </div>
                      <a
                        href="#bot-backtests"
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors inline-flex items-center gap-1"
                      >
                        График и бэктесты →
                      </a>
                    </div>

                    {/* Сетка показателей доходности */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {botText(bot, lang).returns.map((r, ri) => (
                        <div
                          key={ri}
                          className="flex flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-750/70 border border-slate-200/70 dark:border-slate-700 px-2 py-2.5 text-center"
                        >
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mb-0.5">{r.period}</span>
                          <span
                            className="text-lg sm:text-xl font-extrabold tabular-nums tracking-tight leading-tight"
                            style={{ color: accentColor }}
                          >
                            {r.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Мини SVG линия доходности */}
                    <div className="mt-3 overflow-hidden rounded-lg opacity-75">
                      <svg viewBox="0 0 200 36" className="w-full h-8" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id={`chartFillHero_${bot.slug}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 32 C20 30 30 24 50 20 S80 12 100 10 S140 6 160 5 S185 3 200 2 L200 36 L0 36 Z"
                          fill={`url(#chartFillHero_${bot.slug})`}
                        />
                        <path
                          d="M0 32 C20 30 30 24 50 20 S80 12 100 10 S140 6 160 5 S185 3 200 2"
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                      {c("botDetail", "disclaimer", t("trust.disclaimer"))}
                    </p>
                  </div>

                  {/* Быстрые чипы */}
                  <div className="flex flex-wrap items-center gap-2">
                    {bot.videoUrl && (
                      <a
                        href="#bot-video"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 transition-all shadow-sm"
                      >
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        {c("botDetail", "chipWatchVideo", "Смотреть видеообзор")}
                      </a>
                    )}
                    <a
                      href="#bot-backtests"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 transition-all shadow-sm"
                    >
                      <span>📊</span>
                      {c("botDetail", "chipBacktests", "Бэктесты и динамика")}
                    </a>
                    <a
                      href={contacts.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 transition-all shadow-sm"
                    >
                      <Send size={12} />
                      {c("botDetail", "chipAskQuestion", "Задать вопрос")}
                    </a>
                  </div>

                  {/* Кнопка CTA */}
                  <div>
                    <a
                      href={contacts.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-100"
                      style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)` }}
                    >
                      <Send size={16} />
                      {c("botDetail", "contactCta", t("botDetail.contactCta"))}
                    </a>
                  </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА — БАННЕР SYNCHROBOT (поменялся местами с доходностью) */}
                <div className="lg:col-span-2">
                  {bot.imageUrl ? (
                    <div className="relative group overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-2 transition-all hover:shadow-2xl">
                      <div className="overflow-hidden rounded-2xl">
                        <img
                          src={bot.imageUrl}
                          alt={botText(bot, lang).name}
                          className="w-full h-auto object-cover max-h-[460px] transform group-hover:scale-[1.02] transition-transform duration-500"
                          loading="eager"
                        />
                      </div>
                      {/* Мягкая нижняя подпись к баннеру */}
                      <div className="px-3 pt-3 pb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{botText(bot, lang).name} AI</span>
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Активен 24/7
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>

              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              PAGE BODY — Светлый фон
              Сразу ПОСЛЕ баннера идет раздел «О роботе»!
          ═══════════════════════════════════════════════ */}
          <main id="main" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* 1. РАЗДЕЛ «О РОБОТЕ» (СРАЗУ ПОСЛЕ БАННЕРА) */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2 w-2 rounded-full" style={{ background: accentColor }} />
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {c("botDetail", "about", t("botDetail.about"))} {botText(bot, lang).name}
                  </h2>
                </div>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {botText(bot, lang).fullDesc}
                </p>
              </div>

              {/* 2. КЛЮЧЕВЫЕ ПАРАМЕТРЫ: Особенности (слева) + Торгуемые активы, Риски, Безопасность (справа) */}
              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                {/* Особенности списком */}
                <div className="rounded-3xl border border-slate-200/90 bg-white dark:border-slate-700 dark:bg-slate-800 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                    {c("botDetail", "features", t("botDetail.features"))}
                  </h3>
                  <ul className="space-y-3">
                    {botText(bot, lang).features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <Check size={16} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Торгуемые активы (без бирж) + Риски + Безопасность */}
                <div className="flex flex-col gap-4">
                  {/* Торгуемые активы — биржи удалены */}
                  <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700 dark:bg-slate-800 p-5 shadow-sm">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider font-bold">
                      {c("botDetail", "pairs", t("botDetail.pairs"))}
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed">
                      {cleanPairs}
                    </p>
                  </div>

                  {/* Риски */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/90 dark:border-amber-500/30 dark:bg-amber-500/10 p-5 shadow-sm flex gap-3">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <div className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                        {c("botDetail", "risks", t("botDetail.risks"))}
                      </div>
                      <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                        {botText(bot, lang).risk}
                      </p>
                    </div>
                  </div>

                  {/* Безопасность */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 dark:border-emerald-500/30 dark:bg-emerald-500/10 p-5 shadow-sm flex gap-3">
                    <ShieldCheck size={18} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                        {c("botDetail", "safetyTitle", t("botDetail.safetyTitle"))}
                      </div>
                      <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
                        {c("botDetail", "safety", t("botDetail.safety"))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. КАК РОБОТ ЗАРАБАТЫВАЕТ */}
              {botText(bot, lang).howItWorks.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    {c("botDetail", "howEarn", t("botDetail.howEarn"))}
                  </h3>
                  <BotStrategySteps bot={bot} />
                </div>
              )}

              {/* 4. ПРИМЕР СДЕЛКИ */}
              <div className="mb-12">
                <BotTradeExample bot={bot} />
              </div>

              {/* 5. ВИДЕООБЗОР */}
              <BotVideo bot={bot} />

              {/* 6. БЭКТЕСТЫ И ДИНАМИКА ДЕПОЗИТА */}
              <BotBacktest bot={bot} />

              {/* 7. CTA КНОПКИ */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <a
                  href={contacts.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base w-full sm:w-auto shadow-md"
                >
                  <Send size={18} />
                  {c("botDetail", "contactCta", t("botDetail.contactCta"))}
                </a>
                <Link to="/#bots" className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 text-base w-full sm:w-auto">
                  <ArrowLeft size={16} /> {c("botDetail", "back", t("botDetail.back"))}
                </Link>
              </div>

              {/* 8. ДРУГИЕ РОБОТЫ */}
              <div className="mb-16">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{c("botDetail", "fits", t("botDetail.fits"))}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {bots
                    .filter((b) => b.slug !== bot.slug)
                    .map((b) => (
                      <BotCard key={b.slug} bot={b} compact />
                    ))}
                </div>
              </div>

              {/* 9. КАЛЬКУЛЯТОР */}
              <div className="mb-16 rounded-3xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                <Calculator initialSlug={bot.slug} ctaTarget="#main" />
              </div>

              {/* 10. СРАВНЕНИЕ */}
              <div className="mb-16">
                <Compare />
              </div>

              {/* 11. FAQ */}
              <div className="rounded-3xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden mb-16">
                <FAQ />
              </div>

              {/* 12. СПИСОК ВСЕХ РОБОТОВ */}
              <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{c("botDetail", "others", t("botDetail.others"))}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {bots
                    .filter((b) => b.slug !== bot.slug)
                    .map((b) => (
                      <Link
                        key={b.slug}
                        to={`/bots/${b.slug}`}
                        className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-sm card-hover flex items-center gap-4"
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0"
                          style={{ background: colorDimFrom(b.color), color: b.color === "#00FFB2" ? "#00c98d" : b.color }}
                        >
                          {botText(b, lang).name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{botText(b, lang).name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{botText(b, lang).badge}</div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </main>
        </motion.div>
      ) : (
        <div className="text-center py-32 pt-40">
          <p className="text-slate-500 dark:text-slate-400 mb-6">{c("botDetail", "notFound", t("botDetail.notFound"))}</p>
          <Link to="/" className="btn-primary">{c("botDetail", "backHome", t("botDetail.backHome"))}</Link>
        </div>
      )}

      <FloatingContact />
    </div>
  );
}
