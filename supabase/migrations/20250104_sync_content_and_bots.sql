-- Sync site_content to current site structure + bots table + page views + storage

-- Remove stale sections from an older site version
DELETE FROM site_content WHERE section IN ('exchanges', 'advantages', 'how_it_works', 'testimonials', 'pricing');

-- Sections the public site consumes
INSERT INTO site_content (section, data) VALUES
  ('meta', '{
    "title": "Coinsofter \u2014 Торговые роботы для крипты и акций",
    "description": "Coinsofter \u2014 интеллектуальные торговые роботы для криптовалют и акций. Автоматическая торговля 24/7 через API."
  }'::jsonb),
  ('hero', '{
    "badge": "Торговые роботы с ИИ для любых бирж",
    "title1": "Торгуйте на крипторынке",
    "title2": "с помощью роботов",
    "subtitle": "Боты работают на любых криптобиржах через API. Алгоритмы с искусственным интеллектом находят сделки и торгуют автоматически 24 часа в сутки.",
    "pick": "Выбрать робота",
    "cta2": "Как это работает"
  }'::jsonb),
  ('cta', '{
    "title": "Выберите своего торгового робота",
    "subtitle": "Без абонентской платы и комиссий с прибыли \u2014 покупаете робота один раз, он торгует для вас круглосуточно.",
    "btn1": "Смотреть роботов",
    "btn2": "Вопросы и ответы",
    "trust": "АПИ-ключи без права вывода. Средства остаются на вашей бирже"
  }'::jsonb),
  ('nav', '{
    "bots": "Роботы",
    "how": "Как работает",
    "faq": "FAQ"
  }'::jsonb)
ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = now();

-- Bots table for the Bots manager
CREATE TABLE IF NOT EXISTS bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  slogan text,
  short_desc text,
  full_desc text,
  badge text,
  market text,
  strategy text,
  risk text,
  pairs text,
  color text DEFAULT '#3b82f6',
  image_url text,
  returns jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_bots" ON bots;
CREATE POLICY "public_read_bots" ON bots FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_bots" ON bots;
CREATE POLICY "admin_write_bots" ON bots FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Page views counter
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL DEFAULT '/',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_page_views" ON page_views;
CREATE POLICY "public_insert_page_views" ON page_views FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_page_views" ON page_views;
CREATE POLICY "admin_read_page_views" ON page_views FOR SELECT TO authenticated USING (is_admin());

-- Public storage bucket for bot images
INSERT INTO storage.buckets (id, name, public)
VALUES ('bot-images', 'bot-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_bot_images" ON storage.objects;
CREATE POLICY "public_read_bot_images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'bot-images');

DROP POLICY IF EXISTS "admin_upload_bot_images" ON storage.objects;
CREATE POLICY "admin_upload_bot_images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'bot-images');