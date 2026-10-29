export interface BotStep { title: string; desc: string }

export type Lang = "ru" | "en";

export interface BotText {
  name: string;
  slogan: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
  market: string;
  strategy: string;
  risk: string;
  pairs: string;
  features: string[];
  howItWorks: BotStep[];
  exampleTrade: BotStep[];
}

export interface BotReturn { period: string; value: string }

export interface BotData extends Omit<BotText, "features" | "howItWorks" | "exampleTrade"> {
  slug: string;
  color: string;
  colorDim: string;
  imageUrl?: string;
  avatarUrl?: string;
  avatarDarkUrl?: string;
  difficulty?: string;
  difficultyTone?: "starter" | "advanced" | "aggressive";
  features: string[];
  howItWorks: BotStep[];
  exampleTrade: BotStep[];
  returns: BotReturn[];
  i18n?: { ru?: Partial<BotText>; en?: Partial<BotText> };
}

export function colorDimFrom(color: string): string {
  const hex = /^#([0-9a-fA-F]{6})$/.exec(color.trim());
  if (!hex) return "rgba(59, 130, 246, 0.12)";
  const n = parseInt(hex[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, 0.12)`;
}

export function botText(bot: BotData, lang: Lang): BotData {
  const ov = (bot.i18n?.[lang] ?? {}) as Partial<BotText>;
  return {
    ...bot,
    name: ov.name || bot.name,
    slogan: ov.slogan || bot.slogan,
    shortDesc: ov.shortDesc || bot.shortDesc,
    fullDesc: ov.fullDesc || bot.fullDesc,
    badge: ov.badge || bot.badge,
    market: ov.market || bot.market,
    strategy: ov.strategy || bot.strategy,
    risk: ov.risk || bot.risk,
    pairs: ov.pairs || bot.pairs,
    features: ov.features && ov.features.length > 0 ? ov.features : bot.features,
    howItWorks: ov.howItWorks && ov.howItWorks.length > 0 ? ov.howItWorks : bot.howItWorks,
    exampleTrade: ov.exampleTrade && ov.exampleTrade.length > 0 ? ov.exampleTrade : bot.exampleTrade,
  };
}

export const bots: BotData[] = [
  {
    slug: "synchrobot",
    market: "Крипта",
    strategy: "Анализ объёмов и цен в реальном времени",
    name: "SynchroBot",
    slogan: "Меньше ручного анализа — больше данных для принятия торговых решений",
    shortDesc: "Интеллектуальный криптотрейдинговый бот, который анализирует рынок в режиме реального времени, отслеживает изменения объёмов и цены по множеству торговых пар и выявляет потенциальные возможности для LONG и SHORT.",
    fullDesc: "SynchroTrade Bot — интеллектуальный криптотрейдинговый бот, который анализирует рынок в режиме реального времени, отслеживает изменения объёмов и цены по множеству торговых пар и выявляет потенциальные возможности для LONG и SHORT. Алгоритмы помогают оценивать рыночную ситуацию, определять точки входа и контролировать риски, сокращая рутинную работу трейдера.\n\nМеньше ручного анализа — больше данных для принятия торговых решений.",
    badge: "Анализ объёмов и цен",
    imageUrl: "/synchro-bot.jpg",
    avatarUrl: "/synchro-hero-light.jpg",
    avatarDarkUrl: "/synchro-hero-dark.jpg",
    howItWorks: [
      { title: "Мониторинг рынка в реальном времени", desc: "Бот непрерывно сканирует поток котировок и изменения объёмов по множеству торговых пар" },
      { title: "Поиск возможностей LONG & SHORT", desc: "Алгоритмы выявляют ценовые дисбалансы и подтверждённые импульсы для входа в сделку" },
      { title: "Контроль рисков", desc: "Автоматический расчёт точек входа, выставление стоп-лоссов и защита капитала" },
    ],
    exampleTrade: [
      { title: "Всплеск объёма", desc: "Бот фиксирует синхронный рост объёма и ценовое движение на паре" },
      { title: "Вход в сделку", desc: "Алгоритм вычисляет оптимальную точку входа и открывает позицию в LONG или SHORT" },
      { title: "Сопровождение", desc: "Динамический контроль рисков и сопровождение позиции по заданным параметрам" },
      { title: "Фиксация прибыли", desc: "Сделка закрывается по тейк-профиту с защитой накопленной прибыли" },
    ],
    features: [
      "Анализ рынка в режиме реального времени",
      "Отслеживание изменений объёмов и цены по множеству торговых пар",
      "Поиск возможностей для сделок в LONG и SHORT",
      "Оценка рыночной ситуации и определение точных точек входа",
      "Контроль рисков и сокращение рутинного анализа трейдера",
    ],
    returns: [
      { period: "30 дней", value: "+7.9%" },
      { period: "90 дней", value: "+22.8%" },
      { period: "365 дней", value: "+78.4%" },
    ],
    risk: "Контролируемый: математический расчёт точек входа и встроенный риск-менеджмент",
    pairs: "BTC/USDT, ETH/USDT, SOL/USDT, Bybit, BingX, OKX и др.",
    color: "#00FFB2",
    colorDim: "rgba(0, 255, 178, 0.12)",
    difficulty: "Для новичков и профи",
    difficultyTone: "starter",
    i18n: {
      en: {
        name: "SynchroBot",
        slogan: "Less manual analysis — more actionable data for smart trading decisions",
        shortDesc: "An intelligent crypto trading bot analyzing the market in real time, tracking volume and price dynamics across pairs to spot LONG and SHORT opportunities.",
        fullDesc: "SynchroTrade Bot is an intelligent crypto trading bot that analyzes the market in real time, tracks volume and price dynamics across multiple trading pairs, and detects potential LONG and SHORT opportunities. Its algorithms evaluate market conditions, calculate optimal entry points, and manage risk, eliminating tedious routine for traders.\n\nLess manual analysis — more actionable data for smart trading decisions.",
        badge: "Volume & Price AI",
        market: "Crypto",
        strategy: "Real-time volume & price analysis",
        risk: "Controlled: mathematical entry calculation and built-in risk management",
        pairs: "BTC/USDT, ETH/USDT, SOL/USDT, Bybit, BingX, OKX & more",
        features: [
          "Real-time market depth and price stream analysis",
          "Tracking volume surges and price dynamics across multiple pairs",
          "Dual-direction setups: LONG and SHORT opportunities",
          "Market condition evaluation and precise entry points",
          "Automated risk control reducing trader routine",
        ],
        howItWorks: [
          { title: "Real-Time Market Tracking", desc: "Continuously scans order flow and volume changes across multiple crypto pairs" },
          { title: "Detecting LONG & SHORT Setups", desc: "Algorithms identify price imbalances and confirmed momentum for optimal entries" },
          { title: "Risk Management", desc: "Automated entry calculation, stop-loss protection, and capital defense" },
        ],
        exampleTrade: [
          { title: "Volume Surge", desc: "The bot detects synchronized volume inflow and price movement" },
          { title: "Trade Entry", desc: "The algorithm calculates an optimal entry and opens a LONG or SHORT trade" },
          { title: "Management", desc: "Dynamic risk control and position tracking based on preset rules" },
          { title: "Profit Taking", desc: "Trade closes at target take-profit while securing accumulated gains" },
        ],
      },
    },
  },
  {
    slug: "megagrid-ai",
    market: "Крипта",
    strategy: "Послотная сетка с ИИ",
    name: "MEGAGRID-AI",
    slogan: "Высокочастотная сеточная стратегия — сотни сделок в день на автомате",
    shortDesc: "Не обычный grid-бот. Послотная независимая модель вместо усреднения: математическая точность, ИИ сам подбирает пары и параметры.",
    fullDesc: "MEGAGRID не использует стандартную идею усреднения позиции, как большинство простых грид-ботов. Вместо этого применяется послотовая независимая модель: каждый лот — отдельная сделка со своими параметрами, что обеспечивает математическую точность и предсказуемость. Модули искусственного интеллекта автоматически подбирают торгуемые пары и параметры под текущий рынок.",
    badge: "ХИТ продаж",
    howItWorks: [
      { title: "ИИ подбирает пары", desc: "Модули ИИ автоматически выбирают торгуемые пары и параметры" },
      { title: "Послотная модель", desc: "Каждый лот независим — математическая точность вместо усреднения" },
      { title: "Сотни сделок в день", desc: "Робот совершает сотни сделок в день без вашего участия" },
    ],
    exampleTrade: [
      { title: "Отбор пар", desc: "ИИ выбирает торгуемые пары и параметры под текущий рынок" },
      { title: "Слоты сетки", desc: "Робот открывает независимые слоты — каждый лот отдельная сделка" },
      { title: "TP и SL", desc: "Для каждого слота выставляются свои тейк-профит и стоп-лосс" },
      { title: "Мониторинг", desc: "Слоты закрываются по своим условиям, робот открывает новые" },
    ],
    features: [
      "Высокочастотная сетка: сотни сделок в день на автомате",
      "Послотная независимая модель — без усреднения",
      "Математическая точность и предсказуемость",
      "ИИ автоматически подбирает пары и параметры",
      "Адаптация параметров под волатильность",
    ],
    returns: [
      { period: "30 дней", value: "+9.1%" },
      { period: "90 дней", value: "+27.6%" },
      { period: "365 дней", value: "+96.4%" },
    ],
    risk: "Высокая частота сделок: важна настройка риска на лот",
    pairs: "Топ-50 пар по объёму, подбор через ИИ",
    color: "#FF4D6A",
    colorDim: "rgba(255, 77, 106, 0.12)",
    difficulty: "Для продвинутых",
    difficultyTone: "advanced",
    i18n: {
      en: {
        name: "MEGAGRID-AI",
        slogan: "High-frequency grid strategy — hundreds of trades a day on autopilot",
        shortDesc: "Not an ordinary grid bot. An independent slot model instead of averaging: mathematical precision, AI picks pairs and parameters itself.",
        fullDesc: "MEGAGRID does not use the standard position-averaging idea found in most simple grid bots. Instead, it applies an independent slot model: each slot is a separate trade with its own parameters, providing mathematical precision and predictability. AI modules automatically select traded pairs and parameters for the current market.",
        badge: "Best seller",
        market: "Crypto",
        strategy: "Slot grid with AI",
        risk: "High trade frequency: per-slot risk settings matter",
        pairs: "Top-50 pairs by volume, selected by AI",
        features: [
          "High-frequency grid: hundreds of trades a day on autopilot",
          "Independent slot model — no averaging",
          "Mathematical precision and predictability",
          "AI automatically picks pairs and parameters",
          "Parameters adapt to volatility",
        ],
        howItWorks: [
          { title: "AI picks pairs", desc: "AI modules automatically select traded pairs and parameters" },
          { title: "Slot model", desc: "Each slot is independent — mathematical precision instead of averaging" },
          { title: "Hundreds of trades a day", desc: "The bot makes hundreds of trades a day without your involvement" },
        ],
        exampleTrade: [
          { title: "Pair selection", desc: "AI selects traded pairs and parameters for the current market" },
          { title: "Grid slots", desc: "The bot opens independent slots — each slot is a separate trade" },
          { title: "TP and SL", desc: "Each slot gets its own take-profit and stop-loss" },
          { title: "Monitoring", desc: "Slots close by their own conditions while the bot opens new ones" },
        ],
      },
    },
  },
  {
    slug: "smartix",
    market: "Крипта",
    strategy: "Импульсные движения, точечные сделки",
    name: "SMARTIX",
    slogan: "Охотник за аномалиями — точечные сделки по всей бирже",
    shortDesc: "ИИ-робот сканирует всю биржу и находит пары с резкими импульсными движениями цены. Точечные сделки в Short или Long. Никаких усреднений — только точечные входы.",
    fullDesc: "За счёт разработанного алгоритма и встроенных модулей ИИ торговый робот сканирует всю биржу и ищет пары с определёнными закономерностями и импульсными движениями цены. В подходящий момент робот может открыть точечную сделку в Short или Long с автоматическими тейк-профитом и стоп-лоссом. Бот постоянно мониторит биржу и может держать несколько сделок одновременно для диверсификации позиций.",
    badge: "Охотник за аномалиями",
    howItWorks: [
      { title: "Поиск актива", desc: "Находит актив на бирже и открывает сделку в Short или Long" },
      { title: "TP и SL", desc: "Выставляет тейк-профит и стоп-лосс в каждой сделке" },
      { title: "Мониторинг", desc: "Дожидается срабатывания условий и продолжает сканирование биржи" },
    ],
    exampleTrade: [
      { title: "Сканирование", desc: "Робот ищет на бирже пары с резкими импульсными движениями" },
      { title: "Сигнал", desc: "Найдено совпадение с закономерностями алгоритма" },
      { title: "Вход", desc: "Открывается точечная сделка в Long или Short" },
      { title: "TP и SL", desc: "Выставляются тейк-профит и стоп-лосс, усреднения нет" },
      { title: "Закрытие", desc: "Сделка закрывается по одному из условий, робот продолжает мониторинг" },
    ],
    features: [
      "Сканирует всю биржу 24/7",
      "Импульсные движения и аномалии через модули ИИ",
      "Только точечные сделки — без усреднений",
      "Автоматические TP и SL в каждой сделке",
      "Несколько сделок одновременно для диверсификации",
    ],
    returns: [
      { period: "30 дней", value: "+11.3%" },
      { period: "90 дней", value: "+33.8%" },
      { period: "365 дней", value: "+118.2%" },
    ],
    risk: "Повышенная волатильность: обязательны SL по правилам риск-менеджмента",
    pairs: "Вся биржа — отбор по закономерностям",
    color: "#7B61FF",
    colorDim: "rgba(123, 97, 255, 0.12)",
    difficulty: "Высокий риск / высокая награда",
    difficultyTone: "aggressive",
    i18n: {
      en: {
        name: "SMARTIX",
        slogan: "Anomaly hunter — point trades across the whole exchange",
        shortDesc: "An AI bot scans the entire exchange and finds pairs with sharp impulse price moves. Point trades in Short or Long. No averaging — point entries only.",
        fullDesc: "Using a purpose-built algorithm and built-in AI modules, the trading bot scans the whole exchange looking for pairs with specific patterns and impulse price moves. At the right moment, the bot can open a point trade in Short or Long with automatic take-profit and stop-loss. The bot monitors the exchange around the clock and can hold several trades at once for position diversification.",
        badge: "Anomaly hunter",
        market: "Crypto",
        strategy: "Impulse moves, point trades",
        risk: "Elevated volatility: stop-loss required by risk-management rules",
        pairs: "The whole exchange — filtered by patterns",
        features: [
          "Scans the entire exchange 24/7",
          "Impulse moves and anomalies via AI modules",
          "Point trades only — no averaging",
          "Automatic TP and SL in every trade",
          "Several trades at once for diversification",
        ],
        howItWorks: [
          { title: "Finding an asset", desc: "Finds an asset on the exchange and opens a Short or Long trade" },
          { title: "TP and SL", desc: "Sets take-profit and stop-loss in every trade" },
          { title: "Monitoring", desc: "Waits for the conditions to trigger and keeps scanning the exchange" },
        ],
        exampleTrade: [
          { title: "Scanning", desc: "The bot looks for pairs with sharp impulse moves on the exchange" },
          { title: "Signal", desc: "A match with the algorithm's patterns is found" },
          { title: "Entry", desc: "A point trade is opened in Long or Short" },
          { title: "TP and SL", desc: "Take-profit and stop-loss are set, with no averaging" },
          { title: "Closing", desc: "The trade closes on one of the conditions and monitoring continues" },
        ],
      },
    },
  },
]

export function getBot(slug: string): BotData | undefined {
  return bots.find(
    (b) =>
      b.slug === slug ||
      ((slug === "cryptosuperstock" || slug === "synchro-bot") && b.slug === "synchrobot")
  );
}
