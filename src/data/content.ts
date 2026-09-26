export interface Trade {
  pair: string;
  type: 'Long' | 'Short';
  status: 'opened' | 'closed';
  entry: string;
  exit: string;
  pnl: string;
  pnlPositive: boolean;
  time: string;
}

export const recentTrades: Trade[] = [
  { pair: 'BTC/USDT', type: 'Long', status: 'closed', entry: '64 200', exit: '65 100', pnl: '+1.40%', pnlPositive: true, time: '2 мин назад' },
  { pair: 'ETH/USDT', type: 'Long', status: 'closed', entry: '3 120', exit: '3 185', pnl: '+2.08%', pnlPositive: true, time: '5 мин назад' },
  { pair: 'SOL/USDT', type: 'Short', status: 'closed', entry: '149.5', exit: '148.9', pnl: '+0.40%', pnlPositive: true, time: '12 мин назад' },
  { pair: 'BNB/USDT', type: 'Long', status: 'opened', entry: '612', exit: '—', pnl: '+0.82%', pnlPositive: true, time: '15 мин назад' },
  { pair: 'XRP/USDT', type: 'Long', status: 'closed', entry: '0.5820', exit: '0.5895', pnl: '+1.29%', pnlPositive: true, time: '22 мин назад' },
  { pair: 'ADA/USDT', type: 'Short', status: 'closed', entry: '0.452', exit: '0.455', pnl: '-0.66%', pnlPositive: false, time: '28 мин назад' },
  { pair: 'BTC/USDT', type: 'Long', status: 'closed', entry: '63 800', exit: '64 450', pnl: '+1.02%', pnlPositive: true, time: '35 мин назад' },
  { pair: 'AVAX/USDT', type: 'Long', status: 'opened', entry: '28.5', exit: '—', pnl: '+1.75%', pnlPositive: true, time: '41 мин назад' },
  { pair: 'ETH/USDT', type: 'Long', status: 'closed', entry: '3 095', exit: '3 140', pnl: '+1.45%', pnlPositive: true, time: '48 мин назад' },
  { pair: 'DOT/USDT', type: 'Short', status: 'closed', entry: '4.82', exit: '4.78', pnl: '+0.83%', pnlPositive: true, time: '55 мин назад' },
];

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  initials: string;
  color: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Алексей М.',
    role: 'Криптотрейдер, 3 года',
    text: 'Использую Grid Bot на Binance уже 4 месяца. Стабильный доход в боковике, который раньше просто сливал депо. Лучше, чем торговать руками.',
    initials: 'АМ',
    color: 'primary',
  },
  {
    name: 'Мария К.',
    role: 'Инвестор',
    text: 'DCA Bot помогает мне накапливать BTC без стресса. Настроила и забыла — бот делает свою работу. Средняя цена входа реально ниже, чем при разовых покупках.',
    initials: 'МК',
    color: 'secondary',
  },
  {
    name: 'Дмитрий В.',
    role: 'Full-time работа, крипто на стороне',
    text: 'AI Signal Bot торгует, пока я работаю. Не нужно сидеть за графиками. Сигналы адекватные, убыточные сделки есть, но в плюсё за месяц.',
    initials: 'ДВ',
    color: 'accent',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'Нужны ли навыки программирования?',
    answer: 'Нет. Coinsofter — это готовая платформа. Вы регистрируетесь, подключаете API-ключ биржи, выбираете бота и стратегию из шаблонов. Всё настраивается в пару кликов, без единой строчки кода.',
  },
  {
    question: 'Как подключить биржу?',
    answer: 'Зайдите в личный кабинет, выберите биржу (Binance, Bybit, OKX и др.), создайте API-ключ на бирже с правом на торговлю, но БЕЗ права вывода. Скопируйте ключ и секрет в Coinsofter. Подключение занимает 1–2 минуты.',
  },
  {
    question: 'Безопасно ли передавать API-ключи?',
    answer: 'Да. Мы требуем создавать API-ключи без права вывода средств — бот может только торговать, но не выводить ваши активы. Ключи шифруются и хранятся в зашифрованном виде. Мы не имеем доступа к вашим средствам.',
  },
  {
    question: 'Какая минимальная сумма для старта?',
    answer: 'Минимум — $10 на один ордер. Для комфортной торговли рекомендуем стартовать от $200–500. Чем больше капитал, тем гибче настройка сетки и рисков.',
  },
  {
    question: 'Можно ли протестировать без риска?',
    answer: 'Да. У нас есть демо-режим с виртуальными средствами. Вы можете запустить любого бота, проверить стратегию и только потом переходить на реальные деньги.',
  },
  {
    question: 'Как выводится прибыль?',
    answer: 'Все средства остаются на вашей бирже. Бот только торгует — прибыль сразу на вашем балансе. Вы можете вывести её в любой момент через интерфейс биржи. Мы не удерживаем ваши деньги.',
  },
  {
    question: 'Есть ли поддержка на русском?',
    answer: 'Да, поддержка полностью на русском языке. Доступны чат на сайте, Telegram-канал и база знаний с видеоинструкциями. Время ответа — обычно до 1 часа.',
  },
];

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
  cta: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '0',
    period: 'мес',
    description: 'Для начинающих. Бесплатно навсегда.',
    features: [
      '1 активный бот',
      '1 подключённая биржа',
      'Базовые стратегии',
      'Демо-режим',
      'Поддержка в чате',
      'Комиссия 20% с прибыли',
    ],
    highlight: false,
    cta: 'Начать бесплатно',
  },
  {
    name: 'Pro',
    price: '0',
    period: 'мес',
    description: 'Для активных трейдеров. Без абонплаты.',
    features: [
      'До 10 активных ботов',
      'До 5 бирж',
      'Все стратегии + AI Signal',
      'Приоритетная поддержка',
      'Расширенная аналитика',
      'Комиссия 10% с прибыли',
    ],
    highlight: true,
    cta: 'Выбрать Pro',
  },
  {
    name: 'Enterprise',
    price: 'Кастом',
    period: '',
    description: 'Для команд и фондов.',
    features: [
      'Безлимит ботов и бирж',
      'Кастомные стратегии',
      'API доступ',
      'Персональный менеджер',
      'SLA 99.9%',
      'Индивидуальная комиссия',
    ],
    highlight: false,
    cta: 'Связаться с нами',
  },
];

export interface Advantage {
  icon: string;
  title: string;
  description: string;
}

export const advantages: Advantage[] = [
  { icon: 'percent', title: 'Комиссия только с прибыли', description: 'Без абонплаты и скрытых платежей. Платите только когда зарабатываете.' },
  { icon: 'exchange', title: 'Поддержка 10+ бирж', description: 'Binance, Bybit, OKX, BingX, Gate.io, HTX, Bitget, KuCoin, Bitfinex, Kraken.' },
  { icon: 'shield', title: 'Безопасность API-ключей', description: 'Ключи без права вывода, шифрование при хранении и передаче.' },
  { icon: 'clock', title: 'Работа 24/7 без выходных', description: 'Боты торгуют круглосуточно. Вам не нужно следить за графиками.' },
  { icon: 'book', title: 'База знаний и видеоинструкции', description: 'Подробные гайды, обучающие видео и активное сообщество.' },
  { icon: 'gift', title: 'Бонус $5 новым пользователям', description: 'Получите $5 на счёт после регистрации и первой сделки.' },
];

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  { step: '01', title: 'Зарегистрируйтесь', description: '30 секунд — и вы внутри. Без подтверждений и бумаг.', icon: 'user-plus' },
  { step: '02', title: 'Подключите API-ключ', description: 'Создайте ключ на бирже без права вывода и добавьте в Coinsofter.', icon: 'key' },
  { step: '03', title: 'Выберите бота и стратегию', description: 'Grid, DCA или AI Signal — готовые шаблоны под любой рынок.', icon: 'bot' },
  { step: '04', title: 'Бот торгует 24/7', description: 'Вы занимаетесь своими делами, а бот зарабатывает и выводит прибыль.', icon: 'trending-up' },
];

export const supportedExchanges = [
  'Binance', 'Bybit', 'OKX', 'BingX', 'Gate.io', 'HTX', 'Bitget', 'KuCoin', 'Bitfinex', 'EXMO', 'Kraken',
];
