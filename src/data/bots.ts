export interface BotProduct {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tag: string;
  benefit: string;
  color: 'primary' | 'secondary' | 'accent';
  howItWorks: { title: string; description: string }[];
  parameters: { name: string; value: string; description: string }[];
  trades: { date: string; pair: string; entry: string; exit: string; pnl: string; pnlPositive: boolean }[];
  returns: { period: string; value: string }[];
  risks: string[];
  faq: { question: string; answer: string }[];
}

export const bots: BotProduct[] = [
  {
    slug: 'grid-bot',
    name: 'Grid Bot',
    tagline: 'Сеточный бот для боковика',
    description:
      'Зарабатывает на колебаниях цены в диапазоне. Выставляет сетку ордеров и ловит каждое движение рынка.',
    tag: 'Для боковика / флэта',
    benefit: 'Прибыль на волатильности без прогноза направления',
    color: 'primary',
    howItWorks: [
      { title: 'Определение диапазона', description: 'Бот анализирует цену и определяет оптимальный коридор для торговли.' },
      { title: 'Расстановка сетки', description: 'Выставляет сетку ордеров на покупку и продажу с равными интервалами.' },
      { title: 'Автоматическое исполнение', description: 'Каждый ордер исполняется при касании цены — бот покупает дёшево, продаёт дорого.' },
      { title: 'Реинвестирование', description: 'Прибыль автоматически включается в новые циклы торговли.' },
    ],
    parameters: [
      { name: 'Количество ордеров', value: '10–50', description: 'Плотность сетки' },
      { name: 'Шаг сетки', value: '0.5–5%', description: 'Расстояние между ордерами' },
      { name: 'Диапазон цен', value: 'Авто / Ручной', description: 'Верхняя и нижняя граница' },
      { name: 'Размер ордера', value: 'От $10', description: 'Сумма каждого ордера' },
      { name: 'Тейк-профит', value: 'По шагу сетки', description: 'Фиксация прибыли' },
      { name: 'Стоп-лосс', value: 'Опционально', description: 'Защита от пробоя диапазона' },
    ],
    trades: [
      { date: '26.09.2025', pair: 'BTC/USDT', entry: '64 200', exit: '64 850', pnl: '+0.98%', pnlPositive: true },
      { date: '25.09.2025', pair: 'ETH/USDT', entry: '3 120', exit: '3 180', pnl: '+1.92%', pnlPositive: true },
      { date: '25.09.2025', pair: 'SOL/USDT', entry: '148.2', exit: '147.1', pnl: '-0.74%', pnlPositive: false },
      { date: '24.09.2025', pair: 'BTC/USDT', entry: '63 900', exit: '64 500', pnl: '+0.94%', pnlPositive: true },
      { date: '24.09.2025', pair: 'BNB/USDT', entry: '612', exit: '619', pnl: '+1.14%', pnlPositive: true },
      { date: '23.09.2025', pair: 'ETH/USDT', entry: '3 095', exit: '3 140', pnl: '+1.45%', pnlPositive: true },
    ],
    returns: [
      { period: '30 дней', value: '+8.4%' },
      { period: '90 дней', value: '+24.1%' },
      { period: '365 дней', value: '+87.6%' },
    ],
    risks: [
      'При сильном тренде вне диапазона бот может нести убытки.',
      'Неэффективен на рынках с низкой волатильностью.',
      'Рекомендуется использовать стоп-лосс для защиты капитала.',
    ],
    faq: [
      { question: 'Какой капитал нужен для Grid Bot?', answer: 'Минимум $10 на ордер. Рекомендуемый старт — $500+ для полноценной сетки.' },
      { question: 'Что делать при пробое диапазона?', answer: 'Бот автоматически остановит торговлю. Вы можете перенастроить диапазон или включить стоп-лосс.' },
      { question: 'Сколько пар можно торговать одновременно?', answer: 'Без ограничений — каждый бот работает на своей паре независимо.' },
    ],
  },
  {
    slug: 'dca-bot',
    name: 'DCA Bot',
    tagline: 'Бот усреднения для накопления',
    description:
      'Поэтапно покупает актив через равные интервалы, снижая среднюю цену входа и сглаживая волатильность.',
    tag: 'Для долгосрочного накопления',
    benefit: 'Дисциплинированное накопление без эмоций',
    color: 'secondary',
    howItWorks: [
      { title: 'Настройка плана', description: 'Вы выбираете актив, сумму и интервал покупок (час, день, неделя).' },
      { title: 'Регулярные покупки', description: 'Бот автоматически покупает актив по расписанию, независимо от цены.' },
      { title: 'Усреднение цены', description: 'При падении цены бот покупает больше, снижая среднюю цену входа.' },
      { title: 'Тейк-профит', description: 'При достижении целевой прибыли бот фиксирует результат и начинает новый цикл.' },
    ],
    parameters: [
      { name: 'Интервал покупок', value: '1ч – 7д', description: 'Частота усреднения' },
      { name: 'Сумма покупки', value: 'От $5', description: 'Размер каждой покупки' },
      { name: 'Количество покупок', value: '5–100', description: 'Лимит ордеров в цикле' },
      { name: 'Тейк-профит', value: '5–50%', description: 'Целевая прибыль цикла' },
      { name: 'Трейлинг-стоп', value: 'Опционально', description: 'Динамический стоп-лосс' },
      { name: 'Deviation', value: '1–10%', description: 'Отклонение для дополнительной покупки' },
    ],
    trades: [
      { date: '26.09.2025', pair: 'BTC/USDT', entry: '63 100', exit: '64 900', pnl: '+2.85%', pnlPositive: true },
      { date: '22.09.2025', pair: 'ETH/USDT', entry: '2 980', exit: '3 150', pnl: '+5.70%', pnlPositive: true },
      { date: '18.09.2025', pair: 'BTC/USDT', entry: '61 500', exit: '63 200', pnl: '+2.76%', pnlPositive: true },
      { date: '12.09.2025', pair: 'SOL/USDT', entry: '142.0', exit: '149.5', pnl: '+5.28%', pnlPositive: true },
      { date: '05.09.2025', pair: 'ETH/USDT', entry: '2 850', exit: '2 910', pnl: '+2.11%', pnlPositive: true },
      { date: '28.08.2025', pair: 'BTC/USDT', entry: '59 800', exit: '58 900', pnl: '-1.51%', pnlPositive: false },
    ],
    returns: [
      { period: '30 дней', value: '+5.2%' },
      { period: '90 дней', value: '+16.8%' },
      { period: '365 дней', value: '+62.3%' },
    ],
    risks: [
      'При затяжном падении актива убытки могут быть значительными.',
      'Эффективность зависит от правильного выбора актива.',
      'Не подходит для краткосрочной спекуляции.',
    ],
    faq: [
      { question: 'Какие активы подходят для DCA?', answer: 'Фундаментально сильные активы с долгосрочным потенциалом: BTC, ETH, BNB и другие из топ-50.' },
      { question: 'Можно ли остановить бота досрочно?', answer: 'Да, в любой момент. Купленный актив остаётся на вашем балансе биржи.' },
      { question: 'Как рассчитывается тейк-профит?', answer: 'По средней цене входа. Например, при цели 10% бот продаёт, когда средняя цена вырастает на 10%.' },
    ],
  },
  {
    slug: 'ai-signal-bot',
    name: 'AI Signal Bot',
    tagline: 'ИИ-бот по сигналам для трендовой торговли',
    description:
      'ИИ анализирует рынок, новости и социальные сигналы, открывает сделки по сигналам и следует за трендом.',
    tag: 'Для трендовой торговли',
    benefit: 'ИИ находит точки входа, пока вы занимаетесь делами',
    color: 'accent',
    howItWorks: [
      { title: 'Анализ данных', description: 'ИИ обрабатывает графики, объёмы, новости и соцсети в реальном времени.' },
      { title: 'Генерация сигналов', description: 'Модель выдаёт сигнал BUY/SELL с оценкой уверенности и целевой ценой.' },
      { title: 'Исполнение сделки', description: 'Бот автоматически открывает позицию с заданным риском и тейк-профитом.' },
      { title: 'Управление позицией', description: 'Трейлинг-стоп и динамический тейк-профит максимизируют прибыль по тренду.' },
    ],
    parameters: [
      { name: 'Модель', value: 'Coinsofter AI v3', description: 'Версия нейросети' },
      { name: 'Таймфрейм', value: '15м – 4ч', description: 'Период анализа' },
      { name: 'Мин. уверенность', value: '60–95%', description: 'Порог сигнала' },
      { name: 'Размер позиции', value: '1–10% депо', description: 'Риск на сделку' },
      { name: 'Тейк-профит', value: 'Динамический', description: 'По волатильности и тренду' },
      { name: 'Стоп-лосс', value: '1–5%', description: 'Ограничение убытка' },
    ],
    trades: [
      { date: '26.09.2025', pair: 'BTC/USDT', entry: '63 500', exit: '65 200', pnl: '+2.68%', pnlPositive: true },
      { date: '25.09.2025', pair: 'ETH/USDT', entry: '3 080', exit: '3 220', pnl: '+4.55%', pnlPositive: true },
      { date: '24.09.2025', pair: 'SOL/USDT', entry: '145.0', exit: '141.2', pnl: '-2.62%', pnlPositive: false },
      { date: '23.09.2025', pair: 'BTC/USDT', entry: '62 100', exit: '64 800', pnl: '+4.35%', pnlPositive: true },
      { date: '22.09.2025', pair: 'AVAX/USDT', entry: '28.5', exit: '30.1', pnl: '+5.61%', pnlPositive: true },
      { date: '20.09.2025', pair: 'ETH/USDT', entry: '3 150', exit: '3 280', pnl: '+4.13%', pnlPositive: true },
    ],
    returns: [
      { period: '30 дней', value: '+12.7%' },
      { period: '90 дней', value: '+38.4%' },
      { period: '365 дней', value: '+124.9%' },
    ],
    risks: [
      'ИИ-сигналы не гарантируют прибыль — возможны убыточные сделки.',
      'В периоды низкой волатильности количество сигналов снижается.',
      'Рекомендуется диверсификация по нескольким парам.',
    ],
    faq: [
      { question: 'Как обучена модель ИИ?', answer: 'Модель обучена на 5+ годах исторических данных с учётом технических индикаторов, новостей и соцсети.' },
      { question: 'Сколько сигналов в день?', answer: 'В среднем 3–8 сигналов в день в зависимости от волатильности рынка.' },
      { question: 'Можно ли фильтровать сигналы?', answer: 'Да, вы можете задать минимальный порог уверенности и выбрать торгуемые пары.' },
    ],
  },
];

export function getBot(slug: string): BotProduct | undefined {
  return bots.find((b) => b.slug === slug);
}
