import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBots } from "@/lib/use-bots";
import { botText } from "@/data/bots";
import { BotAvatar, BotBadges, BotReturns } from "./BotCard";

export default function BotSwitcher() {
  const { t, lang } = useI18n();
  const bots = useBots();
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = bots.length > 0 ? bots[Math.min(active, bots.length - 1)] : null;
  const b = current ? botText(current, lang) : null;

  const select = (i: number) => {
    setActive(i);
    panelRef.current?.scrollTo({ top: 0 });
  };

  if (!current || !b) return null;

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("switcher.label")}
        className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-2"
      >
        {bots.map((bot, i) => {
          const name = botText(bot, lang).name;
          const selected = active === i;
          return (
            <button
              key={bot.slug}
              role="tab"
              aria-selected={selected}
              aria-controls={`bot-panel-${bot.slug}`}
              id={`bot-tab-${bot.slug}`}
              onClick={() => select(i)}
              className="flex min-w-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all"
              style={
                selected
                  ? { background: bot.colorDim, borderColor: bot.color, color: bot.color === "#00FFB2" ? "#00c98d" : bot.color }
                  : { background: "transparent", borderColor: "rgba(0,0,0,0.08)", color: "inherit" }
              }
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: bot.color }} />
              <span className="truncate">{name}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={panelRef}
        role="tabpanel"
        id={`bot-panel-${current.slug}`}
        aria-labelledby={`bot-tab-${current.slug}`}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-soft sm:p-10 dark:border-gray-800 dark:bg-gray-900"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${current.color}, transparent)` }} />
        <div className="flex items-center gap-4">
          <BotAvatar bot={current} size={56} />
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{b.name}</h3>
            <div className="mt-1">
              <BotBadges bot={current} />
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm font-medium text-gray-700 dark:text-gray-300">{b.slogan}</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{b.shortDesc}</p>

        <div className="mt-6">
          <BotReturns bot={current} />
        </div>

        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {b.features.slice(0, 6).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
              <Check size={16} className="mt-0.5 shrink-0" style={{ color: current.color === "#00FFB2" ? "#00c98d" : current.color }} />
              <span className="min-w-0">{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to={`/bots/${current.slug}`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-blue px-8 font-semibold text-white transition-all hover:bg-blue-700"
          >
            {t("products.detail")}
            <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-gray-400 dark:text-gray-500">{t("products.switcherHint")}</p>
        </div>
      </div>
    </div>
  );
}
