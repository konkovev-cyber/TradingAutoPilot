import { bots, type BotData } from "@/data/bots";
import { useI18n } from "@/lib/i18n";

export default function Compare() {
  const { t } = useI18n();

  const rows: { id: string; label: string; get: (b: BotData) => string }[] = [
    { id: "market", label: t("compare.market"), get: (b) => b.market },
    { id: "strategy", label: t("compare.strategy"), get: (b) => b.strategy },
    { id: "risk", label: t("compare.risk"), get: (b) => b.risk },
    { id: "income", label: t("compare.income"), get: (b) => b.returns[2].value },
    { id: "pairs", label: t("compare.pairs"), get: (b) => b.pairs },
  ];

  return (
    <section id="compare" className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">{t("compare.title")}</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">{t("compare.subtitle")}</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft">
          <table className="w-full border-collapse bg-white dark:bg-gray-900">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="p-6 text-left text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">
                  {t("calculator.bot")}
                </th>
                {bots.map((bot) => (
                  <th
                    key={bot.slug}
                    className="p-6 text-center text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800"
                  >
                    {bot.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="p-6 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 whitespace-nowrap">
                    {row.label}
                  </td>
                  {bots.map((bot) => (
                    <td key={bot.slug} className="p-6 text-center text-sm text-gray-700 dark:text-gray-300">
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
