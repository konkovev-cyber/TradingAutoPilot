import { Link } from "react-router-dom";
import { ArrowRight, Check, TrendingUp, Gauge, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { BotData } from "@/data/bots";

const iconMap: Record<string, LucideIcon> = {
  cryptosuperstock: Gauge,
  "megagrid-ai": TrendingUp,
  smartix: TrendingUp,
};

function difficultyStyle(tone?: string) {
  if (tone === "starter") return { background: "rgba(16,185,129,0.10)", borderColor: "rgba(16,185,129,0.32)", color: "#059669" };
  if (tone === "advanced") return { background: "rgba(245,158,11,0.10)", borderColor: "rgba(245,158,11,0.32)", color: "#B45309" };
  return { background: "rgba(244,63,94,0.10)", borderColor: "rgba(244,63,94,0.32)", color: "#E11D48" };
}

export function BotAvatar({ bot, size = 48 }: { bot: BotData; size?: number }) {
  const Icon = iconMap[bot.slug] || TrendingUp;
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${bot.colorDim}, transparent)` }}
    >
      {bot.imageUrl ? (
        <img src={bot.imageUrl} alt={bot.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      ) : (
        <Icon size={Math.round(size * 0.5)} style={{ color: bot.color }} />
      )}
    </div>
  );
}

export function BotBadges({ bot }: { bot: BotData }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <span
        className="inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
        style={{ background: bot.colorDim, color: bot.color === "#00FFB2" ? "#00c98d" : bot.color }}
      >
        {bot.badge}
      </span>
      {bot.difficulty && (
        <span
          className="inline-block rounded-md border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={difficultyStyle(bot.difficultyTone)}
        >
          {bot.difficulty}
        </span>
      )}
    </div>
  );
}

export function BotReturns({ bot }: { bot: BotData }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {bot.returns.map((r, ri) => (
        <div key={ri} className="rounded-lg border px-2 py-2.5 text-center" style={{ background: "rgba(0,255,150,0.08)", borderColor: "rgba(0,255,150,0.18)" }}>
          <div className="text-[13px] font-bold leading-tight tabular-nums text-emerald-500">
            {r.value}
            <span className="text-emerald-500/60">*</span>
          </div>
          <div className="mt-0.5 text-[10px] leading-tight text-gray-500 dark:text-gray-400">{r.period}</div>
        </div>
      ))}
    </div>
  );
}

export default function BotCard({ bot, compact = false }: { bot: BotData; compact?: boolean }) {
  const { t } = useI18n();
  const b = bot;

  if (compact) {
    return (
      <Link
        to={`/bots/${bot.slug}`}
        className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-soft transition-all card-hover dark:border-gray-800 dark:bg-gray-900"
      >
        <BotAvatar bot={b} size={44} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">{b.name}</div>
          <div className="truncate text-xs text-gray-400 dark:text-gray-500">{b.badge}</div>
        </div>
        <ArrowRight size={16} className="ml-auto shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 dark:text-gray-600" />
      </Link>
    );
  }

  return (
    <div className="group relative flex min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-soft card-premium transition-colors sm:p-7 dark:border-gray-800 dark:bg-gray-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${bot.color}, transparent)` }} />
      <div className="mb-4">
        <BotBadges bot={b} />
      </div>

      <div className="mb-5 flex items-center gap-4">
        <BotAvatar bot={b} />
        <h3 className="min-w-0 truncate text-xl font-bold leading-tight text-gray-900 dark:text-white md:text-[22px]">{b.name}</h3>
      </div>

      <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{b.slogan}</p>
      <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{b.shortDesc}</p>

      <ul className="mb-8 flex-grow space-y-3">
        {b.features.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <Check size={16} className="mt-0.5 shrink-0" style={{ color: bot.color }} />
            <span className="min-w-0">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mb-6">
        <BotReturns bot={b} />
      </div>

      <Link
        to={`/bots/${bot.slug}`}
        className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-blue text-center font-semibold text-white transition-all hover:bg-blue-700"
      >
        {t("products.detail")}
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
