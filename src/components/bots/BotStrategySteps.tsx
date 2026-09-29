import { useI18n } from "@/lib/i18n";
import { botText, type BotData } from "@/data/bots";

export default function BotStrategySteps({ bot }: { bot: BotData }) {
  const { lang } = useI18n();
  const b = botText(bot, lang);

  if (b.howItWorks.length === 0) return null;

  return (
    <div className="space-y-4">
      {b.howItWorks.map((s, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm card-hover dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold"
            style={{ background: bot.colorDim, color: bot.color === "#00FFB2" ? "#00c98d" : bot.color }}
          >
            {i + 1}
          </div>
          <div className="min-w-0">
            <h4 className="mb-1 font-semibold text-gray-900 dark:text-white">{s.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
