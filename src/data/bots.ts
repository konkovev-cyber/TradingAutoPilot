export interface BotProduct {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tag: string;
  benefit: string;
  color: 'primary' | 'secondary' | 'accent';
  howItWorks: { title: string; description: string }[];
  returns: { period: string; value: string }[];
  risks: string[];
  faq: { question: string; answer: string }[];
}

export const bots: BotProduct[] = [
  {
    slug: 'grid-bot',
    name: 'Grid Bot',
    tagline: 'Сеточный бот для боковика',
    description: 'Зарабатывает на колебаниях цены в диапазоне. Выставляет сетку ордеров и ловит каждое движение рынка.',
    tag: 'Для боковика',
    benefit: 'Прибыль на волатильности',
    color: 'primary',
    howItWorks: [
      { title: 'Определение диапазона', description: 'Анализирует цену и находит коридор' },
      { title: 'Сетка ордеров', description: 'Покупает дёшево, продаёт дорого' },
      { title: 'Реинвестирование', description: 'Прибыль в новые циклы' },
    ],
    returns: [
      { period: '30 дней', value: '+8.4%' },
      { period: '90 дней', value: '+24.1%' },
      { period: '365 дней', value: '+87.6%' },
    ],
    risks: ['При сильном тренде вне диапазона'],
    faq: [{ question: 'Какой капитал нужен?', answer: 'Минимум  на ордер, рекомендуется +' }],
  },
  {
    slug: 'dca-bot',
    name: 'DCA Bot',
    tagline: 'Бот усреднения',
    description: 'Поэтапно покупает актив через равные интервалы, снижая среднюю цену входа.',
    tag: 'Для накопления',
    benefit: 'Дисциплинированное накопление',
    color: 'secondary',
    howItWorks: [
      { title: 'Настройка плана', description: 'Выберите актив и интервал' },
      { title: 'Регулярные покупки', description: 'Автопокупка по расписанию' },
      { title: 'Усреднение', description: 'Снижение средней цены входа' },
    ],
    returns: [
      { period: '30 дней', value: '+5.2%' },
      { period: '90 дней', value: '+16.8%' },
      { period: '365 дней', value: '+62.3%' },
    ],
    risks: ['При затяжном падении убытки значительны'],
    faq: [{ question: 'Какие активы?', answer: 'BTC, ETH, BNB и топ-50' }],
  },
  {
    slug: 'ai-signal-bot',
    name: 'AI Signal Bot',
    tagline: 'ИИ-бот для тренда',
    description: 'ИИ анализирует рынок и открывает сделки по сигналам.',
    tag: 'Для тренда',
    benefit: 'ИИ находит точки входа',
    color: 'accent',
    howItWorks: [
      { title: 'Анализ данных', description: 'Графики, объёмы, новости' },
      { title: 'Сигналы BUY/SELL', description: 'С оценкой уверенности' },
      { title: 'Автоисполнение', description: 'Бот торгует за вас' },
    ],
    returns: [
      { period: '30 дней', value: '+12.7%' },
      { period: '90 дней', value: '+38.4%' },
      { period: '365 дней', value: '+124.9%' },
    ],
    risks: ['Сигналы не гарантируют прибыль'],
    faq: [{ question: 'Сколько сигналов?', answer: '3-8 в день' }],
  },
];

export function getBot(slug: string): BotProduct | undefined {
  return bots.find((b) => b.slug === slug);
}
