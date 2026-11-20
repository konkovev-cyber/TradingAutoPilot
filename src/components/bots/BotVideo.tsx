import React from "react";
import { Play, Sparkles, Shield, Zap, Clock } from "lucide-react";
import { botText, colorDimFrom, type BotData } from "@/data/bots";
import { useI18n } from "@/lib/i18n";

export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : null;
}

export default function BotVideo({ bot }: { bot: BotData }) {
  const { lang } = useI18n();
  const b = botText(bot, lang);
  const videoId = extractYouTubeId(b.videoUrl);

  if (!videoId) return null;

  const glowColor = b.color === "#00FFB2" ? "rgba(0, 255, 178, 0.25)" : colorDimFrom(b.color);

  return (
    <section id="bot-video" className="mb-16 scroll-mt-24">
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 sm:p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900/90 dark:backdrop-blur-xl">
        {/* Ambient neon glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: b.color || "#00FFB2" }}
        />

        {/* Section Header */}
        <div className="relative mb-6 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-500 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Видеообзор и демонстрация
            </span>
            <span
              className="inline-block rounded-full border px-3 py-1 text-xs font-bold tracking-wide"
              style={{
                borderColor: b.color === "#00FFB2" ? "rgba(0, 255, 178, 0.3)" : b.color,
                backgroundColor: colorDimFrom(b.color),
                color: b.color === "#00FFB2" ? "#00c98d" : b.color,
              }}
            >
              {b.name} в работе
            </span>
          </div>

          <h3 className="heading-md text-gray-900 dark:text-white mt-1">
            {b.videoTitle || `Как работает ${b.name}: живая демонстрация торговли`}
          </h3>

          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl">
            Посмотрите подробный видеоразбор алгоритма: логика входов в сделки, сканирование объёмов, автоматический контроль рисков и настройка на бирже.
          </p>
        </div>

        {/* Video Player Frame */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-2xl dark:border-white/10"
          style={{ boxShadow: `0 12px 40px -10px ${glowColor}` }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={b.videoTitle || `${b.name} video review`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="h-full w-full border-0"
          />
        </div>

        {/* Value badges below video */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
            <Play size={16} className="text-red-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Реальный рынок
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
            <Zap size={16} className="text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Отклик &lt; 35ms
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
            <Shield size={16} className="text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Контроль просадки
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
            <Clock size={16} className="text-cyan-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Запуск за 2 минуты
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
