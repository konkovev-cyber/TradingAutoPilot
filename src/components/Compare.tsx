import { useBots } from "@/lib/use-bots";
import type { BotData } from "@/data/bots";
import { useI18n } from "@/lib/i18n";

export default function Compare() {
  const { t } = useI18n();
  const bots = useBots();

  const rows: { id: string; label: string; get: (b: BotData) => string }[] = [
    { id: "market", label: t("compare.market"), get: (b) => b.market },
    { id: "strategy", label: t("compare.strategy"), get: (b) => b.strategy },
    { id: "risk", label: t("compare.risk"), get: (b) => b.risk },
    { id: "income", label: t("compare.income"), get: (b) => b.returns[2]?.value ?? "" },
    { id: "pairs", label: t("compare.pairs"), get: (b) => b.pairs },
  ];

  return (
    <section id="compare" className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="heading-lg text-gray-900 dark:text-white mb-4">{t("compare.title")}</h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-500 font-normal">{t("compare.subtitle")}</p>
        </div>

        <div className="space-y-4 md:hidden">
          {bots.map((bot) => (
            <div
              key={bot.slug}
              className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06),0_14px_36px_-16px_rgba(15,23,42,0.22)] ring-1 ring-gray-900/[0.06] dark:border-gray-600 dark:bg-gray-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.45),0_18px_44px_-18px_rgba(0,0,0,0.7)] dark:ring-white/[0.08]"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${bot.color}, transparent)` }} />
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-3 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/60">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: bot.color, boxShadow: `0 0 8px ${bot.color}` }} />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{bot.name}</span>
              </div>
              <dl className="divide-y divide-gray-100 dark:divide-gray-700">
                {rows.map((row) => (
                  <div key={row.id} className="grid grid-cols-[38%_1fr] gap-2 px-4 py-2.5">
                    <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">{row.label}</dt>
                    <dd className="text-xs leading-snug text-gray-800 dark:text-gray-200">{row.get(bot)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="relative hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06),0_18px_50px_-14px_rgba(15,23,42,0.22)] ring-1 ring-gray-900/[0.06] dark:border-gray-600 dark:bg-gray-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.45),0_22px_60px_-16px_rgba(0,0,0,0.7)] dark:ring-white/[0.08] md:block">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent" />
          <table className="w-full table-fixed border-collapse bg-white dark:bg-gray-900">
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/60">
              <tr>
                <th className="w-[16%] p-4 text-left text-sm font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-600 lg:p-6">
                  {t("calculator.bot")}
                </th>
                {bots.map((bot) => (
                  <th
                    key={bot.slug}
                    className="p-4 text-center text-sm font-bold text-gray-900 dark:text-white border-b-2 border-l border-gray-200 dark:border-gray-600 lg:p-6"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: bot.color, boxShadow: `0 0 8px ${bot.color}` }} />
                      {bot.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors last:border-0 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/20">
                  <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50/70 dark:bg-gray-800/60 lg:p-6">
                    {row.label}
                  </td>
                  {bots.map((bot) => (
                    <td key={bot.slug} className="p-4 text-center text-sm leading-snug text-gray-700 dark:text-gray-200 border-l border-gray-100 dark:border-gray-700 lg:p-6">
                      {row.get(bot)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}