import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { botText, type BotData } from "@/data/bots";

export default function BotTradeExample({ bot }: { bot: BotData }) {
  const { t, lang } = useI18n();
  const b = botText(bot, lang);

  if (b.exampleTrade.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h3 className="heading-md text-gray-900 dark:text-white">{t("botDetail.exampleTitle")}</h3>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t("botDetail.exampleNote")}</p>
      </div>
      <ol className="relative space-y-5 border-l-2 pl-6" style={{ borderColor: bot.colorDim }}>
        {b.exampleTrade.map((s, i) => (
          <li key={i} className="relative">
            <span
              className="absolute -left-[31px] top-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: bot.color === "#00FFB2" ? "#00c98d" : bot.color }}
            >
              {i + 1}
            </span>
            <div className="font-semibold text-gray-900 dark:text-white">{s.title}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
        <ArrowRight size={14} />
        <span>{t("botDetail.examplePrinciple")}</span>
      </div>
    </div>
  );
}
