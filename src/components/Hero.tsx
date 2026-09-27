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

function CleanChart({ todayLabel }: { todayLabel: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const startedRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const context = canvas.getContext("2d");
      if (!context) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      const width = rect.width;
      const height = rect.height;
      const padding = { top: 14, bottom: 24, left: 8, right: 8 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;
      const minValue = Math.min(...chartData) - 8;
      const maxValue = Math.max(...chartData) + 8;
      const toX = (index: number) => padding.left + (index / (chartData.length - 1)) * chartWidth;
      const toY = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
      const progress = progressRef.current;
      const pointCount = Math.max(2, Math.floor(chartData.length * progress));
      const visibleData = chartData.slice(0, pointCount);

      const drawPath = () => {
        context.beginPath();
        context.moveTo(toX(0), toY(visibleData[0]));
        for (let index = 1; index < visibleData.length; index += 1) {
          const midpointX = (toX(index) + toX(index - 1)) / 2;
          const midpointY = (toY(visibleData[index]) + toY(visibleData[index - 1])) / 2;
          context.quadraticCurveTo(toX(index - 1), toY(visibleData[index - 1]), midpointX, midpointY);
        }
        if (visibleData.length > 1) {
          const last = visibleData.length - 1;
          context.quadraticCurveTo(toX(last), toY(visibleData[last]), toX(last), toY(visibleData[last]));
        }
      };

      const fill = context.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      fill.addColorStop(0, "rgba(37, 99, 235, 0.16)");
      fill.addColorStop(1, "rgba(37, 99, 235, 0)");
      drawPath();
      context.lineTo(toX(visibleData.length - 1), height - padding.bottom);
      context.lineTo(toX(0), height - padding.bottom);
      context.closePath();
      context.fillStyle = fill;
      context.fill();

      drawPath();
      context.strokeStyle = "#2563EB";
      context.lineWidth = 2.5;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.stroke();

      if (progress >= 1) {
        const last = visibleData.length - 1;
        const lastX = toX(last);
        const lastY = toY(visibleData[last]);
        context.save();
        context.beginPath();
        context.moveTo(lastX, padding.top);
        context.lineTo(lastX, height - padding.bottom + 2);
        context.strokeStyle = "rgba(138, 143, 153, 0.45)";
        context.lineWidth = 1;
        context.setLineDash([3, 4]);
        context.stroke();
        context.setLineDash([]);
        context.font = "11px Inter, sans-serif";
        context.fillStyle = "#8A8F99";
        context.textAlign = lastX > width - 45 ? "right" : "center";
        context.fillText(todayLabel, lastX > width - 45 ? lastX - 4 : lastX, height - 5);
        context.restore();

        const pulse = (Math.sin(performance.now() / 500) + 1) / 2;
        context.beginPath();
        context.arc(lastX, lastY, 4 + pulse * 3, 0, Math.PI * 2);
        context.fillStyle = `rgba(37, 99, 235, ${(0.28 - pulse * 0.16).toFixed(2)})`;
        context.fill();
        context.beginPath();
        context.arc(lastX, lastY, 4, 0, Math.PI * 2);
        context.fillStyle = "#2563EB";
        context.fill();
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

  return <canvas ref={canvasRef} className="w-full h-[220px] block" aria-label={todayLabel} />;
}

const statIcons = [TrendingUp, ShieldCheck, Globe, Zap];

function StatCard({ icon: Icon, value, label }: { icon: typeof TrendingUp; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-left px-2 sm:px-3">
      <Icon size={20} className="text-[#2563EB] shrink-0" strokeWidth={2} />
      <div className="min-w-0">
        <CountUp value={value} className="block text-[22px] font-bold text-[#0A0A0A] dark:text-white leading-tight tabular-nums" />
        <div className="text-xs text-[#8A8F99] dark:text-[#8a919e] leading-snug mt-1">{label}</div>
      </div>
    </div>
  );
}

function ExchangeTrust({ title, liveLabel }: { title: string; liveLabel: string }) {
  return (
    <div className="mt-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-[#8A8F99] dark:text-[#8a919e]">{title}</span>
        <div className="flex items-center gap-2 text-[11px] text-[#8A8F99] dark:text-[#8a919e]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#00B96B] opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00B96B]" />
          </span>
          {liveLabel}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#15171C]/70 px-3 py-3">
        {['BINANCE', 'BYBIT', 'OKX', 'KUCOIN'].map((exchange) => (
          <span key={exchange} className="text-center text-[11px] font-bold tracking-[0.08em] text-[#8A8F99] dark:text-[#87909d]">{exchange}</span>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[#15171C]/80 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#00B96B] opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00B96B]" />
          </span>
          <span className="text-xs font-semibold text-[#5A5F6B] dark:text-[#c3c9d4]">BTC/USDT  LONG</span>
        </div>
        <span className="text-sm font-bold text-[#00B96B]">+2.4%</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useI18n();
  const c = useContent();
  const stats: { value: string; label: string }[] = t("hero.stats");

  return (
    <section className="relative overflow-hidden bg-[#F8F9FB] dark:bg-[#0A0B0E]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_75%_35%,rgba(37,99,235,0.09),transparent_58%)] dark:bg-[radial-gradient(circle_at_75%_35%,rgba(37,99,235,0.12),transparent_58%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-10" style={{ backgroundImage: "radial-gradient(rgba(37,99,235,0.18) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 pt-20 pb-20 w-full">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-start">
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
              className="flex flex-col sm:flex-row gap-3"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white dark:bg-[#15171C] rounded-[20px] shadow-[0_20px_60px_-20px_rgba(37,99,235,0.15)] p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[13px] text-[#8A8F99] dark:text-[#8a919e]">{t("hero.chart.portfolio")}</div>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[15px] font-bold text-[#00B96B] bg-[rgba(0,185,107,0.1)]">{stats[0]?.value ?? "+96.4%"}</span>
              </div>
              <CleanChart todayLabel={t("hero.chart.today")} />
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-black/5 dark:border-white/10 text-xs text-[#8A8F99] dark:text-[#8a919e]">
                <span>{t("hero.chart.drawdown")} 4.1%</span>
                <span className="h-1 w-1 rounded-full bg-[#8A8F99]" />
                <span>{t("hero.chart.uptime")} 99.9%</span>
              </div>
            </div>
            <ExchangeTrust title={t("hero.exchangeTitle")} liveLabel={t("hero.live")} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-12 bg-white dark:bg-[#15171C] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-4 sm:px-6 py-5"
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
