import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Globe, Zap, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

const chartData = [
  100, 103, 101, 106, 104, 110, 107, 115, 112, 118, 114, 122, 118, 126, 123,
  131, 128, 135, 130, 138, 134, 142, 139, 145, 141, 148, 144, 152, 149, 155,
  150, 158, 153, 160, 156, 163, 158, 165, 160, 167, 162, 168, 163, 170, 165,
  172, 167, 174, 168, 175, 170, 177, 172, 178, 173, 179, 174, 180, 176, 182,
  178, 184, 180, 186, 182, 188, 184, 190, 185, 192, 188, 194, 189, 195, 190,
  196, 191, 197, 192, 198, 193, 199, 194, 200, 195, 201, 196, 202, 197, 203,
  198, 204, 199, 205
];

function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const match = value.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!match) return;
    const [, prefix, number, suffix] = match;
    const decimals = /[.,]/.test(number) ? number.split(/[.,]/)[1].length : 0;
    const target = parseFloat(number.replace(",", "."));
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const startedAt = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / 1000);
          const eased = 1 - Math.pow(1 - progress, 3);
          setText(prefix + (target * eased).toFixed(decimals) + suffix);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref} className={className}>{text}</span>;
}

const ExchangeLogo = ({ name, svg }: { name: string; svg: string }) => (
  <div className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#A0A5B0]">
      <path d={svg} fill="currentColor" />
    </svg>
    <span className="text-[10px] font-medium text-[#A0A5B0] tracking-wider">{name}</span>
  </div>
);

const binanceSvg = "M12 2L6 8l2 2 4-4 4 4 2-2-6-6zm-6 8l6 6 6-6-2-2-4 4-4-4-2 2zm12 8l-6-6-6 6 2 2 4-4 4 4 2-2z";
const bybitSvg = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z";
const okxSvg = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-3.5l-3-1.75V9.5l3 1.75V8l-4 2.5v5L7 15.5v3.5l5-3.5zm5-3.5l3 1.75v3.5l-3-1.75v-3.5zm-5-10l4 2.5v3.5l-4-2.5V3.5zm5 3.5l3 1.75v3.5l-3-1.75V7.5z";
const kucoinSvg = "M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5L18 8l-6 3.5L6 8l6-3.5zM6 9.5l6 3.5v7l-6-3.5v-7zm12 0v7l-6 3.5v-7l6-3.5z";

function CleanChart({ todayLabel }: { todayLabel: string }) {
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
      if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const width = rect.width;
      const height = rect.height;
      const padding = { top: 16, bottom: 28, left: 10, right: 10 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;
      const minValue = Math.min(...chartData) - 10;
      const maxValue = Math.max(...chartData) + 10;
      const toX = (index: number) => padding.left + (index / (chartData.length - 1)) * chartWidth;
      const toY = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
      const progress = progressRef.current;
      const pointCount = Math.max(2, Math.floor(chartData.length * progress));
      const visibleData = chartData.slice(0, pointCount);

      const drawPath = () => {
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(visibleData[0]));
        for (let index = 1; index < visibleData.length; index += 1) {
          const midpointX = (toX(index) + toX(index - 1)) / 2;
          const midpointY = (toY(visibleData[index]) + toY(visibleData[index - 1])) / 2;
          ctx.quadraticCurveTo(toX(index - 1), toY(visibleData[index - 1]), midpointX, midpointY);
        }
        if (visibleData.length > 1) {
          const last = visibleData.length - 1;
          ctx.quadraticCurveTo(toX(last), toY(visibleData[last]), toX(last), toY(visibleData[last]));
        }
      };

      const fill = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      fill.addColorStop(0, "rgba(37, 99, 235, 0.18)");
      fill.addColorStop(1, "rgba(37, 99, 235, 0)");
      drawPath();
      ctx.lineTo(toX(visibleData.length - 1), height - padding.bottom);
      ctx.lineTo(toX(0), height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();

      drawPath();
      ctx.strokeStyle = "#2563EB";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      if (progress >= 1) {
        const last = visibleData.length - 1;
        const lastX = toX(last);
        const lastY = toY(visibleData[last]);
        
        // Вертикальная пунктирная линия
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(lastX, padding.top);
        ctx.lineTo(lastX, height - padding.bottom);
        ctx.strokeStyle = "rgba(138, 143, 153, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Подпись "Сегодня"
        ctx.font = "11px Inter, sans-serif";
        ctx.fillStyle = "#A0A5B0";
        ctx.textAlign = "center";
        ctx.fillText(todayLabel, lastX, height - 6);
        ctx.restore();

        // Пульсирующий ореол
        const pulse = (Math.sin(performance.now() / 500) + 1) / 2;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 12 + pulse * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${(0.15 - pulse * 0.1).toFixed(2)})`;
        ctx.fill();
        
        // Белая обводка
        ctx.beginPath();
        ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = "#2563EB";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    };

    const loop = () => {
      if (startedRef.current && progressRef.current < 1) {
        progressRef.current = Math.min(1, progressRef.current + 0.012);
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) startedRef.current = true;
      },
      { threshold: 0.3 },
    );
    observer.observe(canvas);
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [todayLabel]);

  return <canvas ref={canvasRef} className="w-full h-[200px] block" aria-label={todayLabel} />;
}

const statIcons = [TrendingUp, ShieldCheck, Globe, Zap];

function StatCard({ icon: Icon, value, label }: { icon: typeof TrendingUp; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-left px-2 sm:px-4">
      <Icon size={22} className="text-[#2563EB] shrink-0" strokeWidth={2} />
      <div className="min-w-0">
        <CountUp value={value} className="block text-[22px] font-bold text-[#0A0A0A] dark:text-white leading-tight tabular-nums" />
        <div className="text-xs text-[#8A8F99] dark:text-[#8a919e] leading-snug mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ExchangeTrust() {
  return (
    <div className="mt-6 space-y-4">
      <div className="text-[11px] uppercase tracking-[0.08em] text-[#8A8F99] font-semibold mb-4">
        Работаем с ведущими биржами
      </div>
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <ExchangeLogo name="BINANCE" svg={binanceSvg} />
        <ExchangeLogo name="BYBIT" svg={bybitSvg} />
        <ExchangeLogo name="OKX" svg={okxSvg} />
        <ExchangeLogo name="KUCOIN" svg={kucoinSvg} />
      </div>
      
      {/* Live ticker */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ 
        background: "rgba(0,185,107,0.05)",
        border: "1px solid rgba(0,185,107,0.15)"
      }}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#00B96B] opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00B96B]" />
        </span>
        <span className="text-[13px] font-medium text-[#0A0A0A] dark:text-gray-200">BTC/USDT  LONG</span>
        <span className="ml-auto text-[15px] font-bold text-[#00B96B]">+2.4%</span>
        <span className="text-[11px] text-[#A0A5B0]">2 сек назад</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useI18n();
  const c = useContent();
  const stats: { value: string; label: string }[] = t("hero.stats");

  return (
    <section className="relative min-h-screen bg-[#F8F9FB] dark:bg-[#0A0B0E] overflow-hidden flex items-center">
      {/* Радиальный градиент за графиком */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_35%,rgba(37,99,235,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_80%_35%,rgba(37,99,235,0.12),transparent_55%)]" />
      
      {/* Точечная сетка */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-10"
        style={{ 
          backgroundImage: "radial-gradient(circle, rgba(37,99,235,0.15) 1px, transparent 1px)", 
          backgroundSize: "24px 24px" 
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 w-full py-12 md:py-16">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-start">
          {/* Левая колонка */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white dark:bg-[#15171C] border border-black/10 dark:border-white/10 shadow-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#00B96B] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00B96B]" />
              </span>
              <span className="text-[13px] font-medium text-[#5A5F6B] dark:text-[#c3c9d4]">{c("hero", "badge", t("hero.badge"))}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[36px] sm:text-[42px] lg:text-[48px] font-bold text-[#0A0A0A] dark:text-white leading-[1.1] tracking-[-0.02em] mb-5"
            >
              {c("hero", "title1", t("hero.title1"))}
              <br />
              {c("hero", "title2", t("hero.title2"))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[17px] text-[#5A5F6B] dark:text-[#9aa1ad] font-normal max-w-[480px] leading-[1.5] mb-8"
            >
              {c("hero", "subtitle", t("hero.subtitle"))}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <a
                href="#bots"
                className="inline-flex items-center justify-center gap-2 h-[52px] px-7 bg-[#2563EB] text-white font-semibold text-[15px] rounded-xl shadow-[0_8px_24px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 hover:bg-[#1d4ed8] hover:shadow-[0_12px_30px_rgba(37,99,235,0.32)] transition-all"
              >
                {c("hero", "pick", t("hero.pick"))}
                <ChevronRight size={16} strokeWidth={2.5} />
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center h-[52px] px-7 text-[#0A0A0A] dark:text-gray-200 font-medium text-[15px] rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
              >
                {c("hero", "cta2", t("hero.cta2"))}
              </a>
            </motion.div>
          </div>

          {/* Правая колонка */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white dark:bg-[#15171C] rounded-[20px] shadow-[0_20px_60px_-20px_rgba(37,99,235,0.15)] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[13px] text-[#8A8F99] dark:text-[#8a919e]">{t("hero.chart.portfolio")}</div>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[15px] font-bold text-[#00B96B] bg-[rgba(0,185,107,0.1)]">{stats[0]?.value ?? "+96.4%"}</span>
              </div>
              <CleanChart todayLabel={t("hero.chart.today")} />
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-black/5 dark:border-white/10 text-xs text-[#8A8F99] dark:text-[#8a919e]">
                <span>{t("hero.chart.drawdown")} 4.1%</span>
                <span className="h-1 w-1 rounded-full bg-[#8A8F99]" />
                <span>{t("hero.chart.uptime")} 99.9%</span>
              </div>
            </div>
            <ExchangeTrust />
          </motion.div>
        </div>

        {/* Панель метрик на всю ширину */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-12 bg-white dark:bg-[#15171C] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-6 py-6"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-black/5 dark:divide-white/10">
            {stats.map((stat, index) => {
              const Icon = statIcons[index] || TrendingUp;
              return (
                <div key={index} className="py-4 lg:py-0 first:pt-0 last:pb-0 lg:first:pl-0 lg:last:pr-0 lg:px-6">
                  <StatCard icon={Icon} value={stat.value} label={stat.label} />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}