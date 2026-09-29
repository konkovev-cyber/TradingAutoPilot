import { motion } from "framer-motion";
import { Globe, CreditCard, ShieldCheck, BarChart3, type LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  BingxIcon,
  BinanceIcon,
  BitfinexIcon,
  BitgetIcon,
  BybitIcon,
  CoinbaseIcon,
  GateIcon,
  HtxIcon,
  KrakenIcon,
  KucoinIcon,
  MexcIcon,
  OkxIcon,
  WhitebitIcon,
} from "./ExchangeIcons";

const icons: LucideIcon[] = [Globe, CreditCard, ShieldCheck, BarChart3];

const exchangeLogos = [
  { name: "BYBIT", Icon: BybitIcon },
  { name: "Binance", Icon: BinanceIcon },
  { name: "OKX", Icon: OkxIcon },
  { name: "BingX", Icon: BingxIcon },
  { name: "Gate.io", Icon: GateIcon },
  { name: "HTX", Icon: HtxIcon },
  { name: "Bitget", Icon: BitgetIcon },
  { name: "KuCoin", Icon: KucoinIcon },
  { name: "MEXC", Icon: MexcIcon },
  { name: "Bitfinex", Icon: BitfinexIcon },
  { name: "Kraken", Icon: KrakenIcon },
  { name: "Coinbase", Icon: CoinbaseIcon },
  { name: "WhiteBIT", Icon: WhitebitIcon },
];

export default function Trust() {
  const { t } = useI18n();
  const points = t("trust.points") as { title: string; desc: string }[];

  return (
    <section className="bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {points.map((p, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3.5 rounded-xl border border-white/60 bg-white/70 px-5 py-4 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/40 hover:shadow-[0_16px_40px_-14px_rgba(16,185,129,0.25)] dark:border-white/[0.08] dark:bg-white/[0.06]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#10B981]/20 text-[#10B981]"
                  style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.1))" }}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">{p.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{p.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-4 flex flex-col gap-4 rounded-xl border border-white/60 bg-white/70 px-5 py-4 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.06] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3.5">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#10B981]/20 text-[#10B981]"
              style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.1))" }}
            >
              <Globe size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">
                {t("trust.connectedTitle")}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                {t("trust.connectedNote")}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {exchangeLogos.map(({ name, Icon }) => (
              <span
                key={name}
                title={name}
                aria-label={name}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200/70 bg-white/80 text-gray-400 transition-colors hover:border-emerald-300/50 hover:text-emerald-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-gray-500 dark:hover:text-emerald-400"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </motion.div>

        <p className="mt-3 text-center text-[10px] leading-relaxed text-gray-400 dark:text-gray-500">
          {t("trust.disclaimer")}
        </p>
      </div>
    </section>
  );
}