import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { botText, type BotData } from "@/data/bots";

export default function BotTradeExample({ bot }: { bot: BotData }) {
  const { t, lang } = useI18n();
  const c = useContent();
  const b = botText(bot, lang);

  if (b.exampleTrade.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-6 md:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h3 className="heading-md text-gray-900 dark:text-white">{c("botDetail", "exampleTitle", t("botDetail.exampleTitle"))}</h3>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{c("botDetail", "exampleNote", t("botDetail.exampleNote"))}</p>
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
        <span>{c("botDetail", "examplePrinciple", t("botDetail.examplePrinciple"))}</span>
      </div>
    </div>
  );
}
