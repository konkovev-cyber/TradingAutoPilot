import { useI18n } from "@/lib/i18n";
import { botText, type BotData } from "@/data/bots";

export default function BotStats({ bot }: { bot: BotData }) {
  const { t, lang } = useI18n();
  const b = botText(bot, lang);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">{t("botDetail.income")}</h3>
      <div className="space-y-3">
        {b.returns.map((r, ri) => (
          <div key={ri} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">{r.period}</span>
            <span className="text-lg font-bold tabular-nums" style={{ color: b.color === "#00FFB2" ? "#00c98d" : b.color }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-gray-100 pt-3 text-[11px] leading-relaxed text-gray-400 dark:border-gray-800 dark:text-gray-500">
        {t("botDetail.disclaimer")}
      </p>
    </div>
  );
}
