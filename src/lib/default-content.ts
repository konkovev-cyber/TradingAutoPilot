/* eslint-disable @typescript-eslint/no-explicit-any */
export const DEFAULT_SITE_CONTENT: Record<string, any> = {
  telegram_settings: {
    enabled: false,
    bot_token: "",
    chat_id: "",
  },
  meta: {
    title: "Торговые боты для криптобирж и акций | TradingAutoPilot (без подписки)",
    description: "Автоматизируйте торговлю на BYBIT, Binance и фондовых рынках. 3 стратегии: от консервативной до импульсной. Подключение по API за 2 минуты. Средства остаются на вашей бирже.",
    keywords: "крипто боты, торговые роботы, Bybit, Binance, OKX, автоматическая торговля, алгоритмический трейдинг",
    site_url: "https://coinsofter.com",
    og_image: "https://coinsofter.com/og-image.svg",
    yandex_metrika_id: "",
    google_analytics_id: "",
    robots_txt: "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://coinsofter.com/sitemap.xml",
  },
  nav: {
    project: { ru: "О проекте", en: "About project" },
    bots: { ru: "Роботы", en: "Bots" },
    how: { ru: "Как работает", en: "How it works" },
    faq: { ru: "FAQ", en: "FAQ" },
    contact: { ru: "Связаться", en: "Contact" },
    cta: { ru: "Смотреть роботов", en: "View bots" },
  },
  hero: {
    badge: { ru: "20+ бирж · ИИ-торговля 24/7", en: "20+ exchanges · AI trading 24/7" },
    heading1: { ru: "Торговые боты для криптобирж", en: "Trading bots for crypto exchanges" },
    heading2: { ru: "и акций", en: "and stocks" },
    title: { ru: "Три специализированных торговых робота", en: "Three specialized trading bots" },
    subtitle: {
      ru: "TradingAutoPilot — автоматическая торговля через API биржи. Три робота с разными подходами работают 24/7: вы управляете своим счётом на бирже, робот торгует по вашему API-ключу без права вывода средств.",
      en: "TradingAutoPilot — automated trading through exchange APIs. Three bots with different approaches work 24/7: you stay in control of your exchange account while the bot trades via your API key without withdrawal rights.",
    },
    primary: { ru: "Выбрать робота", en: "Choose a bot" },
    secondary: { ru: "Как это работает", en: "How it works" },
    trust1: { ru: "Без абонплаты, покупка навсегда", en: "No subscription, buy once" },
    trust2: { ru: "Подключение за 2 минуты", en: "Setup in 2 minutes" },
    trust3: { ru: "API без права вывода", en: "API without withdrawal" },
  },
  contacts: {
    telegram: "https://t.me/coinsofter",
    whatsapp: "https://wa.me/79990000000",
    email: "info@coinsofter.com",
    phone: "+7 999 000-00-00",
  },
  why: {
    purposeTitle: { ru: "Для чего нужны торговые боты?", en: "What are trading bots for?" },
    purposeText: {
      ru: "Основная цель торговых ботов — автоматизация торговли. Робот анализирует рынок в режиме реального времени, совершает сделки и управляет рисками по заданному алгоритму. Бот выполняет вычисления и обрабатывает данные быстрее человека: следит за десятками пар одновременно, реагирует на изменения рынка за секунды и работает круглосуточно. При этом средства остаются на вашей бирже, а робот торгует по API-ключу без права вывода — вы в любой момент можете остановить торговлю или вывести прибыль.",
      en: "The main goal of trading bots is trade automation. The bot analyzes the market in real time, makes trades and manages risk according to its algorithm. It computes and processes data faster than a human: monitors dozens of pairs at once, reacts to market changes in seconds and works around the clock. Your funds stay on your exchange while the bot trades via an API key without withdrawal rights — you can stop trading or withdraw profit at any moment.",
    },
    items: [
      {
        title: { ru: "Круглосуточный мониторинг", en: "24/7 Monitoring" },
        desc: { ru: "Робот отслеживает десятки монет и акций одновременно без усталости.", en: "The bot monitors dozens of coins and stocks simultaneously without fatigue." },
      },
      {
        title: { ru: "Исключение эмоций", en: "No Emotional Bias" },
        desc: { ru: "Сделки открываются и закрываются строго по математическим триггерам стратегии.", en: "Trades are executed strictly based on mathematical strategy triggers." },
      },
      {
        title: { ru: "Мгновенное исполнение", en: "Instant Execution" },
        desc: { ru: "Реакция на импульс за доли секунды — человек физически не успеет быстрее алгоритма.", en: "Sub-second reaction to impulses — humans physically cannot beat algorithm speed." },
      },
    ],
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
      {
        tag: { ru: "Без подписки", en: "No subscription" },
        title: { ru: "Без абонентской платы", en: "No subscription fee" },
        desc: { ru: "Вы получаете бессрочный доступ к роботу без необходимости оплачивать подписку. Обновления и техническая поддержка предоставляются каждому пользователю.", en: "You get lifetime access to the bot with no subscription required. Updates and technical support are provided to every user." },
      },
      {
        tag: { ru: "Популярные биржи", en: "Popular exchanges" },
        title: { ru: "Широкий спектр поддерживаемых бирж", en: "Wide range of supported exchanges" },
        desc: { ru: "Работает с популярными биржами: BYBIT, Binance, OKX, BingX, Gate.io, HTX, Bitget, KuCoin, MEXC и другими.", en: "Works with popular exchanges: BYBIT, Binance, OKX, BingX, Gate.io, HTX, Bitget, KuCoin, MEXC and more." },
      },
      {
        tag: { ru: "Понятный интерфейс", en: "Clear interface" },
        title: { ru: "Удобство и простота использования", en: "Convenience and simplicity" },
        desc: { ru: "Понятный интерфейс и готовые шаблоны стратегий делают старт простым для новичков и опытных трейдеров.", en: "A clear interface and ready-made strategy templates make starting simple for beginners and experienced traders." },
      },
      {
        tag: { ru: "API-ключи", en: "API keys" },
        title: { ru: "Безопасность средств", en: "Funds safety" },
        desc: { ru: "API-ключи создаются с правом торговли, но без права вывода — доступа к вашим средствам у нас нет.", en: "API keys are created with trading rights but without withdrawal rights — we have no access to your funds." },
      },
      {
        tag: { ru: "Инструкции, советы", en: "Guides, tips" },
        title: { ru: "База знаний и FAQ", en: "Knowledge base and FAQ" },
        desc: { ru: "База знаний, инструкции и подробные описания алгоритмов каждого робота на детальных страницах.", en: "A knowledge base, guides and detailed algorithm descriptions on each bot's detail page." },
      },
      {
        tag: { ru: "Круглосуточная поддержка", en: "24/7 support" },
        title: { ru: "Техническая поддержка", en: "Technical support" },
        desc: { ru: "Поддержка в Telegram и WhatsApp — поможем с подключением, настройкой и выбором робота.", en: "Support on Telegram and WhatsApp — we help with connection, setup and bot selection." },
      },
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
    title: { ru: "Выберите своего торгового робота", en: "Choose your trading bot" },
    subtitle: {
      ru: "Без абонентской платы и комиссий с прибыли — покупаете робота один раз, он торгует для вас круглосуточно.",
      en: "No subscription fee and no profit commission — buy the bot once, it trades for you around the clock.",
    },
    trust: "API-ключи без права вывода. Средства остаются на вашей бирже",
    contactBtn: { ru: "Связаться с нами", en: "Contact us" },
  },
  stats: {
    users: "12400+",
    users_label: "Активных пользователей",
    volume: "$58M+",
    volume_label: "Объём торгов",
    uptime: "99.9%",
    uptime_label: "Uptime серверов",
  },
  exchanges: [
    "BYBIT",
    "Binance",
    "OKX",
    "BingX",
    "Gate.io",
    "HTX",
    "Bitget",
    "KuCoin",
    "MEXC",
  ],
  how_it_works: [
    {
      step: "01",
      title: "Регистрация на бирже",
      description: "Создайте аккаунт на любой поддерживаемой бирже (Bybit, Binance, OKX).",
      icon: "user",
    },
    {
      step: "02",
      title: "Создание API-ключа",
      description: "Сгенерируйте API-ключ с разрешением на чтение и торговлю (БЕЗ права вывода).",
      icon: "key",
    },
    {
      step: "03",
      title: "Подключение робота",
      description: "Вставьте API-ключ в настройки робота и выберите торговые пары.",
      icon: "cpu",
    },
    {
      step: "04",
      title: "Автоторговля 24/7",
      description: "Робот начинает сканировать рынок и совершать сделки по алгоритму.",
      icon: "trending-up",
    },
  ],
  testimonials: [
    {
      name: "Алексей Смирнов",
      role: "Частный инвестор",
      initials: "АС",
      color: "primary",
      text: "Пользуюсь SynchroBot уже 4 месяца на Bybit. Очень доволен результатом: средняя доходность около 8% в месяц при умеренном риске. Главное — деньги всегда на моём счёте.",
    },
    {
      name: "Дмитрий Ковалев",
      role: "Трейдер со стажем",
      initials: "ДК",
      color: "secondary",
      text: "MEGAGRID-AI отлично показал себя во время боковика по BTC и ETH. Сетка закрывает десятки микро-сделок в день, набегает отличная прибыль.",
    },
    {
      name: "Иван Прохоров",
      role: "Предприниматель",
      initials: "ИП",
      color: "accent",
      text: "Искал решение без ежемесячной подписки. Купил SMARTIX один раз — настроили за 10 минут с поддержкой в Telegram. Всё работает как часы.",
    },
  ],
  faq: [
    {
      q: "Нужны ли навыки программирования?",
      a: "Нет. Trading Auto Pilot — готовая платформа. Регистрация, подключение АПИ-ключа биржи, выбор робота и стратегии из шаблонов. Всё настраивается в пару кликов, без единой строчки кода.",
    },
    {
      q: "Как подключить биржу?",
      a: "Зайдите в личный кабинет, выберите биржу (BYBIT, Binance, OKX и др.), создайте АПИ-ключ с правом на торговлю, но БЕЗ права вывода средств. Скопируйте ключ и секрет в Trading Auto Pilot — подключение занимает 1-2 минуты.",
    },
    {
      q: "Безопасно ли передавать АПИ-ключи?",
      a: "Да. Мы требуем создавать ключи без права вывода — робот может только торговать, но не выводить активы. Ключи шифруются по стандарту AES-256 и хранятся в зашифрованном виде. Доступа к вашим средствам у нас нет.",
    },
    {
      q: "Какая минимальная сумма для старта?",
      a: "Минимум — $10 на один ордер. Для комфортной торговли рекомендуем стартовать от $200-500: чем больше капитал, тем гибче настройка рисков.",
    },
    {
      q: "Как выводить прибыль?",
      a: "Все средства остаются на вашей бирже. Робот только торгует — прибыль поступает прямо на ваш баланс. Выводите её в любой момент через интерфейс биржи, мы не удерживаем ваши деньги.",
    },
  ],
};

