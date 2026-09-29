-- Reference-style homepage: bot switcher, purpose, advantages, benefits, pricing, conclusion, questions

-- 1. Homepage sections: RevenueBot-style flow; legacy blocks removed
DELETE FROM site_sections WHERE key IN ('how', 'compare', 'choose', 'trust');

UPDATE site_sections SET enabled = true, position = 2, title = 'Список ботов (переключатель)' WHERE key = 'products';
UPDATE site_sections SET enabled = true, position = 3, title = 'Для чего нужны торговые боты' WHERE key = 'why';
UPDATE site_sections SET enabled = true, position = 4, title = 'Подключение и безопасность' WHERE key = 'connect';
UPDATE site_sections SET enabled = true, position = 10, title = 'Просто попробуйте (карусель роботов)' WHERE key = 'cta';

INSERT INTO site_sections (key, title, enabled, position) VALUES
  ('advantages', 'Преимущества использования ботов', true, 5),
  ('benefits', 'Почему стоит выбрать нас', true, 6),
  ('pricing', 'Наши цены', true, 7),
  ('conclusion', 'Заключение', true, 8),
  ('questions', 'Остались вопросы?', true, 9),
  ('tryIt', 'Просто попробуйте (CTA)', true, 10)
ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, enabled = EXCLUDED.enabled, position = EXCLUDED.position;

-- 2. Site content: purpose block, advantages, benefits, pricing, conclusion, questions, final CTA
INSERT INTO site_content (section, data) VALUES
  ('why', '{
    "purposeTitle": {"ru": "Для чего нужны торговые боты?", "en": "What are trading bots for?"},
    "purposeText": {"ru": "Основная цель торговых ботов — автоматизация торговли. Робот анализирует рынок в режиме реального времени, совершает сделки и управляет рисками по заданному алгоритму. Бот выполняет вычисления и обрабатывает данные быстрее человека: следит за десятками пар одновременно, реагирует на изменения рынка за секунды и работает круглосуточно. При этом средства остаются на вашей бирже, а робот торгует по API-ключу без права вывода — вы в любой момент можете остановить торговлю или вывести прибыль.", "en": "The main goal of trading bots is trade automation. The bot analyzes the market in real time, makes trades and manages risk according to its algorithm. It computes and processes data faster than a human: monitors dozens of pairs at once, reacts to market changes in seconds and works around the clock. Your funds stay on your exchange while the bot trades via an API key without withdrawal rights — you can stop trading or withdraw profit at any moment."}
  }'::jsonb),
  ('advantages', '{
    "title": {"ru": "Преимущества использования торговых ботов", "en": "Advantages of using trading bots"},
    "items": [
      {"title": {"ru": "Круглосуточная работа", "en": "Around-the-clock operation"}, "desc": {"ru": "Боты работают 24/7, обеспечивая мониторинг рынка и выполнение сделок, даже когда вы спите или заняты другими делами.", "en": "Bots work 24/7, monitoring the market and executing trades while you sleep or are busy with other things."}},
      {"title": {"ru": "Отсутствие эмоций", "en": "No emotions"}, "desc": {"ru": "Роботы принимают решения на основе алгоритмов и данных, исключая эмоциональные ошибки, которые часто совершают люди.", "en": "Bots make decisions based on algorithms and data, excluding the emotional mistakes people often make."}},
      {"title": {"ru": "Скорость и эффективность", "en": "Speed and efficiency"}, "desc": {"ru": "Боты анализируют и обрабатывают информацию за считанные секунды, обеспечивая быстрый отклик на изменения рынка.", "en": "Bots analyze and process information in seconds, providing a fast response to market changes."}},
      {"title": {"ru": "Автоматизация стратегий", "en": "Strategy automation"}, "desc": {"ru": "Каждый робот автоматизирует свою стратегию, снижая необходимость постоянного мониторинга и вмешательства.", "en": "Each bot automates its own strategy, reducing the need for constant monitoring and intervention."}},
      {"title": {"ru": "Управление рисками", "en": "Risk management"}, "desc": {"ru": "Стоп-лосс, настройки риска на сделку и диверсификация помогают минимизировать потенциальные убытки.", "en": "Stop-loss, per-trade risk settings and diversification help minimize potential losses."}}
    ]
  }'::jsonb),
  ('benefits', '{
    "title": {"ru": "Почему стоит выбрать TradingAutoPilot?", "en": "Why choose TradingAutoPilot?"},
    "subtitle": {"ru": "На крипторынке множество торговых ботов, но TradingAutoPilot выделяется среди них благодаря своим возможностям и условиям.", "en": "There are many trading bots on the market, but TradingAutoPilot stands out with its capabilities and terms."},
    "items": [
      {"tag": {"ru": "Без подписки", "en": "No subscription"}, "title": {"ru": "Без абонентской платы", "en": "No subscription fee"}, "desc": {"ru": "Покупаете робота один раз — без абонентской платы и комиссий с прибыли. Он торгует для вас круглосуточно.", "en": "Buy the bot once — no subscription fee and no profit commission. It trades for you around the clock."}},
      {"tag": {"ru": "Популярные биржи", "en": "Popular exchanges"}, "title": {"ru": "Широкий спектр поддерживаемых бирж", "en": "Wide range of supported exchanges"}, "desc": {"ru": "Работает с популярными биржами: BYBIT, Binance, OKX, BingX, Gate.io, HTX, Bitget, KuCoin, MEXC и другими.", "en": "Works with popular exchanges: BYBIT, Binance, OKX, BingX, Gate.io, HTX, Bitget, KuCoin, MEXC and more."}},
      {"tag": {"ru": "Понятный интерфейс", "en": "Clear interface"}, "title": {"ru": "Удобство и простота использования", "en": "Convenience and simplicity"}, "desc": {"ru": "Понятный интерфейс и готовые шаблоны стратегий делают старт простым для новичков и опытных трейдеров.", "en": "A clear interface and ready-made strategy templates make starting simple for beginners and experienced traders."}},
      {"tag": {"ru": "API-ключи", "en": "API keys"}, "title": {"ru": "Безопасность средств", "en": "Funds safety"}, "desc": {"ru": "API-ключи создаются с правом торговли, но без права вывода — доступа к вашим средствам у нас нет.", "en": "API keys are created with trading rights but without withdrawal rights — we have no access to your funds."}},
      {"tag": {"ru": "Инструкции, советы", "en": "Guides, tips"}, "title": {"ru": "База знаний и FAQ", "en": "Knowledge base and FAQ"}, "desc": {"ru": "База знаний, инструкции и подробные описания алгоритмов каждого робота на детальных страницах.", "en": "A knowledge base, guides and detailed algorithm descriptions on each bot''s detail page."}},
      {"tag": {"ru": "Круглосуточная поддержка", "en": "24/7 support"}, "title": {"ru": "Техническая поддержка", "en": "Technical support"}, "desc": {"ru": "Поддержка в Telegram и WhatsApp — поможем с подключением, настройкой и выбором робота.", "en": "Support on Telegram and WhatsApp — we help with connection, setup and bot selection."}}
    ]
  }'::jsonb),
  ('pricing', '{
    "title": {"ru": "Наши цены", "en": "Our prices"},
    "text1": {"ru": "TradingAutoPilot не берёт абонентскую плату и комиссию за транзакции на криптобиржах. Вы покупаете робота один раз — и он торгует для вас без подписки.", "en": "TradingAutoPilot charges no subscription fee and no commission on exchange transactions. You buy the bot once — and it trades for you without a subscription."},
    "text2": {"ru": "Доходность каждого робота показана на его странице за 30, 90 и 365 дней. Исторические результаты не гарантируют будущих, поэтому все показатели помечены как исторические, а торговля связана с риском.", "en": "Each bot''s page shows returns for 30, 90 and 365 days. Historical results do not guarantee future ones, so all figures are marked as historical and trading involves risk."}
  }'::jsonb),
  ('conclusion', '{
    "title": {"ru": "Заключение", "en": "Conclusion"},
    "text1": {"ru": "Торговые боты становятся неотъемлемой частью успешной торговли на криптовалютном рынке. Они автоматизируют процессы, управляют рисками и обеспечивают круглосуточную работу — три специализированных робота TradingAutoPilot закрывают разные подходы: гибрид акций и крипты, высокочастотную сетку и охоту за импульсами.", "en": "Trading bots are becoming an integral part of successful trading on the crypto market. They automate processes, manage risk and work around the clock — the three specialized TradingAutoPilot bots cover different approaches: a stock-crypto hybrid, a high-frequency grid and impulse hunting."},
    "text2": {"ru": "Выбирая TradingAutoPilot, вы получаете автоматизацию по API без права вывода средств, прозрачное описание каждого алгоритма и поддержку на каждом шаге — от подключения до автоторговли.", "en": "Choosing TradingAutoPilot you get API automation without withdrawal rights, a transparent description of every algorithm and support at every step — from connection to auto trading."}
  }'::jsonb),
  ('questions', '{
    "title": {"ru": "Остались вопросы?", "en": "Any questions left?"},
    "subtitle": {"ru": "Получите бесплатную консультацию: расскажем, как подключить биржу и выбрать робота под ваш депозит.", "en": "Get a free consultation: we will explain how to connect an exchange and pick a bot for your deposit."},
    "btn": {"ru": "Получить консультацию", "en": "Get a consultation"}
  }'::jsonb),
  ('tryIt', '{
    "title": {"ru": "Просто попробуйте!", "en": "Just try it!"},
    "text": {"ru": "С торговыми роботами TradingAutoPilot ваш робот торгует на любимых биржах автоматически. Подключите API-ключ, выберите робота — остальное сделает алгоритм.", "en": "With TradingAutoPilot trading bots, your bot trades on your favorite exchanges automatically. Connect an API key, pick a bot — the algorithm does the rest."},
    "bullet1": {"ru": "Без абонентской платы", "en": "No subscription fee"},
    "bullet2": {"ru": "Покупаете робота один раз", "en": "Buy the bot once"},
    "btn": {"ru": "Начать зарабатывать", "en": "Start earning"}
  }'::jsonb)
ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- cta section: only carousel contact + trust strings remain in use
UPDATE site_content SET data = data - 'title' - 'subtitle' - 'btn1' - 'btn2' - 'carouselTitle' - 'carouselSubtitle' WHERE section = 'cta';
