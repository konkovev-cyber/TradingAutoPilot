import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, AlertTriangle, Share2, Send, ShieldCheck, Info, TrendingUp } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#070c1b] transition-colors duration-300">
      <Header />

      {bot ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          {/* ═══════════════════════════════════════════════
              HERO SECTION — integrated full-width banner
          ═══════════════════════════════════════════════ */}
          <section className="relative overflow-hidden pt-20 sm:pt-24 pb-10 sm:pb-14 border-b border-slate-100 dark:border-white/[0.06] bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 dark:from-[#070c1b] dark:via-[#0a1225] dark:to-[#060b18]">
            {/* Background decorative blobs */}
            <div
              className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full opacity-10 blur-3xl dark:opacity-20"
              style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full opacity-5 blur-3xl dark:opacity-10"
              style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
              aria-hidden="true"
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Top nav row */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft size={15} />
                  <span>{c("botDetail", "back", t("botDetail.back"))}</span>
                </Link>
                <button
                  onClick={share}
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  aria-label={copied ? c("botDetail", "copied", t("botDetail.copied")) : c("botDetail", "share", t("botDetail.share"))}
                >
                  {copied ? <Check size={15} /> : <Share2 size={15} />}
                  <span>{copied ? c("botDetail", "copied", t("botDetail.copied")) : c("botDetail", "share", t("botDetail.share"))}</span>
                </button>
              </div>

              {/* Breadcrumb */}
              <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-slate-400 dark:text-slate-500 mb-6 sm:mb-8" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{c("botDetail", "home", t("botDetail.home"))}</Link>
                <span>/</span>
                <Link to="/#bots" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{c("nav", "bots", t("nav.bots"))}</Link>
                <span>/</span>
                <span className="text-slate-700 dark:text-slate-300">{botText(bot, lang).name}</span>
              </nav>

              {/* Hero two-column layout */}
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                {/* LEFT — bot info */}
                <div className="lg:col-span-3 min-w-0">
                  {/* Badge chips row */}
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    {botText(bot, lang).badge && (
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                        style={{ background: colorDimFrom(bot.color), color: accentColor }}
                      >
                        {botText(bot, lang).badge}
                      </span>
                    )}
                    {bot.inDevelopment && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-amber-400/80 bg-amber-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-amber-600 dark:border-amber-400/60 dark:bg-amber-400/10 dark:text-amber-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" aria-hidden="true" />
                        {c("products", "inDevelopment", t("products.inDevelopment"))}
                      </span>
                    )}
                  </div>

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-4 mb-3">
                    <BotAvatar bot={bot} size={68} />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight min-w-0 break-words">
                      {botText(bot, lang).name}
                    </h1>
                  </div>

                  {/* Slogan */}
                  <p className="text-lg sm:text-xl font-semibold mb-3 max-w-xl leading-snug" style={{ color: accentColor }}>
                    {botText(bot, lang).slogan}
                  </p>

                  {/* Short description */}
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mb-5">
                    {botText(bot, lang).shortDesc}
                  </p>

                  {/* Quick action jump chips */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {bot.videoUrl && (
                      <a
                        href="#bot-video"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-xs font-bold text-red-600 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400 hover:scale-105 transition-all shadow-sm"
                      >
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        {c("botDetail", "chipWatchVideo", "Смотреть видеообзор")}
                      </a>
                    )}
                    <a
                      href="#bot-backtests"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 hover:scale-105 transition-all shadow-sm"
                    >
                      <span>📊</span>
                      {c("botDetail", "chipBacktests", "Бэктесты и динамика")}
                    </a>
                    <a
                      href={contacts.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300 hover:scale-105 transition-all shadow-sm"
                    >
                      <Send size={12} />
                      {c("botDetail", "chipAskQuestion", "Задать вопрос")}
                    </a>
                  </div>

                  {/* Primary CTA button */}
                  <a
                    href={contacts.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl active:scale-100"
                    style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)` }}
                  >
                    <Send size={16} />
                    {c("botDetail", "contactCta", t("botDetail.contactCta"))}
                  </a>
                </div>

                {/* RIGHT — performance results card */}
                <div className="lg:col-span-2">
                  <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-lg dark:border-white/10 dark:bg-white/[0.04] p-5 sm:p-6">
                    {/* Card header */}
                    <div className="flex items-center gap-2 mb-5">
                      <TrendingUp size={16} className="text-emerald-500 shrink-0" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {c("botDetail", "income", t("botDetail.income"))}
                      </span>
                      <Info size={13} className="text-slate-400 dark:text-slate-500 ml-auto shrink-0 cursor-help" title="Результаты на основе бэктестов и реальной торговли" />
                    </div>

                    {/* Returns — large bold numbers side by side */}
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {botText(bot, lang).returns.map((r, ri) => (
                        <div
                          key={ri}
                          className="flex flex-col items-center rounded-xl bg-slate-50 dark:bg-white/[0.05] border border-slate-100 dark:border-white/[0.07] px-2 py-3 text-center"
                        >
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 mb-1 leading-none">{r.period}</span>
                          <span
                            className="text-xl sm:text-2xl font-extrabold tabular-nums leading-tight"
                            style={{ color: accentColor }}
                          >
                            {r.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Mini decorative chart line (SVG) */}
                    <div className="mb-4 overflow-hidden rounded-lg opacity-60">
                      <svg viewBox="0 0 200 48" className="w-full h-10" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id={`chartFill_${bot.slug}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 44 C20 42 30 36 50 30 S80 18 100 14 S140 8 160 6 S185 4 200 2 L200 48 L0 48 Z"
                          fill={`url(#chartFill_${bot.slug})`}
                        />
                        <path
                          d="M0 44 C20 42 30 36 50 30 S80 18 100 14 S140 8 160 6 S185 4 200 2"
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Backtest link */}
                    <a
                      href="#bot-backtests"
                      className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold rounded-xl py-2 mb-4 transition-all"
                      style={{ color: accentColor, background: colorDimFrom(bot.color) }}
                    >
                      <span>📊</span> {c("botDetail", "chipBacktests", "Бэктесты и динамика")} →
                    </a>

                    {/* Disclaimer */}
                    <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                      {c("botDetail", "disclaimer", t("trust.disclaimer"))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════
              PAGE BODY
          ═══════════════════════════════════════════════ */}
          <main id="main" className="pb-16 sm:pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Bot banner image — full width */}
              {bot.imageUrl && (
                <div className="mt-8 mb-8 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-soft">
                  <img
                    src={bot.imageUrl}
                    alt={botText(bot, lang).name}
                    className="w-full h-auto object-cover max-h-[420px]"
                    loading="eager"
                  />
                </div>
              )}

              {/* Key features + pairs + risk + safety — inline after banner */}
              <div className="grid sm:grid-cols-2 gap-5 mb-10">
                {/* Features list */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                    {c("botDetail", "features", t("botDetail.features"))}
                  </h3>
                  <ul className="space-y-2.5">
                    {botText(bot, lang).features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                        <Check size={15} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                        <span className="min-w-0">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pairs + Risk + Safety stacked */}
                <div className="flex flex-col gap-4">
                  {/* Pairs */}
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm">
                    <div className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider font-semibold">
                      {c("botDetail", "pairs", t("botDetail.pairs"))}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                      {botText(bot, lang).pairs}
                    </p>
                  </div>

                  {/* Risk */}
                  <div className="rounded-2xl border border-amber-100 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 p-5 shadow-sm flex gap-3">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-500" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        {c("botDetail", "risks", t("botDetail.risks"))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {botText(bot, lang).risk}
                      </p>
                    </div>
                  </div>

                  {/* Safety */}
                  <div className="rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 p-5 shadow-sm flex gap-3">
                    <ShieldCheck size={16} className="shrink-0 mt-0.5 text-emerald-500" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        {c("botDetail", "safetyTitle", t("botDetail.safetyTitle"))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {c("botDetail", "safety", t("botDetail.safety"))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About / Full description */}
              <div className="bg-white dark:bg-slate-900/60 rounded-2xl p-5 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
                <h3 className="heading-md text-slate-900 dark:text-white mb-4">{c("botDetail", "about", t("botDetail.about"))}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">{botText(bot, lang).fullDesc}</p>
              </div>

              {/* How it works steps */}
              {botText(bot, lang).howItWorks.length > 0 && (
                <div className="mb-8">
                  <h3 className="heading-md text-slate-900 dark:text-white mb-6">{c("botDetail", "howEarn", t("botDetail.howEarn"))}</h3>
                  <BotStrategySteps bot={bot} />
                </div>
              )}

              <BotTradeExample bot={bot} />

              {/* Video Review Block */}
              <BotVideo bot={bot} />

              {/* Interactive Backtests & Dynamic Equity Curve */}
              <BotBacktest bot={bot} />

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-16">
                <a
                  href={contacts.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Send size={18} />
                  {c("botDetail", "contactCta", t("botDetail.contactCta"))}
                </a>
                <Link to="/#bots" className="btn-secondary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base w-full sm:w-auto">
                  <ArrowLeft size={16} /> {c("botDetail", "back", t("botDetail.back"))}
                </Link>
              </div>

              {/* Other bots (cards grid) */}
              <div className="mb-16">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{c("botDetail", "fits", t("botDetail.fits"))}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {bots
                    .filter((b) => b.slug !== bot.slug)
                    .map((b) => (
                      <BotCard key={b.slug} bot={b} compact />
                    ))}
                </div>
              </div>

              {/* Calculator */}
              <div className="mb-16 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <Calculator initialSlug={bot.slug} ctaTarget="#main" />
              </div>

              {/* Compare */}
              <div className="mb-16">
                <Compare />
              </div>

              {/* FAQ */}
              <div className="rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <FAQ />
              </div>

              {/* Others list */}
              <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{c("botDetail", "others", t("botDetail.others"))}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {bots
                    .filter((b) => b.slug !== bot.slug)
                    .map((b) => (
                      <Link
                        key={b.slug}
                        to={`/bots/${b.slug}`}
                        className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm card-hover flex items-center gap-4"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0"
                          style={{ background: colorDimFrom(b.color), color: b.color === "#00FFB2" ? "#00c98d" : b.color }}
                        >
                          {botText(b, lang).name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white text-sm">{botText(b, lang).name}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">{botText(b, lang).badge}</div>
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
