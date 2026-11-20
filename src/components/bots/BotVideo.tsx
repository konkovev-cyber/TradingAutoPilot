import React, { useState } from "react";
import { Play, Shield, Zap, Clock, ExternalLink, AlertCircle } from "lucide-react";
import { botText, colorDimFrom, type BotData } from "@/data/bots";
import { useI18n } from "@/lib/i18n";
import { useContent } from "@/lib/site-content";

export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : null;
}

export default function BotVideo({ bot }: { bot: BotData }) {
  const { lang } = useI18n();
  const c = useContent();
  const b = botText(bot, lang);
  const videoId = extractYouTubeId(b.videoUrl);
  const [embedMode, setEmbedMode] = useState<boolean>(true);

  if (!videoId) return null;

  const glowColor = b.color === "#00FFB2" ? "rgba(0, 255, 178, 0.25)" : colorDimFrom(b.color);
  const directWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

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
        <div className="relative mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-500 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {c("botDetail", "videoBadge", "Видеообзор и демонстрация")}
              </span>
              <span
                className="inline-block rounded-full border px-3 py-1 text-xs font-bold tracking-wide"
                style={{
                  borderColor: b.color === "#00FFB2" ? "rgba(0, 255, 178, 0.3)" : b.color,
                  backgroundColor: colorDimFrom(b.color),
                  color: b.color === "#00FFB2" ? "#00c98d" : b.color,
                }}
              >
                {c("botDetail", "videoStatus", `${b.name} в работе`)}
              </span>
            </div>

            <h3 className="heading-md text-gray-900 dark:text-white mt-1">
              {b.videoTitle || `Как работает ${b.name}: живая демонстрация торговли`}
            </h3>

            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl">
              {b.videoDesc || c("botDetail", "videoDesc", "Посмотрите подробный видеоразбор алгоритма: логика входов в сделки, сканирование объёмов, автоматический контроль рисков и настройка на бирже.")}
            </p>
          </div>

          {/* Direct link button to YouTube */}
          <div className="shrink-0">
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm group"
            >
              <Play size={15} className="fill-current text-red-500 group-hover:text-white transition-colors" />
              <span>{c("botDetail", "videoOpenYouTube", "Смотреть на YouTube")}</span>
              <ExternalLink size={13} className="opacity-70" />
            </a>
          </div>
        </div>

        {/* Video Player Frame with fallback banner */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-2xl dark:border-white/10"
          style={{ boxShadow: `0 12px 40px -10px ${glowColor}` }}
        >
          {embedMode ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={b.videoTitle || `${b.name} video review`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="h-full w-full border-0"
            />
          ) : (
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block h-full w-full group overflow-hidden"
            >
              <img
                src={thumbnailUrl}
                alt={b.videoTitle || b.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all">
                  <Play size={32} className="fill-current translate-x-0.5" />
                </div>
                <div className="max-w-md">
                  <div className="text-white font-bold text-base sm:text-lg mb-1 drop-shadow">
                    {b.videoTitle || `Смотреть видеообзор ${b.name}`}
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-red-300 font-medium">
                    Нажмите, чтобы открыть на YouTube <ExternalLink size={14} />
                  </div>
                </div>
              </div>
            </a>
          )}
        </div>

        {/* Notice for direct opening */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={13} className="text-gray-400" />
            <span>Если плеер заблокирован автором видео —</span>
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-red-500 hover:underline inline-flex items-center gap-1"
            >
              откройте напрямую на YouTube <ExternalLink size={11} />
            </a>
          </div>
          <button
            type="button"
            onClick={() => setEmbedMode(!embedMode)}
            className="text-xs text-gray-400 hover:text-gray-200 underline cursor-pointer"
          >
            {embedMode ? "Показать обложку видео" : "Вернуть плеер"}
          </button>
        </div>

        {/* Value badges below video */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
            <Play size={16} className="text-red-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {c("botDetail", "videoChip1", "Реальный рынок")}
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
            <Zap size={16} className="text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {c("botDetail", "videoChip2", "Отклик < 35ms")}
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
            <Shield size={16} className="text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {c("botDetail", "videoChip3", "Контроль просадки")}
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
            <Clock size={16} className="text-cyan-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {c("botDetail", "videoChip4", "Запуск за 2 минуты")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
