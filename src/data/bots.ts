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

export interface BotData extends Omit<BotText, "features" | "howItWorks" | "exampleTrade"> {
  slug: string;
  color: string;
  colorDim: string;
  imageUrl?: string;
  difficulty?: string;
  difficultyTone?: "starter" | "advanced" | "aggressive";
  features: string[];
  howItWorks: BotStep[];
  exampleTrade: BotStep[];
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
    slug: "cryptosuperstock",
    market: "Акции + крипта",
    strategy: "Возврат к среднему",
    name: "CryptoSuperStock",
    slogan: "Торгуйте международный рынок и акции в одном роботе",
    shortDesc: "Гибридный бот: акции международных компаний и криптопары на BYBIT одновременно. Short и Long на двух рынках — стабильность акций плюс динамика крипты.",
    fullDesc: "Стратегия построена на концепции возврата к среднему: в акциях часто возникают существенные ценовые отклонения от среднего уровня с последующей нормализацией. Бот реагирует на эти отклонения и постоянно пересчитывает лимитные ордера на открытие сделок. Гибридный подход позволяет торговать множество движений динамично, совершая сделки в Short и Long на двух рынках одновременно — риски нивелируются стабильными котировками международных акций, а динамику обеспечивает волатильность криптовалютных монет.",
    badge: "Гибрид: акции + крипта",
    howItWorks: [
      { title: "Поиск отклонений", desc: "Бот отслеживает отклонения рыночной цены от среднестатистического значения" },
      { title: "Динамические ордера", desc: "Постоянно пересчитывает лимитные ордера на открытие сделки" },
      { title: "Два рынка — один бот", desc: "Short и Long на акциях и крипте одновременно, диверсификация рисков" },
    ],
    exampleTrade: [
      { title: "Условие", desc: "Цена акции отклоняется от среднего уровня сильнее обычного" },
      { title: "Вход", desc: "Бот выставляет лимитные ордера на открытие Long или Short" },
      { title: "Пересчёт", desc: "Лимитные ордера автоматически пересчитываются вслед за ценой" },
      { title: "Закрытие", desc: "При нормализации цены сделки закрываются на обоих рынках" },
    ],
    features: [
      "Акции международных компаний + криптопары на BYBIT",
      "Стратегия возврата к среднему, проверенная бэктестами",
      "Одновременная торговля Long и Short",
      "Автоматический пересчёт лимитных ордеров",
      "Диверсификация рисков за счёт двух рынков",
    ],
    returns: [
      { period: "30 дней", value: "+6.8%" },
      { period: "90 дней", value: "+19.4%" },
      { period: "365 дней", value: "+71.2%" },
    ],
    risk: "Сбалансированный: стабильные акции компенсируют волатильность крипты",
    pairs: "AAPL, TSLA, NVDA, BTC/USDT, ETH/USDT и др.",
    color: "#00FFB2",
    colorDim: "rgba(0, 255, 178, 0.12)",
    difficulty: "Для новичков",
    difficultyTone: "starter",
    i18n: {
      en: {
        name: "CryptoSuperStock",
        slogan: "Trade international markets and stocks in one bot",
        shortDesc: "Hybrid bot: stocks of international companies and crypto pairs on BYBIT at the same time. Long and Short on two markets — stock stability plus crypto dynamics.",
        fullDesc: "The strategy is built on mean reversion: stocks often show significant deviations from the average level followed by normalization. The bot reacts to these deviations and continuously recalculates limit orders to open trades. The hybrid approach lets it trade many movements dynamically, opening Long and Short trades on two markets at once — risks are offset by stable quotes of international stocks, while crypto volatility provides the dynamics.",
        badge: "Hybrid: stocks + crypto",
        market: "Stocks + Crypto",
        strategy: "Mean reversion",
        risk: "Balanced: stable stocks offset crypto volatility",
        pairs: "AAPL, TSLA, NVDA, BTC/USDT, ETH/USDT and more",
        features: [
          "International company stocks + crypto pairs on BYBIT",
          "Mean-reversion strategy backed by backtests",
          "Simultaneous Long and Short trading",
          "Automatic limit-order recalculation",
          "Risk diversification across two markets",
        ],
        howItWorks: [
          { title: "Detecting deviations", desc: "The bot tracks deviations of the market price from its average value" },
          { title: "Dynamic orders", desc: "Continuously recalculates limit orders to open trades" },
          { title: "Two markets — one bot", desc: "Long and Short on stocks and crypto at once, with risk diversification" },
        ],
        exampleTrade: [
          { title: "Condition", desc: "A stock price deviates from its average level more than usual" },
          { title: "Entry", desc: "The bot places limit orders to open Long or Short trades" },
          { title: "Recalculation", desc: "Limit orders are automatically recalculated as the price moves" },
          { title: "Closing", desc: "When the price normalizes, trades are closed on both markets" },
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
  return bots.find((b) => b.slug === slug)
}
