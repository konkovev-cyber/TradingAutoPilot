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

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06),0_18px_50px_-14px_rgba(15,23,42,0.22)] ring-1 ring-gray-900/[0.06] dark:border-gray-600 dark:bg-gray-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.45),0_22px_60px_-16px_rgba(0,0,0,0.7)] dark:ring-white/[0.08]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent" />
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse bg-white dark:bg-gray-900">
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/60">
              <tr>
                <th className="p-6 text-left text-sm font-bold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-600">
                  {t("calculator.bot")}
                </th>
                {bots.map((bot) => (
                  <th
                    key={bot.slug}
                    className="p-6 text-center text-sm font-bold text-gray-900 dark:text-white border-b-2 border-l border-gray-200 dark:border-gray-600"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: bot.color, boxShadow: `0 0 8px ${bot.color}` }} />
                      {bot.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors last:border-0 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/20">
                  <td className="p-6 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50/70 dark:bg-gray-800/60 whitespace-nowrap border-l-0">
                    {row.label}
                  </td>
                  {bots.map((bot) => (
                    <td key={bot.slug} className="p-6 text-center text-sm text-gray-700 dark:text-gray-200 border-l border-gray-100 dark:border-gray-700">
                      {row.get(bot)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </section>
  );
}

