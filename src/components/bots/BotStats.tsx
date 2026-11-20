import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { botText, type BotData } from "@/data/bots";

export default function BotStats({ bot }: { bot: BotData }) {
  const { t, lang } = useI18n();
  const c = useContent();
  const b = botText(bot, lang);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all dark:border-slate-800/80 dark:bg-[#131b2e]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {c("botDetail", "income", t("botDetail.income"))}
        </h3>
        <a
          href="#bot-backtests"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors inline-flex items-center gap-1"
        >
          График и бэктесты →
        </a>
      </div>
      <div className="space-y-3">
        {b.returns.map((r, ri) => (
          <div
            key={ri}
            className="flex items-center justify-between rounded-xl bg-slate-50/90 px-4 py-3 border border-slate-100/90 transition-all hover:border-emerald-300/40 dark:border-slate-800 dark:bg-[#1a243c]"
          >
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{r.period}</span>
            <span className="text-xl font-extrabold tabular-nums" style={{ color: b.color === "#00FFB2" ? "#00c98d" : b.color }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-400 dark:border-slate-800/80 dark:text-slate-400">
        {c("botDetail", "disclaimer", t("trust.disclaimer"))}
      </p>
    </div>
  );
}
