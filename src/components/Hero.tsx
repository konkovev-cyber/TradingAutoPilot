import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";
import { useTheme } from "@/lib/theme";

const chartData = [
  100, 102, 99, 105, 103, 108, 112, 109, 115, 118, 114, 120, 125, 122, 128, 132,
  130, 138, 142, 139, 145, 150, 148, 155, 160, 158, 165, 170, 168, 175, 180, 178,
  185, 190, 188, 195, 192, 198, 205, 210, 208, 215, 220, 218, 225, 230, 228, 235,
];

function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = value.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!m) return;
    const [, prefix, numStr, suffix] = m;
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
          setText(prefix + (target * eased).toFixed(dec) + suffix);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={className}>
      {text}
    </div>
  );
}

function InteractiveChart() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const monthsRaw = t("hero.chart.months");
  const months: string[] = Array.isArray(monthsRaw) ? monthsRaw : ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; label: string } | null>(null);

  // Анимационное состояние (в refs  без ререндеров каждый кадр)
  const progressRef = useRef(0);
  const startedRef = useRef(false);
  const mouseRef = useRef<{ x?: number; y?: number }>({});
  const displayLastRef = useRef(chartData[chartData.length - 1]);
  const targetLastRef = useRef(chartData[chartData.length - 1]);
  const lastJitterRef = useRef(0);
  const rafRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
    const pad = { top: 24, right: 24, bottom: 36, left: 48 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    const data = chartData.slice();
    data[data.length - 1] = displayLastRef.current;

    const minV = Math.min(...data) - 10;
    const maxV = Math.max(...data) + 10;
    const toX = (i: number) => pad.left + (i / (data.length - 1)) * cw;
    const toY = (v: number) => pad.top + ch - ((v - minV) / (maxV - minV)) * ch;

    const gridColor = isDark ? "#1f2937" : "#eef2f7";
    const labelColor = isDark ? "#6b7280" : "#9ca3af";

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (i / 5) * ch;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      const val = Math.round(maxV - (i / 5) * (maxV - minV));
      ctx.fillStyle = labelColor;
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(val + "%", pad.left - 8, y + 4);
    }

    ctx.textAlign = "center";
    months.forEach((label, i) => {
      const x = toX(Math.round((i / (months.length - 1)) * (data.length - 1)));
      ctx.fillText(label, x, h - 10);
    });

    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    grad.addColorStop(0, isDark ? "rgba(59, 130, 246, 0.25)" : "rgba(59, 130, 246, 0.16)");
    grad.addColorStop(1, "rgba(59, 130, 246, 0)");

    const strokeCurve = () => {
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(data[0]));
      for (let i = 1; i < data.length; i++) {
        const xc = (toX(i) + toX(i - 1)) / 2;
        const yc = (toY(data[i]) + toY(data[i - 1])) / 2;
        ctx.quadraticCurveTo(toX(i - 1), toY(data[i - 1]), xc, yc);
      }
      const lastX = toX(data.length - 1);
      const lastY = toY(data[data.length - 1]);
      ctx.quadraticCurveTo(lastX, lastY, lastX, lastY);
    };

    const lastX = toX(data.length - 1);
    const lastY = toY(data[data.length - 1]);

    const drawing = progressRef.current < 1;
    if (drawing) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, pad.left + cw * progressRef.current + 2, h);
      ctx.clip();
    }

    strokeCurve();
    ctx.lineTo(lastX, h - pad.bottom);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    strokeCurve();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    if (!drawing) {
      const now = performance.now();
      const pulse = (Math.sin(now / 500) + 1) / 2;
      const halo = 10 + pulse * 10;
      ctx.beginPath();
      ctx.arc(lastX, lastY, halo, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, " + (0.25 - pulse * 0.18).toFixed(2) + ")";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    if (drawing) ctx.restore();

    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    if (mouseX !== undefined && mouseY !== undefined) {
      const idx = Math.round(((mouseX - pad.left) / cw) * (data.length - 1));
      if (idx >= 0 && idx < data.length) {
        const px = toX(idx);
        const py = toY(data[idx]);
        ctx.beginPath();
        ctx.moveTo(px, pad.top);
        ctx.lineTo(px, h - pad.bottom);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
    }
  }, [isDark, months]);

  useEffect(() => {
    const loop = (now: number) => {
      if (startedRef.current && progressRef.current < 1) {
        progressRef.current = Math.min(1, progressRef.current + 0.014);
      }
      if (startedRef.current && now - lastJitterRef.current > 1500) {
        lastJitterRef.current = now;
        const base = chartData[chartData.length - 1];
        targetLastRef.current = base + (Math.random() * 5 - 1.5);
      }
      displayLastRef.current += (targetLastRef.current - displayLastRef.current) * 0.05;
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) startedRef.current = true;
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y };

    const pad = { top: 24, right: 24, bottom: 36, left: 48 };
    const cw = rect.width - pad.left - pad.right;
    const idx = Math.round(((x - pad.left) / cw) * (chartData.length - 1));
    if (idx >= 0 && idx < chartData.length) {
      const mIdx = Math.round((idx / (chartData.length - 1)) * (months.length - 1));
      const pad2 = { top: 24, bottom: 36 };
      const inner = rect.height - pad2.top - pad2.bottom;
      const minV = Math.min(...chartData) - 10;
      const maxV = Math.max(...chartData) + 10;
      const yPos = pad2.top + inner - ((chartData[idx] - minV) / (maxV - minV)) * inner;
      setHoveredPoint({
        x: pad.left + (idx / (chartData.length - 1)) * cw,
        y: yPos,
        value: chartData[idx],
        label: months[Math.min(months.length - 1, Math.max(0, mIdx))],
      });
    }
  };

  const onLeave = () => {
    mouseRef.current = {};
    setHoveredPoint(null);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-blue-100/70 dark:border-blue-900 text-xs font-semibold text-blue-700 dark:text-blue-300">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          LIVE
        </div>

      </div>
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] p-4"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <canvas ref={canvasRef} className="w-full h-[300px] block" />
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none glass border border-blue-100/70 dark:border-blue-900 rounded-lg px-3 py-2 text-xs shadow-md z-10"
            style={{ left: hoveredPoint.x + 12, top: hoveredPoint.y - 44 }}
          >
            <div className="font-bold text-gray-900 dark:text-white tabular-nums">+{hoveredPoint.value}%</div>
            <div className="text-gray-500 dark:text-gray-400">{hoveredPoint.label}</div>
          </div>
        )}
        <div className="flex items-center justify-between mt-3 px-2">
          <div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{t("hero.chart.drawdown")}</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">-4.1%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
const statIcons = [TrendingUp, Shield, Globe, Zap];

export default function Hero() {
  const { t } = useI18n();
  const c = useContent();
  const stats: { value: string; label: string }[] = t("hero.stats");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 55%)" }}>
      <div className="dark:hidden">
        <div className="blob animate-float w-[480px] h-[480px] bg-blue-400/25 -top-40 -right-32" aria-hidden="true" />
        <div className="blob animate-float-slow w-[380px] h-[380px] bg-indigo-400/20 top-1/3 -left-40" aria-hidden="true" />
        <div className="blob w-[300px] h-[300px] bg-violet-300/15 bottom-0 right-1/3" aria-hidden="true" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-100/70 dark:border-blue-900 mb-8 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{c("hero", "badge", t("hero.badge"))}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading-hero text-gray-900 dark:text-white mb-6"
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                {c("hero", "title1", t("hero.title1"))}
              </motion.span>
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-gradient">{c("hero", "title2", t("hero.title2"))}</span>
                <motion.svg
                  className="absolute -bottom-1.5 left-0 w-full h-[10px] overflow-visible"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="swooshGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M2 7.5 C 55 1.5, 145 1.5, 198 7"
                    fill="none"
                    stroke="url(#swooshGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.75, duration: 0.8, ease: "easeOut" }}
                  />
                </motion.svg>
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-500/80 dark:text-gray-500 max-w-xl mb-12 leading-relaxed"
            >
              {c("hero", "subtitle", t("hero.subtitle"))}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#bots"
                className="btn-gradient inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl"
              >
                {c("hero", "pick", t("hero.pick"))}
                <ArrowRight size={18} />
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center px-8 py-4 text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {c("hero", "cta2", t("hero.cta2"))}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 rounded-2xl border border-white/70 dark:border-gray-800 p-5 sm:p-6 shadow-sm"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-8">
                {/* главная метрика  результат */}
                {stats[0] && (
                  <div className="flex items-center gap-4 md:pr-8 md:border-r border-gray-200/60 dark:border-gray-700/60">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,255,150,0.12)" }}>
                      <TrendingUp size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <CountUp value={stats[0].value} className="text-4xl font-extrabold text-emerald-500 leading-none tracking-tight tabular-nums" />
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{stats[0].label}</div>
                    </div>
                  </div>
                )}
                {/* второстепенные метрики */}
                <div className="grid grid-cols-3 gap-4 flex-1 items-center">
                  {stats.slice(1).map((s, i) => {
                    const Icon = statIcons[i + 1] || Shield;
                    return (
                      <div key={i} className="group relative flex items-center gap-2.5">
                        <Icon size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                        <div className="min-w-0">
                          <CountUp value={s.value} className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 leading-tight tabular-nums" />
                          <div className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">{s.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <InteractiveChart />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

