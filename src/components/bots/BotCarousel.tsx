import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBots } from "@/lib/use-bots";
import { botText } from "@/data/bots";
import { BotAvatar } from "./BotCard";

export default function BotCarousel() {
  const { lang, t } = useI18n();
  const bots = useBots();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Math.max(bots.length, 1);

  useEffect(() => {
    setActive(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [bots.length]);

  const scrollToSlide = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(count - 1, i));
    const child = track.children[clamped] as HTMLElement | undefined;
    if (child) track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;
    const first = track.children[0] as HTMLElement;
    const width = first.offsetWidth || 1;
    setActive(Math.round(track.scrollLeft / width));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToSlide(active - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToSlide(active + 1);
    }
  };

  if (bots.length === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("carousel.label")}
      onKeyDown={onKeyDown}
    >
      <div
        ref={trackRef}
        onScroll={onTrackScroll}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {bots.map((bot, i) => {
          const b = botText(bot, lang);
          return (
            <div
              key={bot.slug}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${bots.length}: ${b.name}`}
              className="relative w-[86%] shrink-0 snap-center rounded-2xl border border-gray-100 bg-white p-6 shadow-soft sm:p-8 dark:border-gray-800 dark:bg-gray-900"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${bot.color}, transparent)` }} />
              <div className="flex items-center gap-4">
                <BotAvatar bot={b} size={52} />
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-gray-900 dark:text-white">{b.name}</h3>
                  <div className="truncate text-xs text-gray-400 dark:text-gray-500">{b.badge}</div>
                </div>
              </div>
              <p className="mt-4 line-clamp-2 min-h-[3rem] text-sm leading-relaxed text-gray-500 dark:text-gray-400">{b.slogan}</p>
              <Link
                to={`/bots/${bot.slug}`}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-blue px-6 text-sm font-semibold text-white transition-all hover:bg-blue-700"
              >
                {t("carousel.pick")}
                <ArrowRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4">
        <button
          onClick={() => scrollToSlide(active - 1)}
          disabled={active <= 0}
          aria-label={t("carousel.prev")}
          className="rounded-full border border-gray-200 p-2 text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          {bots.map((bot, i) => (
            <button
              key={bot.slug}
              onClick={() => scrollToSlide(i)}
              aria-label={`${t("carousel.goto")} ${i + 1}`}
              aria-current={Math.round(active) === i}
              className={`h-2 rounded-full transition-all ${Math.round(active) === i ? "w-6 bg-brand-blue" : "w-2 bg-gray-300 dark:bg-gray-600"}`}
            />
          ))}
        </div>
        <button
          onClick={() => scrollToSlide(active + 1)}
          disabled={active >= bots.length - 1}
          aria-label={t("carousel.next")}
          className="rounded-full border border-gray-200 p-2 text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
