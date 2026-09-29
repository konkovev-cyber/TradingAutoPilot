/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "./supabase";
import { useI18n, type Lang } from "./i18n";
import type { BotStep } from "@/data/bots";

type Json = any;

const FALLBACKS: Record<string, Json> = {
  meta: {
    title: "Торговые боты для криптобирж и акций | TradingAutoPilot (без подписки)",
    description: "Автоматизируйте торговлю на BYBIT, Binance и фондовых рынках. 3 стратегии: от консервативной до импульсной. Подключение по API за 2 минуты. Средства остаются на вашей бирже.",
  },
  hero: {
    badge: { ru: "3 специализированных бота · ИИ-торговля 24/7", en: "3 specialized bots · AI trading 24/7" },
    title: {
      ru: "Три специализированных торговых робота",
      en: "Three specialized trading bots",
    },
    subtitle: {
      ru: "TradingAutoPilot — автоматическая торговля через API биржи. Три робота с разными подходами работают 24/7: вы управляете своим счётом на бирже, робот торгует по вашему API-ключу без права вывода средств.",
      en: "TradingAutoPilot — automated trading through exchange APIs. Three bots with different approaches work 24/7: you stay in control of your exchange account while the bot trades via your API key without withdrawal rights.",
    },
    primary: { ru: "Выбрать робота", en: "Choose a bot" },
    secondary: { ru: "Как это работает", en: "How it works" },
    trust1: { ru: "Без абонплаты, покупка навсегда", en: "No subscription, buy once" },
    trust2: { ru: "API без права вывода", en: "API without withdrawal rights" },
    trust3: { ru: "Настройка за 2 минуты", en: "Setup in 2 minutes" },
  },
  why: {
    title: { ru: "Почему роботы не взаимозаменяемы", en: "Why bots are not interchangeable" },
    subtitle: {
      ru: "Выбирайте робота по рынку, частоте сделок и риск-профилю — а не по обещанной доходности.",
      en: "Choose a bot by market, trade frequency and risk profile — not by promised returns.",
    },
    items: [
      {
        title: { ru: "Специализированные стратегии", en: "Specialized strategies" },
        desc: {
          ru: "Каждый робот — самостоятельная торговая система со своей логикой входов и выходов",
          en: "Each bot is an independent trading system with its own entry and exit logic",
        },
      },
      {
        title: { ru: "Полная автоматизация", en: "Full automation" },
        desc: {
          ru: "Робот следит за рынком и торгует 24/7 — без вашего постоянного участия",
          en: "The bot monitors the market and trades 24/7 — without your constant involvement",
        },
      },
      {
        title: { ru: "Контроль риска и прозрачность", en: "Risk control and transparency" },
        desc: {
          ru: "Стоп-лосс, настройки риска и понятное описание алгоритма в каждом роботе",
          en: "Stop-loss, risk settings and a clear algorithm explanation in every bot",
        },
      },
    ],
  },
  choose: {
    title: { ru: "Как выбрать робота", en: "How to choose a bot" },
    subtitle: {
      ru: "Сравните рынок, стратегию, стиль торговли, частоту и риск — и выберите подходящий профиль.",
      en: "Compare market, strategy, trade style, frequency and risk — and pick the right profile.",
    },
  },
  connect: {
    title: { ru: "Подключение и безопасность", en: "Connection and safety" },
    subtitle: {
      ru: "Подключение к бирже по API занимает пару минут. Ключ создаётся с правом торговли, но без права вывода средств.",
      en: "Connecting to an exchange via API takes a couple of minutes. The key is created with trading rights but without withdrawal rights.",
    },
    steps: [
      {
        title: { ru: "Регистрация", en: "Registration" },
        desc: { ru: "Создайте аккаунт за минуту — нужен только email", en: "Create an account in a minute — all you need is an email" },
      },
      {
        title: { ru: "Создание API-ключа", en: "Create an API key" },
        desc: {
          ru: "На бирже создайте ключ с правом торговли, но БЕЗ права вывода средств",
          en: "On the exchange, create a key with trading rights but WITHOUT withdrawal rights",
        },
      },
      {
        title: { ru: "Подключение робота", en: "Connect the bot" },
        desc: {
          ru: "Добавьте ключ в TradingAutoPilot и выберите робота под свой депозит",
          en: "Add the key to TradingAutoPilot and pick a bot for your deposit",
        },
      },
      {
        title: { ru: "Автоторговля 24/7", en: "Auto trading 24/7" },
        desc: {
          ru: "Робот торгует по вашему ключу, а средства и прибыль остаются на вашей бирже",
          en: "The bot trades via your key while funds and profit stay on your exchange",
        },
      },
    ],
    note: {
      ru: "API-ключи шифруются и хранятся без права вывода — доступа к вашим средствам у нас нет.",
      en: "API keys are encrypted and stored without withdrawal rights — we have no access to your funds.",
    },
  },
  cta: {
    title: "Выберите своего торгового робота",
    subtitle: "Без абонентской платы и комиссий с прибыли — покупаете робота один раз, он торгует для вас круглосуточно.",
    trust: "АПИ-ключи без права вывода. Средства остаются на вашей бирже",
    carouselTitle: { ru: "Какой робот вам подходит?", en: "Which bot fits you?" },
    carouselSubtitle: {
      ru: "Три стратегии — выберите свою и откройте подробное описание",
      en: "Three strategies — pick yours and open the detailed description",
    },
    contactBtn: { ru: "Связаться с нами", en: "Contact us" },
  },
  nav: {
    bots: "Роботы",
    how: "Как работает",
    faq: "FAQ",
  },
};

const SiteContentContext = createContext<Record<string, Json>>(FALLBACKS);

/** Picks a localized string from a value that may be a plain string or a {ru, en} object. */
export function localize(v: Json, fallback: string, lang: Lang = "ru"): string {
  if (v === undefined || v === null || v === "") return fallback;
  if (typeof v === "object" && !Array.isArray(v)) {
    const pick = lang === "en" ? v.en : v.ru;
    return pick === undefined || pick === null || pick === "" ? fallback : String(pick);
  }
  return String(v);
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Record<string, Json>>(FALLBACKS);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    (async () => {
      try {
        const { data: rows, error } = await supabase
          .from("site_content")
          .select("section, data");
        if (error) {
          console.error("[site_content] load failed:", error.message);
          return;
        }
        if (!rows || rows.length === 0 || cancelled) return;
        const merged: Record<string, Json> = { ...FALLBACKS };
        rows.forEach((r: any) => {
          merged[r.section] = { ...(FALLBACKS[r.section] ?? {}), ...(r.data ?? {}) };
        });
        setData(merged);
      } catch (e) {
        console.error("[site_content] exception:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteContentContext.Provider value={data}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): Record<string, Json> {
  return useContext(SiteContentContext);
}

export function useContent() {
  const data = useSiteContent();
  const { lang } = useI18n();
  return useCallback(
    (section: string, key: string, fallback: string): string => {
      return localize(data?.[section]?.[key], fallback, lang);
    },
    [data, lang]
  );
}

export function useSectionValue(section: string): Json {
  const data = useSiteContent();
  return useMemo(() => data?.[section], [data, section]);
}

/** Localized list accessor: returns items of an array field or []. */
export function useLocalizedList<T = Json>(section: string, key: string): T[] {
  const data = useSiteContent();
  return useMemo(() => {
    const v = data?.[section]?.[key];
    return Array.isArray(v) ? (v as T[]) : [];
  }, [data, section, key]);
}

/** Localized BotStep[] accessor for admin-editable step lists. */
export function localizedSteps(items: Json[], lang: Lang): BotStep[] {
  return items.map((item) => ({
    title: localize(item?.title, "", lang),
    desc: localize(item?.desc, "", lang),
  }));
}
