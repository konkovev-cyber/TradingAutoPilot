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
    badge: { ru: "Уникальные алгоритмы · AI-торговля 24/7", en: "Unique algorithms · AI trading 24/7" },
    heading1: { ru: "Торговые роботы нового уровня", en: "Next-level trading robots" },
    heading2: { ru: "для криптовалют и акций", en: "for crypto and stocks" },
    title: { ru: "Три специализированных торговых робота", en: "Three specialized trading bots" },
    subtitle: {
      ru: "Автоматизируйте торговлю и освободите своё время с помощью роботов TradingAutoPilot. Наша команда занимается разработками алгоритмов, готовых роботов, проводит бэктесты и подбирает настройки. Полная тех.поддержка 24/7 каждому пользователю.",
      en: "Automate your trading and free up your time with TradingAutoPilot robots. Our team develops algorithms, ready-made bots, runs backtests and fine-tunes settings. Full 24/7 technical support for every user.",
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
      ru: "На крипторынке множество торговых ботов, но TradingAutoPilot выделяется среди них благодаря своим инновациям, возможностям и условиям.",
      en: "There are many trading bots on the market, but TradingAutoPilot stands out with its innovations, capabilities and terms.",
    },
    formatTelegram: {
      ru: "Наши роботы доступны в формате Telegram-ботов",
      en: "Our bots are available as Telegram bots",
    },
    formatWindows: {
      ru: "и в формате программы для Windows",
      en: "and as a Windows desktop application",
    },
    items: [
      {
        icon: "badge-dollar-sign",
        tag: { ru: "Без подписки", en: "No subscription" },
        title: { ru: "Без абонентской платы", en: "No subscription fee" },
        desc: { ru: "Покупаете робота один раз — без абонентской платы и комиссий с прибыли. Он торгует для вас круглосуточно.", en: "Buy the bot once — no subscription fee and no profit commission. It trades for you around the clock." },
      },
      {
        icon: "building-2",
        tag: { ru: "Популярные биржи", en: "Popular exchanges" },
        title: { ru: "Широкий спектр поддерживаемых бирж", en: "Wide range of supported exchanges" },
        desc: { ru: "Работаем с популярными биржами и добавляем новые.", en: "We work with popular exchanges and keep adding new ones." },
      },
      {
        icon: "mouse-pointer-click",
        tag: { ru: "Понятный интерфейс", en: "Clear interface" },
        title: { ru: "Удобство и простота использования", en: "Convenience and simplicity" },
        desc: { ru: "Понятный интерфейс и готовые шаблоны стратегий делают старт простым для новичков и опытных трейдеров.", en: "A clear interface and ready-made strategy templates make starting simple for beginners and experienced traders." },
      },
      {
        icon: "shield-check",
        tag: { ru: "API-ключи", en: "API keys" },
        title: { ru: "Безопасность средств", en: "Funds safety" },
        desc: { ru: "API-ключи создаются с правом торговли, но без права вывода — доступа к вашим средствам у нас нет.", en: "API keys are created with trading rights but without withdrawal rights — we have no access to your funds." },
      },
      {
        icon: "book-open",
        tag: { ru: "Инструкции, советы", en: "Guides, tips" },
        title: { ru: "База знаний и коммьюнити", en: "Knowledge base and community" },
        desc: { ru: "База знаний, инструкции и подробные описания алгоритмов каждого робота, открытое сообщество пользователей ботов, где обсуждаем торговлю и делимся мнениями.", en: "A knowledge base, guides and detailed descriptions of every bot's algorithms, plus an open community of bot users where we discuss trading and share opinions." },
      },
      {
        icon: "headset",
        tag: { ru: "Круглосуточная поддержка", en: "24/7 support" },
        title: { ru: "Техническая поддержка", en: "Technical support" },
        desc: { ru: "Поддержка 24/7 — поможем с подключением, настройкой и выбором робота.", en: "24/7 support — we help with connection, setup and choosing a bot." },
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
    title: { ru: "Добавьте робота в свой торговый арсенал!", en: "Add a bot to your trading arsenal!" },
    subtitle: {
      ru: "Наши роботы — гордость каждого владельца. Не требует абонентской платы · Постоянные обновления · Торговля 24/7 с тех. поддержкой",
      en: "Our bots are the pride of every owner. No subscription · Constant updates · 24/7 trading with tech support",
    },
    bullet1: { ru: "Без абонентской платы", en: "No subscription fee" },
    bullet2: { ru: "Покупаете робота один раз", en: "Buy the bot once" },
    btn: { ru: "Начать зарабатывать", en: "Start earning" },
  },
  connect: {
    title: { ru: "Запустите торгового робота в несколько шагов", en: "Launch a trading bot in a few steps" },
    subtitle: {
      ru: "Для работы не нужно передавать роботу деньги или переводить криптовалюту на сторонний кошелёк.",
      en: "You do not need to transfer funds to the bot or move crypto to a third-party wallet.",
    },
    steps: [
      {
        icon: "bot",
        title: { ru: "Выберите робота", en: "Choose a bot" },
        desc: {
          ru: "Выберите бота и свяжитесь с нами.",
          en: "Pick a bot and contact us.",
        },
      },
      {
        icon: "plug",
        title: { ru: "Подключите биржу", en: "Connect an exchange" },
        desc: {
          ru: "Создайте API-ключ с необходимыми настройками.",
          en: "Create an API key with the required settings.",
        },
      },
      {
        icon: "settings",
        title: { ru: "Настройте стратегию", en: "Configure the strategy" },
        desc: {
          ru: "Укажите торговые пары, капитал и параметры робота. Либо мы сделаем это за вас с вашим согласованием.",
          en: "Specify trading pairs, capital and bot parameters. Or we will set it up for you with your approval.",
        },
      },
      {
        icon: "play",
        title: { ru: "Запустите торговлю", en: "Start trading" },
        desc: {
          ru: "Следите за работой алгоритма и результатами на бирже и в роботе.",
          en: "Monitor the algorithm and results on the exchange and in the bot.",
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
  // Hero page carousel slides (editable from admin)
  hero_slides: [
    {
      eyebrow: "TradingAutoPilot",
      title: "Торгуйте без рутины",
      desc: "Выберите свой бот среди наших специализированных торговых инструментов. Каждый алгоритм уникален и имеет свой потенциал для использования на рынке. Свяжитесь с нами — мы поможем вам выбрать подходящий.",
    },
    {
      eyebrow: "Как это работает",
      title: "Безопасность и контроль",
      desc: "Торговля всех роботов производится через API-ключи биржи с запретом на вывод средств. Ваши средства в безопасности, стабильная связь ботов с биржей гарантировано обеспечивается.",
    },
    {
      eyebrow: "Преимущество",
      title: "Без подписки — робот остаётся с вами",
      desc: "Вы получаете бессрочный доступ к роботу без необходимости оплачивать подписку. Обновления и техническая поддержка предоставляются каждому пользователю.",
    },
    {
      eyebrow: "Начните сейчас",
      title: "Выберите стратегию под свой рынок",
      desc: "Торговля криптовалютами, высокочастотная сетка или спотовая торговля — каждый робот имеет свои преимущества.",
    },
  ],
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
  footer: {
    desc: {
      ru: "TradingAutoPilot — торговые роботы для криптовалют и акций. Покупка один раз, без абонентской платы.",
      en: "TradingAutoPilot — trading bots for crypto and stocks. Buy once, no subscription.",
    },
    copyright: { ru: "Все права защищены.", en: "All rights reserved." },
    risk: {
      ru: "Торговля на бирже связана с риском. Прошлая доходность не гарантирует будущих результатов.",
      en: "Exchange trading involves risk. Past returns do not guarantee future results.",
    },
  },
  lead: {
    title: { ru: "Оставить заявку", en: "Request a consultation" },
    subtitle: { ru: "Подберём робота под вашу стратегию и ответим на вопросы", en: "We will match a bot to your strategy and answer your questions" },
    whyTitle: { ru: "Почему стоит написать нам?", en: "Why write to us?" },
    whySubtitle: { ru: "Отвечаем в течение часа, подберём робота под ваш депозит и риск-профиль.", en: "We reply within an hour and match a bot to your deposit and risk profile." },
  },
  calculator: {
    title: { ru: "Калькулятор доходности", en: "Profit calculator" },
    subtitle: { ru: "Оцените потенциал прибыли на горизонте до года", en: "Estimate profit potential over up to a year" },
  },
  products: {
    detail: { ru: "Подробнее", en: "More details" },
    inDevelopment: { ru: "В разработке", en: "In development" },
  },
  botDetail: {
    back: { ru: "Все роботы", en: "All bots" },
    about: { ru: "О роботе", en: "About the bot" },
    howEarn: { ru: "Как робот зарабатывает", en: "How the bot earns" },
    features: { ru: "Ключевые особенности", en: "Key features" },
    risks: { ru: "Риски", en: "Risks" },
    pairs: { ru: "Торгуемые активы", en: "Traded assets" },
    safetyTitle: { ru: "Безопасность API", en: "API safety" },
    safety: {
      ru: "Робот торгует по вашему API-ключу с правом торговли, но без права вывода средств. Средства и прибыль остаются на вашей бирже.",
      en: "The bot trades via your API key with trading rights but no withdrawal rights. Funds and profit stay on your exchange.",
    },
    contactCta: { ru: "Обсудить запуск в Telegram", en: "Discuss launch on Telegram" },
    fits: { ru: "Какой робот вам подходит", en: "Which bot fits you" },
    others: { ru: "Другие роботы", en: "Other bots" },
    disclaimer: {
      ru: "Не является инвестиционной рекомендацией. Торговля на биржах связана с риском потери средств, прошлая доходность не гарантирует будущих результатов.",
      en: "Not investment advice. Exchange trading involves the risk of losing funds; past returns do not guarantee future results.",
    },
  },
};

