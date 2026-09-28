import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function Calculator() {
  const { t } = useI18n();
  const [deposit, setDeposit] = useState(1000);
  const [term, setTerm] = useState(6);
  const [botIdx, setBotIdx] = useState(0);

  const botReturns = [0.712, 0.964, 1.182]; // Annual returns for 3 bots
  const annualRate = botReturns[botIdx];
  const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1;
  const finalAmount = deposit * Math.pow(1 + monthlyRate, term);
  const profit = finalAmount - deposit;

  return (
    <section id="calculator" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="heading-lg text-gray-900 dark:text-white mb-4">{t("calculator.title")}</h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-500 font-normal">{t("calculator.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center bg-white dark:bg-gray-950 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl card-premium">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("calculator.deposit")}</label>
                <span className="text-lg font-bold text-brand-blue">${deposit}</span>
              </div>
              <input 
                type="range" min="100" max="10000" step="100" value={deposit} 
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
            </div>
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("calculator.term")}</label>
                <span className="text-lg font-bold text-brand-blue">{term}</span>
              </div>
              <input 
                type="range" min="1" max="12" step="1" value={term} 
                onChange={(e) => setTerm(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-4">{t("calculator.bot")}</label>
              <div className="grid grid-cols-3 gap-2">
                {["CryptoSuperStock", "MEGAGRID", "SMARTIX"].map((name, i) => (
                  <button
                    key={name}
                    onClick={() => setBotIdx(i)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      botIdx === i 
                      ? "bg-brand-blue text-white border-brand-blue" 
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-blue"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 text-center border border-blue-100 dark:border-blue-800">
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">{t("calculator.result")}</div>
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              ${Math.round(finalAmount).toLocaleString()}
            </div>
            <div className="space-y-2 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t("calculator.profit")}:</span>
                <span className="text-green-600 dark:text-green-400 font-bold">+${Math.round(profit).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t("calculator.total")}:</span>
                <span className="text-gray-900 dark:text-white font-bold">${Math.round(finalAmount).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 italic mb-6">{t("calculator.note")}</p>
            <button onClick={() => window.location.href = "#bots"} className="btn-primary w-full py-3 text-sm">
              {t("calculator.cta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


