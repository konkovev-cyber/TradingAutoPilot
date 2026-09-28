/*
# Create site_content table for admin-editable content

1. New Tables
- site_content: stores editable site content as JSON per section
  - id (uuid, primary key)
  - section (text, unique) — e.g. "hero", "cta", "stats"
  - data (jsonb) — the content for that section
  - updated_at (timestamptz, auto-updated via trigger)

2. Security
- RLS enabled
- SELECT: public (anon + authenticated) — the public site reads content
- INSERT/UPDATE/DELETE: admins only (is_admin())

3. Seed Data
- Initial content for hero, cta, stats, exchanges, advantages,
  how_it_works, testimonials, pricing, faq sections
*/

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text UNIQUE NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_content" ON site_content;
CREATE POLICY "public_read_site_content"
ON site_content FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_content" ON site_content;
CREATE POLICY "auth_insert_site_content"
ON site_content FOR INSERT
TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "auth_update_site_content" ON site_content;
CREATE POLICY "auth_update_site_content"
ON site_content FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "auth_delete_site_content" ON site_content;
CREATE POLICY "auth_delete_site_content"
ON site_content FOR DELETE
TO authenticated USING (is_admin());

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_content_updated_at ON site_content;
CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed initial content
INSERT INTO site_content (section, data) VALUES
  ('hero', '{
    "title": "Торговые боты для криптобирж. Прибыль 24/7 без вашего участия",
    "description": "Coinsofter автоматизирует торговлю на Binance, Bybit, OKX и других биржах. Без абонплаты. Комиссия только с прибыли. Подключение за 2 минуты.",
    "primary_cta": "Создать бота бесплатно",
    "secondary_cta": "Посмотреть демо",
    "earned_label": "Уже заработано пользователями"
  }'::jsonb),
  ('cta', '{
    "title": "Начните зарабатывать на крипте уже сегодня",
    "subtitle": "Без вложений. Комиссия только с прибыли. Подключение за 2 минуты — и бот работает 24/7.",
    "button": "Создать бота бесплатно"
  }'::jsonb),
  ('stats', '{
    "users": "12400+",
    "users_label": "Активных пользователей",
    "volume": "$58M+",
    "volume_label": "Объём торгов",
    "uptime": "99.9%",
    "uptime_label": "Uptime"
  }'::jsonb),
  ('exchanges', '["Binance","Bybit","OKX","BingX","Gate.io","HTX","Bitget","KuCoin","Bitfinex","EXMO","Kraken"]'::jsonb),
  ('advantages', '[
      {"icon":"percent","title":"Комиссия только с прибыли","description":"Без абонплаты и скрытых платежей. Платите только когда зарабатываете."},
      {"icon":"exchange","title":"Поддержка 10+ бирж","description":"Binance, Bybit, OKX, BingX, Gate.io, HTX, Bitget, KuCoin, Bitfinex, Kraken."},
      {"icon":"shield","title":"Безопасность API-ключей","description":"Ключи без права вывода, шифрование при хранении и передаче."},
      {"icon":"clock","title":"Работа 24/7 без выходных","description":"Боты торгуют круглосуточно. Вам не нужно следить за графиками."},
      {"icon":"book","title":"База знаний и видеоинструкции","description":"Подробные гайды, обучающие видео и активное сообщество."},
      {"icon":"gift","title":"Бонус $5 новым пользователям","description":"Получите $5 на счёт после регистрации и первой сделки."}
    ]'::jsonb),
  ('how_it_works', '[
      {"step":"01","title":"Зарегистрируйтесь","description":"30 секунд — и вы внутри. Без подтверждений и бумаг.","icon":"user-plus"},
      {"step":"02","title":"Подключите API-ключ","description":"Создайте ключ на бирже без права вывода и добавьте в Coinsofter.","icon":"key"},
      {"step":"03","title":"Выберите бота и стратегию","description":"Grid, DCA или AI Signal — готовые шаблоны под любой рынок.","icon":"bot"},
      {"step":"04","title":"Бот торгует 24/7","description":"Вы занимаетесь своими делами, а бот зарабатывает и выводит прибыль.","icon":"trending-up"}
    ]'::jsonb),
  ('testimonials', '[
      {"name":"Алексей М.","role":"Криптотрейдер, 3 года","text":"Использую Grid Bot на Binance уже 4 месяца. Стабильный доход в боковике, который раньше просто сливал депо. Лучше, чем торговать руками.","initials":"АМ","color":"primary"},
      {"name":"Мария К.","role":"Инвестор","text":"DCA Bot помогает мне накапливать BTC без стресса. Настроила и забыла — бот делает свою работу. Средняя цена входа реально ниже, чем при разовых покупках.","initials":"МК","color":"secondary"},
      {"name":"Дмитрий В.","role":"Full-time работа, крипто на стороне","text":"AI Signal Bot торгует, пока я работаю. Не нужно сидеть за графиками. Сигналы адекватные, убыточные сделки есть, но в плюсё за месяц.","initials":"ДВ","color":"accent"}
    ]'::jsonb),
  ('pricing', '[
      {"name":"Starter","price":"0","period":"мес","description":"Для начинающих. Бесплатно навсегда.","features":["1 активный бот","1 подключённая биржа","Базовые стратегии","Демо-режим","Поддержка в чате","Комиссия 20% с прибыли"],"highlight":false,"cta":"Начать бесплатно"},
      {"name":"Pro","price":"0","period":"мес","description":"Для активных трейдеров. Без абонплаты.","features":["До 10 активных ботов","До 5 бирж","Все стратегии + AI Signal","Приоритетная поддержка","Расширенная аналитика","Комиссия 10% с прибыли"],"highlight":true,"cta":"Выбрать Pro"},
      {"name":"Enterprise","price":"Кастом","period":"","description":"Для команд и фондов.","features":["Безлимит ботов и бирж","Кастомные стратегии","API доступ","Персональный менеджер","SLA 99.9%","Индивидуальная комиссия"],"highlight":false,"cta":"Связаться с нами"}
    ]'::jsonb),
  ('faq', '[
      {"question":"Нужны ли навыки программирования?","answer":"Нет. Coinsofter — это готовая платформа. Вы регистрируетесь, подключаете API-ключ биржи, выбираете бота и стратегию из шаблонов. Всё настраивается в пару кликов, без единой строчки кода."},
      {"question":"Как подключить биржу?","answer":"Зайдите в личный кабинет, выберите биржу (Binance, Bybit, OKX и др.), создайте API-ключ на бирже с правом на торговлю, но БЕЗ права вывода. Скопируйте ключ и секрет в Coinsofter. Подключение занимает 1-2 минуты."},
      {"question":"Безопасно ли передавать API-ключи?","answer":"Да. Мы требуем создавать API-ключи без права вывода средств — бот может только торговать, но не выводить ваши активы. Ключи шифруются и хранятся в зашифрованном виде. Мы не имеем доступа к вашим средствам."},
      {"question":"Какая минимальная сумма для старта?","answer":"Минимум — $10 на один ордер. Для комфортной торговли рекомендуем стартовать от $200-500. Чем больше капитал, тем гибче настройка сетки и рисков."},
      {"question":"Можно ли протестировать без риска?","answer":"Да. У нас есть демо-режим с виртуальными средствами. Вы можете запустить любого бота, проверить стратегию и только потом переходить на реальные деньги."},
      {"question":"Как выводится прибыль?","answer":"Все средства остаются на вашей бирже. Бот только торгует — прибыль сразу на вашем балансе. Вы можете вывести её в любой момент через интерфейс биржи. Мы не удерживаем ваши деньги."},
      {"question":"Есть ли поддержка на русском?","answer":"Да, поддержка полностью на русском языке. Доступны чат на сайте, Telegram-канал и база знаний с видеоинструкциями. Время ответа — обычно до 1 часа."}
    ]'::jsonb)
ON CONFLICT (section) DO NOTHING;