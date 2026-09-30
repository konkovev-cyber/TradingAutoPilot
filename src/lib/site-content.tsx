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
    purposeTitle: { ru: "Для чего нужны торговые боты?", en: "What are trading bots for?" },
    purposeText: {
      ru: "Основная цель торговых ботов — автоматизация торговли. Робот анализирует рынок в режиме реального времени, совершает сделки и управляет рисками по заданному алгоритму. Бот выполняет вычисления и обрабатывает данные быстрее человека: следит за десятками пар одновременно, реагирует на изменения рынка за секунды и работает круглосуточно. При этом средства остаются на вашей бирже, а робот торгует по API-ключу без права вывода — вы в любой момент можете остановить торговлю или вывести прибыль.",
      en: "The main goal of trading bots is trade automation. The bot analyzes the market in real time, makes trades and manages risk according to its algorithm. It computes and processes data faster than a human: monitors dozens of pairs at once, reacts to market changes in seconds and works around the clock. Your funds stay on your exchange while the bot trades via an API key without withdrawal rights — you can stop trading or withdraw profit at any moment.",
    },
  },
  advantages: {
    title: { ru: "Преимущества использования торговых ботов", en: "Advantages of using trading bots" },
    items: [
      {
        title: { ru: "Круглосуточная работа", en: "Around-the-clock operation" },
        desc: { ru: "Боты работают 24/7, обеспечивая мониторинг рынка и выполнение сделок, даже когда вы спите или заняты другими делами.", en: "Bots work 24/7, monitoring the market and executing trades while you sleep or are busy with other things." },
      },
      {
        title: { ru: "Отсутствие эмоций", en: "No emotions" },
        desc: { ru: "Роботы принимают решения на основе алгоритмов и данных, исключая эмоциональные ошибки, которые часто совершают люди.", en: "Bots make decisions based on algorithms and data, excluding the emotional mistakes people often make." },
      },
      {
        title: { ru: "Скорость и эффективность", en: "Speed and efficiency" },
        desc: { ru: "Боты анализируют и обрабатывают информацию за считанные секунды, обеспечивая быстрый отклик на изменения рынка.", en: "Bots analyze and process information in seconds, providing a fast response to market changes." },
      },
      {
        title: { ru: "Автоматизация стратегий", en: "Strategy automation" },
        desc: { ru: "Каждый робот автоматизирует свою стратегию, снижая необходимость постоянного мониторинга и вмешательства.", en: "Each bot automates its own strategy, reducing the need for constant monitoring and intervention." },
      },
      {
        title: { ru: "Управление рисками", en: "Risk management" },
        desc: { ru: "Стоп-лосс, настройки риска на сделку и диверсификация помогают минимизировать потенциальные убытки.", en: "Stop-loss, per-trade risk settings and diversification help minimize potential losses." },
      },
    ],
  },
  benefits: {
    title: { ru: "Почему стоит выбрать TradingAutoPilot?", en: "Why choose TradingAutoPilot?" },
    subtitle: {
      ru: "На крипторынке множество торговых ботов, но TradingAutoPilot выделяется среди них благодаря своим возможностям и условиям.",
      en: "There are many trading bots on the market, but TradingAutoPilot stands out with its capabilities and terms.",
    },
    items: [
      { tag: { ru: "Без подписки", en: "No subscription" }, title: { ru: "Без абонентской платы", en: "No subscription fee" }, desc: { ru: "Покупаете робота один раз — без абонентской платы и комиссий с прибыли. Он торгует для вас круглосуточно.", en: "Buy the bot once — no subscription fee and no profit commission. It trades for you around the clock." } },
      { tag: { ru: "Популярные биржи", en: "Popular exchanges" }, title: { ru: "Широкий спектр поддерживаемых бирж", en: "Wide range of supported exchanges" }, desc: { ru: "Работает с популярными биржами: BYBIT, Binance, OKX, BingX, Gate.io, HTX, Bitget, KuCoin, MEXC и другими.", en: "Works with popular exchanges: BYBIT, Binance, OKX, BingX, Gate.io, HTX, Bitget, KuCoin, MEXC and more." } },
      { tag: { ru: "Понятный интерфейс", en: "Clear interface" }, title: { ru: "Удобство и простота использования", en: "Convenience and simplicity" }, desc: { ru: "Понятный интерфейс и готовые шаблоны стратегий делают старт простым для новичков и опытных трейдеров.", en: "A clear interface and ready-made strategy templates make starting simple for beginners and experienced traders." } },
      { tag: { ru: "API-ключи", en: "API keys" }, title: { ru: "Безопасность средств", en: "Funds safety" }, desc: { ru: "API-ключи создаются с правом торговли, но без права вывода — доступа к вашим средствам у нас нет.", en: "API keys are created with trading rights but without withdrawal rights — we have no access to your funds." } },
      { tag: { ru: "Инструкции, советы", en: "Guides, tips" }, title: { ru: "База знаний и FAQ", en: "Knowledge base and FAQ" }, desc: { ru: "База знаний, инструкции и подробные описания алгоритмов каждого робота на детальных страницах.", en: "A knowledge base, guides and detailed algorithm descriptions on each bot's detail page." } },
      { tag: { ru: "Круглосуточная поддержка", en: "24/7 support" }, title: { ru: "Техническая поддержка", en: "Technical support" }, desc: { ru: "Поддержка в Telegram и WhatsApp — поможем с подключением, настройкой и выбором робота.", en: "Support on Telegram and WhatsApp — we help with connection, setup and bot selection." } },
    ],
  },
  pricing: {
    title: { ru: "Наши цены", en: "Our prices" },
    text1: {
      ru: "TradingAutoPilot не берёт абонентскую плату и комиссию за транзакции на криптобиржах. Вы покупаете робота один раз — и он торгует для вас без подписки.",
      en: "TradingAutoPilot charges no subscription fee and no commission on exchange transactions. You buy the bot once — and it trades for you without a subscription.",
    },
    text2: {
      ru: "Доходность каждого робота показана на его странице за 30, 90 и 365 дней. Исторические результаты не гарантируют будущих, поэтому все показатели помечены как исторические, а торговля связана с риском.",
      en: "Each bot's page shows returns for 30, 90 and 365 days. Historical results do not guarantee future ones, so all figures are marked as historical and trading involves risk.",
    },
  },
  conclusion: {
    title: { ru: "Заключение", en: "Conclusion" },
    text1: {
      ru: "Торговые боты становятся неотъемлемой частью успешной торговли на криптовалютном рынке. Они автоматизируют процессы, управляют рисками и обеспечивают круглосуточную работу — три специализированных робота TradingAutoPilot закрывают разные подходы: гибрид акций и крипты, высокочастотную сетку и охоту за импульсами.",
      en: "Trading bots are becoming an integral part of successful trading on the crypto market. They automate processes, manage risk and work around the clock — the three specialized TradingAutoPilot bots cover different approaches: a stock-crypto hybrid, a high-frequency grid and impulse hunting.",
    },
    text2: {
      ru: "Выбирая TradingAutoPilot, вы получаете автоматизацию по API без права вывода средств, прозрачное описание каждого алгоритма и поддержку на каждом шаге — от подключения до автоторговли.",
      en: "Choosing TradingAutoPilot you get API automation without withdrawal rights, a transparent description of every algorithm and support at every step — from connection to auto trading.",
    },
  },
  questions: {
    title: { ru: "Остались вопросы?", en: "Any questions left?" },
    subtitle: {
      ru: "Получите бесплатную консультацию: расскажем, как подключить биржу и выбрать робота под ваш депозит.",
      en: "Get a free consultation: we will explain how to connect an exchange and pick a bot for your deposit.",
    },
    btn: { ru: "Получить консультацию", en: "Get a consultation" },
  },
  tryIt: {
    title: { ru: "Просто попробуйте!", en: "Just try it!" },
    text: {
      ru: "С торговыми роботами TradingAutoPilot ваш робот торгует на любимых биржах автоматически. Подключите API-ключ, выберите робота — остальное сделает алгоритм.",
      en: "With TradingAutoPilot trading bots, your bot trades on your favorite exchanges automatically. Connect an API key, pick a bot — the algorithm does the rest.",
    },
    bullet1: { ru: "Без абонентской платы", en: "No subscription fee" },
    bullet2: { ru: "Покупаете робота один раз", en: "Buy the bot once" },
    btn: { ru: "Начать зарабатывать", en: "Start earning" },
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
    trust: "АПИ-ключи без права вывода. Средства остаются на вашей бирже",
    contactBtn: { ru: "Связаться с нами", en: "Contact us" },
  },
  contacts: {
    telegram: "https://t.me/coinsofter",
    whatsapp: "https://wa.me/79990000000",
    email: "mailto:info@coinsofter.com",
    phone: "+7 999 000-00-00",
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

export const DEFAULT_PHONE = "+7 999 000-00-00";

export interface SiteContacts {
  telegram: string;
  whatsapp: string;
  email: string;
  phone: string;
}

/** Contact channels editable in the admin panel (site_content "contacts"). */
export function useContacts(): SiteContacts {
  const data = useSiteContent();
  const contacts = data?.contacts ?? {};
  const str = (v: Json, fallback: string): string => (typeof v === "string" && v.trim() !== "" ? v.trim() : fallback);
  return {
    telegram: str(contacts.telegram, "https://t.me/coinsofter"),
    whatsapp: str(contacts.whatsapp, "https://wa.me/79990000000"),
    email: str(contacts.email, "mailto:info@coinsofter.com"),
    phone: str(contacts.phone, DEFAULT_PHONE),
  };
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
