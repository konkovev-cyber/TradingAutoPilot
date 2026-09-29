-- Product-first redesign: localized bot fields, example trades, new sections/content

-- 1. New bot columns: conceptual example trade steps + localized RU/EN overrides
ALTER TABLE bots ADD COLUMN IF NOT EXISTS example_trade jsonb DEFAULT '[]'::jsonb;
ALTER TABLE bots ADD COLUMN IF NOT EXISTS i18n jsonb DEFAULT '{}'::jsonb;

-- 2. Normalize terminology (PUMP DUMP -> SMARTIX) and rewrite copy into safe marketing language
UPDATE bots SET
  name = 'SMARTIX',
  slogan = 'Охотник за аномалиями — точечные сделки по всей бирже',
  short_desc = 'ИИ-робот сканирует всю биржу и находит пары с резкими импульсными движениями цены. Точечные сделки в Short или Long. Никаких усреднений — только точечные входы.',
  full_desc = 'За счёт разработанного алгоритма и встроенных модулей ИИ торговый робот сканирует всю биржу и ищет пары с определёнными закономерностями и импульсными движениями цены. В подходящий момент робот может открыть точечную сделку в Short или Long с автоматическими тейк-профитом и стоп-лоссом. Бот постоянно мониторит биржу и может держать несколько сделок одновременно для диверсификации позиций.',
  badge = 'Охотник за аномалиями',
  strategy = 'Импульсные движения, точечные сделки',
  features = '["Сканирует всю биржу 24/7","Импульсные движения и аномалии через модули ИИ","Только точечные сделки — без усреднений","Автоматические TP и SL в каждой сделке","Несколько сделок одновременно для диверсификации"]'::jsonb,
  how_it_works = '[{"title":"Поиск актива","desc":"Находит актив на бирже и открывает сделку в Short или Long"},{"title":"TP и SL","desc":"Выставляет тейк-профит и стоп-лосс в каждой сделке"},{"title":"Мониторинг","desc":"Дожидается срабатывания условий и продолжает сканирование биржи"}]'::jsonb
WHERE slug = 'smartix';

-- Conceptual example trade steps (explicitly labelled as examples, no fabricated figures)
UPDATE bots SET example_trade = '[{"title":"Условие","desc":"Цена акции отклоняется от среднего уровня сильнее обычного"},{"title":"Вход","desc":"Бот выставляет лимитные ордера на открытие Long или Short"},{"title":"Пересчёт","desc":"Лимитные ордера автоматически пересчитываются вслед за ценой"},{"title":"Закрытие","desc":"При нормализации цены сделки закрываются на обоих рынках"}]'::jsonb
WHERE slug = 'cryptosuperstock' AND example_trade = '[]'::jsonb;

UPDATE bots SET example_trade = '[{"title":"Отбор пар","desc":"ИИ выбирает торгуемые пары и параметры под текущий рынок"},{"title":"Слоты сетки","desc":"Робот открывает независимые слоты — каждый лот отдельная сделка"},{"title":"TP и SL","desc":"Для каждого слота выставляются свои тейк-профит и стоп-лосс"},{"title":"Мониторинг","desc":"Слоты закрываются по своим условиям, робот открывает новые"}]'::jsonb
WHERE slug = 'megagrid-ai' AND example_trade = '[]'::jsonb;

UPDATE bots SET example_trade = '[{"title":"Сканирование","desc":"Робот ищет на бирже пары с резкими импульсными движениями"},{"title":"Сигнал","desc":"Найдено совпадение с закономерностями алгоритма"},{"title":"Вход","desc":"Открывается точечная сделка в Long или Short"},{"title":"TP и SL","desc":"Выставляются тейк-профит и стоп-лосс, усреднения нет"},{"title":"Закрытие","desc":"Сделка закрывается по одному из условий, робот продолжает мониторинг"}]'::jsonb
WHERE slug = 'smartix' AND example_trade = '[]'::jsonb;

-- English overrides for the three production bots
UPDATE bots SET i18n = jsonb_set(COALESCE(i18n, '{}'::jsonb), '{en}', '{
  "name": "CryptoSuperStock",
  "slogan": "Trade international markets and stocks in one bot",
  "shortDesc": "Hybrid bot: stocks of international companies and crypto pairs on BYBIT at the same time. Long and Short on two markets — stock stability plus crypto dynamics.",
  "fullDesc": "The strategy is built on mean reversion: stocks often show significant deviations from the average level followed by normalization. The bot reacts to these deviations and continuously recalculates limit orders to open trades. The hybrid approach lets it trade many movements dynamically, opening Long and Short trades on two markets at once — risks are offset by stable quotes of international stocks, while crypto volatility provides the dynamics.",
  "badge": "Hybrid: stocks + crypto",
  "market": "Stocks + Crypto",
  "strategy": "Mean reversion",
  "risk": "Balanced: stable stocks offset crypto volatility",
  "pairs": "AAPL, TSLA, NVDA, BTC/USDT, ETH/USDT and more"
}'::jsonb, true)
WHERE slug = 'cryptosuperstock';

UPDATE bots SET i18n = jsonb_set(COALESCE(i18n, '{}'::jsonb), '{en}', '{
  "name": "MEGAGRID-AI",
  "slogan": "High-frequency grid strategy — hundreds of trades a day on autopilot",
  "shortDesc": "Not an ordinary grid bot. An independent slot model instead of averaging: mathematical precision, AI picks pairs and parameters itself.",
  "fullDesc": "MEGAGRID does not use the standard position-averaging idea found in most simple grid bots. Instead, it applies an independent slot model: each slot is a separate trade with its own parameters, providing mathematical precision and predictability. AI modules automatically select traded pairs and parameters for the current market.",
  "badge": "Best seller",
  "market": "Crypto",
  "strategy": "Slot grid with AI",
  "risk": "High trade frequency: per-slot risk settings matter",
  "pairs": "Top-50 pairs by volume, selected by AI"
}'::jsonb, true)
WHERE slug = 'megagrid-ai';

UPDATE bots SET i18n = jsonb_set(COALESCE(i18n, '{}'::jsonb), '{en}', '{
  "name": "SMARTIX",
  "slogan": "Anomaly hunter — point trades across the whole exchange",
  "shortDesc": "An AI bot scans the entire exchange and finds pairs with sharp impulse price moves. Point trades in Short or Long. No averaging — point entries only.",
  "fullDesc": "Using a purpose-built algorithm and built-in AI modules, the trading bot scans the whole exchange looking for pairs with specific patterns and impulse price moves. At the right moment, the bot can open a point trade in Short or Long with automatic take-profit and stop-loss. The bot monitors the exchange around the clock and can hold several trades at once for position diversification.",
  "badge": "Anomaly hunter",
  "market": "Crypto",
  "strategy": "Impulse moves, point trades",
  "risk": "Elevated volatility: stop-loss required by risk-management rules",
  "pairs": "The whole exchange — filtered by patterns"
}'::jsonb, true)
WHERE slug = 'smartix';

-- 3. Homepage sections: product-first order, Calculator/FAQ/Lead become optional blocks
UPDATE site_sections SET enabled = false, position = 8 WHERE key = 'faq';
UPDATE site_sections SET enabled = false, position = 9 WHERE key = 'calculator';
UPDATE site_sections SET enabled = false, position = 10 WHERE key = 'lead';
UPDATE site_sections SET position = 2, title = 'Островок доверия' WHERE key = 'trust';
UPDATE site_sections SET enabled = true, position = 6 WHERE key = 'cta';

INSERT INTO site_sections (key, title, enabled, position) VALUES
  ('why', 'Почему роботы не взаимозаменяемы', true, 3),
  ('choose', 'Как выбрать робота (сравнение)', true, 5),
  ('connect', 'Подключение и безопасность', true, 6)
ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, enabled = EXCLUDED.enabled, position = EXCLUDED.position;

DELETE FROM site_sections WHERE key IN ('how', 'compare');

-- 4. New site content: product-first hero, why, choose, connect, CTA carousel (RU/EN)
INSERT INTO site_content (section, data) VALUES
  ('hero', '{
    "badge": {"ru": "3 специализированных бота · ИИ-торговля 24/7", "en": "3 specialized bots · AI trading 24/7"},
    "title": {"ru": "Три специализированных торговых робота", "en": "Three specialized trading bots"},
    "subtitle": {"ru": "TradingAutoPilot — автоматическая торговля через API биржи 24/7. Три робота с разными подходами: вы управляете своим счётом на бирже, робот торгует по вашему API-ключу без права вывода средств.", "en": "TradingAutoPilot — automated trading through exchange APIs. Three bots with different approaches work 24/7: you stay in control of your exchange account while the bot trades via your API key without withdrawal rights."},
    "primary": {"ru": "Выбрать робота", "en": "Choose a bot"},
    "secondary": {"ru": "Как это работает", "en": "How it works"},
    "trust1": {"ru": "Без абонплаты, покупка навсегда", "en": "No subscription, buy once"},
    "trust2": {"ru": "API без права вывода", "en": "API without withdrawal rights"},
    "trust3": {"ru": "Настройка за 2 минуты", "en": "Setup in 2 minutes"}
  }'::jsonb),
  ('why', '{
    "title": {"ru": "Почему роботы не взаимозаменяемы", "en": "Why bots are not interchangeable"},
    "subtitle": {"ru": "Выбирайте робота по рынку, частоте сделок и риск-профилю — а не по обещанной доходности.", "en": "Choose a bot by market, trade frequency and risk profile — not by promised returns."},
    "items": [
      {"title": {"ru": "Специализированные стратегии", "en": "Specialized strategies"}, "desc": {"ru": "Каждый робот — самостоятельная торговая система со своей логикой входов и выходов", "en": "Each bot is an independent trading system with its own entry and exit logic"}},
      {"title": {"ru": "Полная автоматизация", "en": "Full automation"}, "desc": {"ru": "Робот следит за рынком и торгует 24/7 — без вашего постоянного участия", "en": "The bot monitors the market and trades 24/7 — without your constant involvement"}},
      {"title": {"ru": "Контроль риска и прозрачность", "en": "Risk control and transparency"}, "desc": {"ru": "Стоп-лосс, настройки риска и понятное описание алгоритма в каждом роботе", "en": "Stop-loss, risk settings and a clear algorithm explanation in every bot"}}
    ]
  }'::jsonb),
  ('choose', '{
    "title": {"ru": "Как выбрать робота", "en": "How to choose a bot"},
    "subtitle": {"ru": "Сравните рынок, стратегию, стиль торговли, частоту и риск — и выберите подходящий профиль.", "en": "Compare market, strategy, trade style, frequency and risk — and pick the right profile."}
  }'::jsonb),
  ('connect', '{
    "title": {"ru": "Подключение и безопасность", "en": "Connection and safety"},
    "subtitle": {"ru": "Подключение к бирже по API занимает пару минут. Ключ создаётся с правом торговли, но без права вывода средств.", "en": "Connecting to an exchange via API takes a couple of minutes. The key is created with trading rights but without withdrawal rights."},
    "steps": [
      {"title": {"ru": "Регистрация", "en": "Registration"}, "desc": {"ru": "Создайте аккаунт за минуту — нужен только email", "en": "Create an account in a minute — all you need is an email"}},
      {"title": {"ru": "Создание API-ключа", "en": "Create an API key"}, "desc": {"ru": "На бирже создайте ключ с правом торговли, но БЕЗ права вывода средств", "en": "On the exchange, create a key with trading rights but WITHOUT withdrawal rights"}},
      {"title": {"ru": "Подключение робота", "en": "Connect the bot"}, "desc": {"ru": "Добавьте ключ в TradingAutoPilot и выберите робота под свой депозит", "en": "Add the key to TradingAutoPilot and pick a bot for your deposit"}},
      {"title": {"ru": "Автоторговля 24/7", "en": "Auto trading 24/7"}, "desc": {"ru": "Робот торгует по вашему ключу, а средства и прибыль остаются на вашей бирже", "en": "The bot trades via your key while funds and profit stay on your exchange"}}
    ],
    "note": {"ru": "API-ключи шифруются и хранятся без права вывода — доступа к вашим средствам у нас нет.", "en": "API keys are encrypted and stored without withdrawal rights — we have no access to your funds."}
  }'::jsonb),
  ('cta', '{
    "title": "Выберите своего торгового робота",
    "subtitle": "Без абонентской платы и комиссий с прибыли — покупаете робота один раз, он торгует для вас круглосуточно.",
    "btn1": "Смотреть роботов",
    "trust": "АПИ-ключи без права вывода. Средства остаются на вашей бирже",
    "carouselTitle": {"ru": "Какой робот вам подходит?", "en": "Which bot fits you?"},
    "carouselSubtitle": {"ru": "Три стратегии — выберите свою и откройте подробное описание", "en": "Three strategies — pick yours and open the detailed description"},
    "contactBtn": {"ru": "Связаться с нами", "en": "Contact us"}
  }'::jsonb)
ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- meta title: project name is TradingAutoPilot in SEO
UPDATE site_content SET data = data || '{
  "title": "Торговые боты для криптобирж и акций | TradingAutoPilot (без подписки)"
}'::jsonb WHERE section = 'meta';
