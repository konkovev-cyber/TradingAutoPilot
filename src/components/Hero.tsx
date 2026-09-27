import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Globe, Zap, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

const chartData = [
  100, 102, 99, 105, 103, 108, 112, 109, 115, 118, 114, 120, 125, 122, 128, 132,
  130, 138, 142, 139, 145, 150, 148, 155, 160, 158, 165, 170, 168, 175, 180, 178,
  185, 190, 188, 195, 192, 198, 205, 210, 208, 215, 220, 218, 225, 230, 228, 235,
];

function CountUp({ value, className, suffix, prefix }: { value: string; className?: string; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!m) return;
    const [, pre, numStr, suf] = m;
    const dec = /[.,]/.test(numStr) ? numStr.split(/[.,]/)[1].length : 0;
    const target = parseFloat(numStr.replace(",", "."));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 1200);
          const eased = 1 - Math.pow(1 - p, 3);
          setText((prefix ?? pre) + (target * eased).toFixed(dec) + (suffix ?? suf));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}

/*
 * Чистая кривая роста  без сетки и осей.
 * Под ней градиентная заливка. Одна ключевая точка снизу.
 */
function CleanChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const startedRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      if (canvas.width !== Math.round(rect.width * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const w = rect.width;
      const h = rect.height;
      const pad = { top: 12, bottom: 12, left: 8, right: 8 };
      const cw = w - pad.left - pad.right;
      const ch = h - pad.top - pad.bottom;

      const minV = Math.min(...chartData) - 8;
      const maxV = Math.max(...chartData) + 8;
      const toX = (i: number) => pad.left + (i / (chartData.length - 1)) * cw;
      const toY = (v: number) => pad.top + ch - ((v - minV) / (maxV - minV)) * ch;

      const prog = progressRef.current;
      const count = Math.max(2, Math.floor(chartData.length * prog));
      const slice = chartData.slice(0, count);

      // градиентная заливка под кривой
      const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
      grad.addColorStop(0, "rgba(37, 99, 235, 0.18)");
      grad.addColorStop(1, "rgba(37, 99, 235, 0)");

      const strokePath = () => {
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(slice[0]));
        for (let i = 1; i < slice.length; i++) {
          const xc = (toX(i) + toX(i - 1)) / 2;
          const yc = (toY(slice[i]) + toY(slice[i - 1])) / 2;
          ctx.quadraticCurveTo(toX(i - 1), toY(slice[i - 1]), xc, yc);
        }
        if (slice.length > 1) {
          const lastX = toX(slice.length - 1);
          const lastY = toY(slice[slice.length - 1]);
          ctx.quadraticCurveTo(lastX, lastY, lastX, lastY);
        }
      };

      // заливка
      strokePath();
      ctx.lineTo(toX(slice.length - 1), h - pad.bottom);
      ctx.lineTo(toX(0), h - pad.bottom);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // линия
      strokePath();
      ctx.strokeStyle = "#2563EB";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // живая точка на конце
      if (prog >= 1 && slice.length > 0) {
        const lastX = toX(slice.length - 1);
        const lastY = toY(slice[slice.length - 1]);
        const pulse = (Math.sin(performance.now() / 500) + 1) / 2;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, " + (0.3 - pulse * 0.2).toFixed(2) + ")";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#2563EB";
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      if (startedRef.current && progressRef.current < 1) progressRef.current = Math.min(1, progressRef.current + 0.012);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) startedRef.current = true;
      },
      { threshold: 0.3 }
    );
    io.observe(canvas);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-[200px] block" />;
}

const statIcons = [TrendingUp, ShieldCheck, Globe, Zap];


function StatCard({ icon: Icon, value, label }: { icon: typeof TrendingUp; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center px-2">
      <Icon size={20} className="text-[#2563EB]" strokeWidth={2} />
      <CountUp value={value} className="text-[22px] md:text-2xl font-bold text-[#0A0A0A] dark:text-white leading-tight tabular-nums" />
      <div className="text-xs text-[#8A8F99] dark:text-[#8a919e] leading-snug">{label}</div>
    </div>
  );
}

export default function Hero() {
  const { t } = useI18n();
  const c = useContent();
  const stats: { value: string; label: string }[] = t("hero.stats");

  return (
    <section className="relative bg-[#F7F8FA] dark:bg-[#0A0B0E] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-20 pb-20 w-full">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Левая колонка: текст */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-[#15171C] border border-black/10 dark:border-white/10 shadow-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#00B96B]" />
              <span className="text-[13px] font-medium text-[#5A5F6B]">{c("hero", "badge", t("hero.badge"))}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[36px] sm:text-[44px] lg:text-[56px] xl:text-[60px] font-extrabold text-[#0A0A0A] dark:text-white leading-[1.08] tracking-tight mb-5"
            >
              {c("hero", "title1", t("hero.title1"))}
              <br />
              {c("hero", "title2", t("hero.title2"))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[17px] md:text-lg text-[#5A5F6B] dark:text-[#9aa1ad] font-normal max-w-[520px] leading-relaxed mb-8"
            >
              {c("hero", "subtitle", t("hero.subtitle"))}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <a
                href="#bots"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#2563EB] text-white font-semibold text-[15px] rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
              >
                {c("hero", "pick", t("hero.pick"))}
                <ChevronRight size={16} strokeWidth={2.5} />
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center h-12 px-6 text-[#0A0A0A] dark:text-gray-200 font-medium text-[15px] rounded-[10px] border border-black/10 dark:border-white/15 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
              >
                {c("hero", "cta2", t("hero.cta2"))}
              </a>
            </motion.div>

            {/* Панель метрик — 4 равные ячейки */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-[#15171C] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] px-4 sm:px-6 py-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black/5 dark:divide-white/10">
                {stats.map((s, i) => {
                  const Icon = statIcons[i] || TrendingUp;
                  return (
                    <div key={i} className="px-2 py-4 sm:py-0 first:pl-0 last:pr-0">
                      <StatCard icon={Icon} value={s.value} label={s.label} />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Правая колонка: карточка доходности */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-[#15171C] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[13px] text-[#8A8F99] dark:text-[#8a919e]">{t("hero.chart.portfolio")}</div>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-lg font-bold text-[#00B96B] bg-[rgba(0,185,107,0.1)]">
                {stats[0]?.value ?? "+96.4%"}
              </span>
            </div>

            <CleanChart />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5 dark:border-white/10">
              <div className="text-xs text-[#8A8F99]">{t("hero.chart.drawdown")}</div>
              <div className="text-xs font-semibold text-[#5A5F6B] dark:text-[#c3c9d4]">4.1%</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}



