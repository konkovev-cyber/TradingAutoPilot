import { motion, useReducedMotion } from "framer-motion";
import { Activity, Bot, BrainCircuit, Globe2, ShieldCheck, Sparkles, Zap } from "lucide-react";

const orbitItems = [
  { label: "20+ бирж", value: "Подключено", icon: Globe2, color: "#60A5FA", position: "left-3 top-[24%]" },
  { label: "AI ENGINE", value: "Активен", icon: BrainCircuit, color: "#C084FC", position: "right-3 top-[18%]" },
  { label: "RISK GUARD", value: "Защищено", icon: ShieldCheck, color: "#34D399", position: "right-8 bottom-[17%]" },
  { label: "24 / 7", value: "Мониторинг", icon: Activity, color: "#FBBF24", position: "left-8 bottom-[14%]" },
] as const;

const bars = [38, 54, 46, 72, 61, 84, 68, 92, 78, 100, 88, 96];

export function TradingTerminal() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
      className="relative w-full"
    >
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[48px] blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(16,185,129,0.24), transparent 45%), radial-gradient(circle at 82% 82%, rgba(99,102,241,0.18), transparent 42%)",
        }}
      />

      <div className="relative flex h-[min(44vh,382px)] min-h-[310px] min-w-0 flex-col overflow-hidden rounded-[30px] border border-white/[0.12] bg-[#09111B] shadow-[0_36px_100px_-30px_rgba(2,8,20,0.9)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, rgba(16,185,129,0.13), transparent 27%), radial-gradient(circle at 8% 100%, rgba(37,99,235,0.14), transparent 38%), linear-gradient(135deg, rgba(255,255,255,0.05), transparent 32%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent" />

        <header className="relative z-10 flex h-[62px] shrink-0 items-center justify-between border-b border-white/[0.08] px-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 text-emerald-300">
              <Bot size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">Coinsofter AI</div>
              <div className="text-[10px] text-slate-500">Autopilot command center</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <motion.span
                animate={reduceMotion ? undefined : { scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-emerald-300"
              />
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </span>
            LIVE SYSTEM
          </div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[246px] w-[246px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/10" />
          <motion.div
            aria-hidden="true"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-300/25"
          >
            <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_16px_5px_rgba(52,211,153,0.45)]" />
          </motion.div>
          <motion.div
            aria-hidden="true"
            animate={reduceMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[164px] w-[164px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-300/20"
          >
            <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-indigo-300 shadow-[0_0_14px_4px_rgba(165,180,252,0.4)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.35 }}
            className="absolute left-1/2 top-1/2 z-10 flex h-[132px] w-[132px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-emerald-200/30 bg-[radial-gradient(circle_at_38%_28%,rgba(52,211,153,0.35),rgba(9,17,27,0.96)_66%)] shadow-[0_0_70px_-12px_rgba(16,185,129,0.9)]"
          >
            <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-200">
              <Sparkles size={11} /> AI CORE
            </div>
            <div className="text-[29px] font-bold leading-none tracking-[-0.04em] text-white">+96.4%</div>
            <div className="mt-1 text-[10px] text-slate-400">за 12 месяцев</div>
          </motion.div>

          {orbitItems.map(({ label, value, icon: Icon, color, position }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.55 + index * 0.08 }}
              className={`absolute z-20 ${position}`}
            >
              <div className="flex min-w-[116px] items-center gap-2 rounded-xl border border-white/[0.1] bg-[#111C29]/90 px-2.5 py-2 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ color, backgroundColor: `${color}18` }}>
                  <Icon size={14} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[9px] font-bold tracking-[0.08em] text-slate-300">{label}</span>
                  <span className="block text-[10px] text-slate-500">{value}</span>
                </span>
              </div>
            </motion.div>
          ))}

          <div className="absolute bottom-3 left-1/2 z-10 flex w-[55%] -translate-x-1/2 items-end justify-center gap-1.5 opacity-80">
            {bars.map((height, index) => (
              <motion.span
                key={`${height}-${index}`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.7 + index * 0.035 }}
                className={`w-full rounded-t-sm ${index > 8 ? "bg-emerald-300/60" : "bg-emerald-300/20"}`}
                style={{ maxHeight: 26 }}
              />
            ))}
          </div>
        </div>

        <footer className="relative z-10 flex h-[48px] shrink-0 items-center justify-between border-t border-white/[0.08] px-5 sm:px-6">
          <div className="flex items-center gap-4 text-[10px] text-slate-500">
            <span><b className="text-white">24/7</b> мониторинг</span>
            <span className="hidden sm:inline"><b className="text-white">3</b> стратегии</span>
            <span className="hidden sm:inline"><b className="text-emerald-300">0.00s</b> задержка</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-300">
            <Zap size={12} /> Автопилот включён
          </div>
        </footer>
      </div>
    </motion.div>
  );
}

export default TradingTerminal;