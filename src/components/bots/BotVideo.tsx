import React, { useState } from "react";
import { Play, Shield, Zap, Clock, ExternalLink, AlertCircle, Tv } from "lucide-react";
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

export function detectVideoProvider(url?: string | null): {
  type: "youtube" | "rutube" | "vk" | "mp4" | null;
  id?: string;
  embedUrl?: string;
  directUrl?: string;
} {
  if (!url) return { type: null };
  const trimmed = url.trim();

  // MP4
  if (/\.(mp4|webm)($|\?)/i.test(trimmed)) {
    return { type: "mp4", embedUrl: trimmed, directUrl: trimmed };
  }

  // RuTube
  const rutubeMatch = trimmed.match(/rutube\.ru\/(?:video|play\/embed)\/([a-zA-Z0-9]+)/i);
  if (rutubeMatch && rutubeMatch[1]) {
    return {
      type: "rutube",
      id: rutubeMatch[1],
      embedUrl: `https://rutube.ru/play/embed/${rutubeMatch[1]}`,
      directUrl: `https://rutube.ru/video/${rutubeMatch[1]}/`,
    };
  }

  // VK Video
  const vkMatch = trimmed.match(/vk\.com\/video_ext\.php\?(.*)/i) || trimmed.match(/vk\.com\/video(-?\d+_\d+)/i) || trimmed.match(/vkvideo\.ru\/video(-?\d+_\d+)/i);
  if (vkMatch) {
    if (trimmed.includes("video_ext.php")) {
      return { type: "vk", embedUrl: trimmed, directUrl: trimmed };
    }
    const id = vkMatch[1];
    return {
      type: "vk",
      id,
      embedUrl: `https://vk.com/video_ext.php?oid=${id.split('_')[0]}&id=${id.split('_')[1]}&hd=2`,
      directUrl: `https://vk.com/video${id}`,
    };
  }

  // YouTube
  const ytId = extractYouTubeId(trimmed);
  if (ytId) {
    return {
      type: "youtube",
      id: ytId,
      embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&autoplay=1`,
      directUrl: `https://www.youtube.com/watch?v=${ytId}`,
    };
  }

  return { type: null };
}

export default function BotVideo({ bot }: { bot: BotData }) {
  const { lang } = useI18n();
  const c = useContent();
  const b = botText(bot, lang);
  const provider = detectVideoProvider(b.videoUrl);

  // Default to FALSE (cover mode) so in Russia where YouTube is blocked, the user immediately sees the cover!
  const [embedMode, setEmbedMode] = useState<boolean>(false);
  const [imgError, setImgError] = useState<number>(0);

  if (!provider.type) return null;

  const glowColor = b.color === "#00FFB2" ? "rgba(0, 255, 178, 0.25)" : colorDimFrom(b.color);
  const directWatchUrl = provider.directUrl || b.videoUrl || "#";

  // Thumbnails hierarchy: YouTube maxres -> hqdefault -> bot image fallback
  const ytThumbMax = provider.id ? `https://img.youtube.com/vi/${provider.id}/maxresdefault.jpg` : "";
  const ytThumbHq = provider.id ? `https://img.youtube.com/vi/${provider.id}/hqdefault.jpg` : "";
  const fallbackThumb = b.imageUrl || "/synchro-bot.jpg";

  const currentPoster = imgError === 0 && ytThumbMax ? ytThumbMax : imgError === 1 && ytThumbHq ? ytThumbHq : fallbackThumb;

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
          <div className="shrink-0 flex items-center gap-2">
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-red-500 transition-all shadow-md group"
            >
              <Play size={15} className="fill-current text-white" />
              <span>{c("botDetail", "videoOpenYouTube", "Смотреть на YouTube")}</span>
              <ExternalLink size={13} className="opacity-80" />
            </a>
          </div>
        </div>

        {/* Video Player Frame with cover mode as default */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 shadow-2xl dark:border-white/10"
          style={{ boxShadow: `0 12px 40px -10px ${glowColor}` }}
        >
          {embedMode && provider.embedUrl ? (
            provider.type === "mp4" ? (
              <video
                src={provider.embedUrl}
                controls
                autoPlay
                className="h-full w-full object-cover"
              />
            ) : (
              <iframe
                src={provider.embedUrl}
                title={b.videoTitle || `${b.name} video review`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            )
          ) : (
            <div className="relative h-full w-full group overflow-hidden bg-gray-950">
              {/* Cover Background Image */}
              <img
                src={currentPoster}
                alt={b.videoTitle || b.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                onError={() => setImgError((prev) => prev + 1)}
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/40" />

              {/* Center Play Button & Title */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <a
                  href={directWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/50 group-hover:scale-110 group-hover:bg-red-500 transition-all cursor-pointer"
                  title="Открыть видео"
                >
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                  <Play size={38} className="fill-current translate-x-1" />
                </a>

                <div className="max-w-lg">
                  <div className="text-white font-extrabold text-base sm:text-xl drop-shadow-md mb-2">
                    {b.videoTitle || `Обзор алгоритма ${b.name}`}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={directWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-all"
                    >
                      <Play size={12} className="fill-current text-red-400" />
                      Смотреть на YouTube <ExternalLink size={12} />
                    </a>
                    {provider.type === "youtube" && (
                      <button
                        type="button"
                        onClick={() => setEmbedMode(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-800/90 border border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-700 transition-all cursor-pointer"
                      >
                        <Tv size={12} className="text-emerald-400" />
                        Запустить в плеере сайта (нужен VPN)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Informative footer bar under player */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={13} className="text-amber-500 shrink-0" />
            <span>В РФ доступ к YouTube может быть замедлен — используйте кнопку</span>
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-red-500 hover:underline inline-flex items-center gap-1"
            >
              Смотреть на YouTube <ExternalLink size={11} />
            </a>
          </div>
          {embedMode && (
            <button
              type="button"
              onClick={() => setEmbedMode(false)}
              className="text-xs text-gray-400 hover:text-gray-200 underline cursor-pointer"
            >
              Вернуть постер видео
            </button>
          )}
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
