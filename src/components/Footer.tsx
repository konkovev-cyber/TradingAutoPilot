import { Link } from "react-router-dom";
import { bots } from "@/data/bots";
import { useI18n } from "@/lib/i18n";

const exchanges = ["BYBIT", "Binance", "OKX", "BingX", "Gate.io", "HTX", "Bitget", "KuCoin", "Bitfinex", "Kraken", "MEXC", "Coinbase", "WhiteBIT"];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="py-16 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Coinsofter</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t("footer.desc")}</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">{t("footer.robots")}</h4>
            <ul className="space-y-2">
              {bots.map((b) => (
                <li key={b.slug}>
                  <Link to={`/bots/${b.slug}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">{t("footer.support")}</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#faq" className="hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</a></li>
              <li><a href="https://t.me/coinsofter" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">Telegram</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t("footer.knowledge") || "Knowledge base"}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">{t("footer.exchanges")}</h4>
            <div className="flex flex-wrap gap-1.5">
              {exchanges.map((e) => (
                <span key={e} className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-md border border-gray-100 dark:border-gray-700">
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">{t("footer.copyright")}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xl sm:text-right">{t("footer.risk")}</p>
        </div>
      </div>
    </footer>
  );
}
