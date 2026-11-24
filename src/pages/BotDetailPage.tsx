import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, AlertTriangle, Share2, Send, ShieldCheck, Play, TrendingUp, Sparkles, Activity } from "lucide-react";
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

  // Чистый текст для торгуемых пар (без названий бирж)
  const rawPairs = bot ? botText(bot, lang).pairs : "";
  const cleanPairs = rawPairs.replace(/,\s*(Bybit|BingX|OKX)[^.]*/gi, "").trim() ||
    (lang === "ru"
      ? "BTC/USDT, ETH/USDT, SOL/USDT, XAUT/USDT, LTC/USDT и многие другие пары. Робот способен торговать любые активы, доступные на бирже"
      : "BTC/USDT, ETH/USDT, SOL/USDT, XAUT/USDT, LTC/USDT and many other pairs. The bot is capable of trading any assets available on the exchange");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d18] text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      <Header />

      {bot ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          {/* ═══════════════════════════════════════════════════════════
              HERO SECTION — Полная поддержка Светлой ☀️ и Тёмной 🌙 тем
              Слева (6 col): Заголовок, аватар, слоган, доходность, CTA
              Справа (6 col): Баннер + особенности + параметры (симметрично)
          ═══════════════════════════════════════════════════════════ */}
          <section className="relative overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 dark:from-[#0a1324] dark:via-[#070d18] dark:to-[#070d18] transition-colors duration-300">
            {/* Неоновые мягкие акценты на фоне */}
            <div
              className="pointer-events-none absolute -top-40 right-10 h-[500px] w-[500px] rounded-full opacity-10 dark:opacity-20 blur-3xl transition-opacity duration-300"
              style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute top-1/2 -left-32 h-[350px] w-[350px] rounded-full opacity-10 blur-3xl"
              style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
              aria-hidden="true"
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Верхняя панель: Навигация слева + Статус и Поделиться справа */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/70 dark:border-white/[0.06]">
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft size={15} />
                    <span>{c("botDetail", "back", t("botDetail.back"))}</span>
                  </Link>
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                    <Link to="/#bots" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{c("nav", "bots", t("nav.bots"))}</Link>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{botText(bot, lang).name}</span>
                  </nav>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1 rounded-full shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    Активен 24/7
                  </span>
                  <button
                    onClick={share}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full shadow-sm transition-all"
                    aria-label={copied ? c("botDetail", "copied", t("botDetail.copied")) : c("botDetail", "share", t("botDetail.share"))}
                  >
                    {copied ? <Check size={13} className="text-emerald-600 dark:text-emerald-400" /> : <Share2 size={13} />}
                    <span>{copied ? c("botDetail", "copied", t("botDetail.copied")) : c("botDetail", "share", t("botDetail.share"))}</span>
                  </button>
                </div>
              </div>

              {/* Сетка Hero: ДВЕ СИММЕТРИЧНЫЕ КОЛОНКИ 50/50 */}
              <div className="grid lg:grid-cols-12 gap-8 items-stretch">

                {/* ── ЛЕВАЯ КОЛОНКА (Инфо + Доходность + Действия) ── */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    {/* Бейджи стратегии */}
                    <div className="flex flex-wrap items-center gap-2">
                      {botText(bot, lang).badge && (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-sm"
                          style={{
                            background: colorDimFrom(bot.color),
                            color: accentColor,
                            borderColor: `${accentColor}40`,
                          }}
                        >
                          <Sparkles size={13} />
                          {botText(bot, lang).badge}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        <Activity size={12} className="text-emerald-600 dark:text-emerald-400" />
                        Фьючерсы & Спот
                      </span>
                      {bot.inDevelopment && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-400/60 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 dark:bg-amber-400" />
                          {c("products", "inDevelopment", t("products.inDevelopment"))}
                        </span>
                      )}
                    </div>

                    {/* Аватар + Имя бота */}
                    <div className="flex items-center gap-4 pt-1">
                      <div className="relative">
                        <div
                          className="absolute -inset-1 rounded-2xl opacity-25 dark:opacity-40 blur-sm"
                          style={{ background: accentColor }}
                        />
                        <div className="relative">
                          <BotAvatar bot={bot} size={64} />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {botText(bot, lang).name}
                        </h1>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Алгоритмический торговый комплекс</div>
                      </div>
                    </div>

                    {/* Слоган */}
                    <p className="text-lg sm:text-xl font-bold leading-snug" style={{ color: accentColor }}>
                      {botText(bot, lang).slogan}
                    </p>

                    {/* Краткое описание */}
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {botText(bot, lang).shortDesc}
                    </p>
                  </div>

                  {/* КАРТОЧКА ДОХОДНОСТИ — Адаптирована под Светлую ☀️ и Тёмную 🌙 темы */}
                  <div className="rounded-2xl border border-slate-200 dark:border-emerald-500/25 bg-white/95 dark:bg-[#0e192d]/80 backdrop-blur-md p-4 sm:p-5 shadow-sm dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] transition-colors duration-300">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                          {c("botDetail", "income", t("botDetail.income"))}
                        </span>
                      </div>
                      <a
                        href="#bot-backtests"
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                      >
                        График и бэктесты →
                      </a>
                    </div>

                    {/* 3 ячейки доходности в едином стиле */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {botText(bot, lang).returns.map((r, ri) => (
                        <div
                          key={ri}
                          className="rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] py-2 px-2 flex flex-col items-center justify-center transition-colors duration-300"
                        >
                          <span className="text-lg sm:text-2xl font-extrabold tabular-nums tracking-tight" style={{ color: accentColor }}>
                            {r.value}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{r.period}</span>
                        </div>
                      ))}
                    </div>

                    {/* Плавный неоновый график */}
                    <div className="mt-3 overflow-hidden rounded-lg opacity-85">
                      <svg viewBox="0 0 200 32" className="w-full h-7" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id={`heroWave_${bot.slug}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
                            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 28 C25 26 35 20 60 18 S90 12 115 10 S150 6 170 5 S190 3 200 2 L200 32 L0 32 Z"
                          fill={`url(#heroWave_${bot.slug})`}
                        />
                        <path
                          d="M0 28 C25 26 35 20 60 18 S90 12 115 10 S150 6 170 5 S190 3 200 2"
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

                  {/* Кнопки действий: Главная CTA + Чипы в один аккуратный ряд */}
                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <a
                      href={contacts.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-100 flex-1 sm:flex-initial"
                      style={{ background: accentColor }}
                    >
                      <Send size={16} />
                      {c("botDetail", "contactCta", t("botDetail.contactCta"))}
                    </a>

                    {bot.videoUrl && (
                      <a
                        href="#bot-video"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-3.5 py-3 text-xs font-semibold text-red-600 dark:text-red-300 transition-all shadow-sm"
                      >
                        <Play size={13} className="text-red-600 dark:text-red-400 fill-red-600 dark:fill-red-400" />
                        <span>Видеообзор</span>
                      </a>
                    )}

                    <a
                      href="#bot-backtests"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-3.5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
                    >
                      <span>📊</span>
                      <span>Бэктесты</span>
                    </a>
                  </div>
                </div>

                {/* ── ПРАВАЯ КОЛОНКА (Баннер бота + Ключевые особенности — Симметрия по высоте!) ── */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div className="h-full rounded-2xl border border-slate-200 dark:border-emerald-500/25 bg-white/95 dark:bg-[#0e192d]/80 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between shadow-sm dark:shadow-[0_4px_30px_-4px_rgba(0,0,0,0.6)] space-y-4 transition-colors duration-300">
                    {/* Баннер робота */}
                    {bot.imageUrl ? (
                      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-slate-950 shadow-md">
                        <img
                          src={bot.imageUrl}
                          alt={botText(bot, lang).name}
                          className="w-full h-auto object-cover max-h-[260px] sm:max-h-[280px]"
                          loading="eager"
                        />
                      </div>
                    ) : null}

                    {/* Блок ключевых особенностей — заполняет пустоту под картинкой */}
                    <div className="space-y-2.5 py-1">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                        <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <span>{c("botDetail", "features", t("botDetail.features"))}</span>
                      </div>
                      <ul className="space-y-2">
                        {botText(bot, lang).features.slice(0, 4).map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            <Check size={15} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="leading-snug">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Нижняя плашка параметров бота */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-white/[0.06] text-center">
                      <div className="rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] p-2 transition-colors duration-300">
                        <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Направление</div>
                        <div className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">LONG & SHORT</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] p-2 transition-colors duration-300">
                        <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Анализ</div>
                        <div className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">Объемы и тренд</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06] p-2 transition-colors duration-300">
                        <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Риск-контроль</div>
                        <div className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">Stop-Loss / TP</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════
              РАЗДЕЛ «О РОБОТЕ» — ИДЕТ СРАЗУ ПОСЛЕ БАННЕРА
          ═══════════════════════════════════════════════════════════ */}
          <main id="main" className="py-12 sm:py-16 bg-slate-50 dark:bg-[#070d18] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

              {/* 1. ПОЛНОЕ ОПИСАНИЕ РОБОТА */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] p-6 sm:p-8 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full" style={{ background: accentColor }} />
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {c("botDetail", "about", t("botDetail.about"))} {botText(bot, lang).name}
                  </h2>
                </div>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {botText(bot, lang).fullDesc}
                </p>
              </div>

              {/* 2. ПАРАМЕТРЫ ТОРГОВЛИ: Торгуемые активы + Риски + Безопасность */}
              <div className="grid sm:grid-cols-3 gap-5">
                {/* Торгуемые активы */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] p-5 shadow-sm flex flex-col justify-between transition-colors duration-300">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-bold">
                      {c("botDetail", "pairs", t("botDetail.pairs"))}
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-100 font-semibold leading-relaxed">
                      {cleanPairs}
                    </p>
                  </div>
                </div>

                {/* Риски */}
                <div className="rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-500/10 p-5 shadow-sm flex flex-col justify-between transition-colors duration-300">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200 mb-2">
                      <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{c("botDetail", "risks", t("botDetail.risks"))}</span>
                    </div>
                    <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                      {botText(bot, lang).risk}
                    </p>
                  </div>
                </div>

                {/* Безопасность */}
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-500/10 p-5 shadow-sm flex flex-col justify-between transition-colors duration-300">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-2">
                      <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{c("botDetail", "safetyTitle", t("botDetail.safetyTitle"))}</span>
                    </div>
                    <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
                      {c("botDetail", "safety", t("botDetail.safety"))}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. ШАГИ СТРАТЕГИИ */}
              {botText(bot, lang).howItWorks.length > 0 && (
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    {c("botDetail", "howEarn", t("botDetail.howEarn"))}
                  </h3>
                  <BotStrategySteps bot={bot} />
                </div>
              )}

              {/* 4. ПРИМЕР СДЕЛКИ */}
              <div>
                <BotTradeExample bot={bot} />
              </div>

              {/* 5. ВИДЕООБЗОР */}
              <BotVideo bot={bot} />

              {/* 6. БЭКТЕСТЫ И ДИНАМИКА ДЕПОЗИТА */}
              <BotBacktest bot={bot} />

              {/* 7. CTA КНОПКИ */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
              <div>
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
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] shadow-sm overflow-hidden transition-colors duration-300">
                <Calculator initialSlug={bot.slug} ctaTarget="#main" />
              </div>

              {/* 10. FAQ */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1424] shadow-sm overflow-hidden transition-colors duration-300">
                <FAQ />
              </div>

              {/* 11. СПИСОК ВСЕХ РОБОТОВ */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{c("botDetail", "others", t("botDetail.others"))}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {bots
                    .filter((b) => b.slug !== bot.slug)
                    .map((b) => (
                      <Link
                        key={b.slug}
                        to={`/bots/${b.slug}`}
                        className="bg-white dark:bg-[#0c1424] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm card-hover flex items-center gap-4 transition-all"
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
