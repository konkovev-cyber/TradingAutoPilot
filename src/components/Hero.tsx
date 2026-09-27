import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Zap, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const chartData = [
  100, 102, 99, 105, 103, 108, 112, 109, 115, 118, 114, 120, 125, 122, 128, 132,
  130, 138, 142, 139, 145, 150, 148, 155, 160, 158, 165, 170, 168, 175, 180, 178,
  185, 190, 188, 195, 192, 198, 205, 210, 208, 215, 220, 218, 225, 230, 228, 235
];

const monthLabels = ["Янв", "ев", "ар", "пр", "ай", "юн", "юл", "вг", "Сен", "кт", "оя", "ек"];

function InteractiveChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; label: string } | null>(null);
  const animRef = useRef<number>(0);

  const drawChart = useCallback((mouseX?: number, mouseY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const w = rect.width;
    const h = rect.height;
    const pad = { top: 24, right: 24, bottom: 36, left: 48 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    const minV = Math.min(...chartData) - 10;
    const maxV = Math.max(...chartData) + 10;

    const toX = (i: number) => pad.left + (i / (chartData.length - 1)) * cw;
    const toY = (v: number) => pad.top + ch - ((v - minV) / (maxV - minV)) * ch;

    // Grid
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (i / 5) * ch;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      // Y labels
      const val = Math.round(maxV - (i / 5) * (maxV - minV));
      ctx.fillStyle = "#9ca3af";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(val + "%", pad.left - 8, y + 4);
    }

    // X labels
    ctx.textAlign = "center";
    monthLabels.forEach((label, i) => {
      const x = pad.left + (i / (monthLabels.length - 1)) * cw;
      ctx.fillText(label, x, h - 10);
    });

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    grad.addColorStop(0, "rgba(59, 130, 246, 0.12)");
    grad.addColorStop(1, "rgba(59, 130, 246, 0)");

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(chartData[0]));
    for (let i = 1; i < chartData.length; i++) {
      const xc = (toX(i) + toX(i - 1)) / 2;
      const yc = (toY(chartData[i]) + toY(chartData[i - 1])) / 2;
      ctx.quadraticCurveTo(toX(i - 1), toY(chartData[i - 1]), xc, yc);
    }
    const lastX = toX(chartData.length - 1);
    const lastY = toY(chartData[chartData.length - 1]);
    ctx.quadraticCurveTo(lastX, lastY, lastX, lastY);
    ctx.lineTo(lastX, h - pad.bottom);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(chartData[0]));
    for (let i = 1; i < chartData.length; i++) {
      const xc = (toX(i) + toX(i - 1)) / 2;
      const yc = (toY(chartData[i]) + toY(chartData[i - 1])) / 2;
      ctx.quadraticCurveTo(toX(i - 1), toY(chartData[i - 1]), xc, yc);
    }
    ctx.quadraticCurveTo(lastX, lastY, lastX, lastY);
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Hover crosshair
    if (mouseX !== undefined && mouseY !== undefined) {
      const idx = Math.round(((mouseX - pad.left) / cw) * (chartData.length - 1));
      if (idx >= 0 && idx < chartData.length) {
        const px = toX(idx);
        const py = toY(chartData[idx]);

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(px, pad.top);
        ctx.lineTo(px, h - pad.bottom);
        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Point
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
        ctx.fillStyle = "#fff";
        ctx.fill();

        const monthIdx = Math.round((idx / (chartData.length - 1)) * 11);
        setHoveredPoint({ x: px, y: py, value: chartData[idx], label: monthLabels[monthIdx] });
        return;
      }
    }

    // End dot
    ctx.beginPath();
    ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();

    setHoveredPoint(null);
  }, []);

  useEffect(() => {
    drawChart();
    const handleResize = () => drawChart();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawChart]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    drawChart(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    drawChart();
  };

  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">оходность портфеля</div>
          <div className="text-3xl font-bold text-gray-900 tabular-nums">+135.0%</div>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-sm font-medium text-green-600">+35% за последний месяц</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-700">LIVE</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[260px] cursor-crosshair"
          style={{ display: "block" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            ref={tooltipRef}
            className="absolute pointer-events-none bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg transform -translate-x-1/2 -translate-y-full"
            style={{ left: hoveredPoint.x, top: hoveredPoint.y - 12 }}
          >
            <div className="font-semibold">{hoveredPoint.label}</div>
            <div className="text-blue-300 tabular-nums">{hoveredPoint.value}%</div>
          </div>
        )}
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div>
          <div className="text-xs text-gray-400 mb-1">сего сделок</div>
          <div className="text-lg font-bold text-gray-900 tabular-nums">1 247</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">рибыльных</div>
          <div className="text-lg font-bold text-green-600 tabular-nums">73.2%</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">акс. просадка</div>
          <div className="text-lg font-bold text-gray-900 tabular-nums">-4.1%</div>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { icon: TrendingUp, value: "+96.4%", label: "оходность за год" },
  { icon: Shield, value: "24/7", label: "лгоритмическая торговля" },
  { icon: Globe, value: "20+", label: "оддерживаемых бирж" },
  { icon: Zap, value: "< 1 сек", label: "Скорость реакции" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-white dark:bg-gray-950 overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-7xl mx-auto px-6 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Торговые роботы с  для любых бирж</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.08]"
            >
              Торгуйте на крипторынке{" "}
              <span className="text-brand-blue">с помощью </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mb-10 leading-relaxed"
            >
              оты работают на любых криптобиржах через API. лгоритмы с искусственным интеллектом находят сделки и торгуют автоматически  24 часа в сутки.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="#bots" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-blue text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                ыбрать робота
                <ArrowRight size={18} />
              </a>
              <a href="#how" className="inline-flex items-center justify-center px-8 py-4 text-gray-600 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
                ак это работает
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12"
            >
              {stats.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
                    <s.icon size={18} className="text-brand-blue" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{s.value}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{s.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Chart */}
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
