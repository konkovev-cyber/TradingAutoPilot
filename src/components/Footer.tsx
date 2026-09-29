import { Link } from "react-router-dom";
import { useBots } from "@/lib/use-bots";
import { useI18n } from "@/lib/i18n";
import { botText } from "@/data/bots";
import {
  BybitIcon,
  BinanceIcon,
  OkxIcon,
} from "./ExchangeIcons";

const mainExchanges = [
  { name: "BYBIT", Icon: BybitIcon },
  { name: "Binance", Icon: BinanceIcon },
  { name: "OKX", Icon: OkxIcon },
];

export default function Footer() {
  const { t, lang } = useI18n();
  const bots = useBots();

  return (
    <footer className="py-16 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <img src="/logo.png" alt="Trading Auto Pilot" className="h-11 w-auto" />
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t("footer.desc")}</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">{t("footer.robots")}</h4>
            <ul className="space-y-2">
              {bots.map((b) => (
                <li key={b.slug}>
                  <Link to={`/bots/${b.slug}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {botText(b, lang).name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">{t("footer.support")}</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="https://t.me/coinsofter" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">Telegram</a></li>
              <li><Link to="/#bots" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t("footer.robots")}</Link></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t("footer.knowledge") || "Knowledge base"}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">{t("footer.exchanges")}</h4>
            <div className="flex flex-wrap gap-1.5">
              {mainExchanges.map(({ name, Icon }) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-md border border-gray-100 dark:border-gray-700 transition-colors hover:text-gray-900 dark:hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {name}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500">и ещё 8 бирж — всего 20+ площадок</p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">{t("footer.copyright")}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xl sm:text-right whitespace-pre-line">{t("footer.risk")}</p>
        </div>
      </div>
    </footer>
  );
}