-- Site sections: order, visibility and titles, manageable from admin panel

CREATE TABLE IF NOT EXISTS site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_sections" ON site_sections;
CREATE POLICY "public_read_site_sections" ON site_sections FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_site_sections" ON site_sections;
CREATE POLICY "admin_write_site_sections" ON site_sections FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Seed sections in the current page order
INSERT INTO site_sections (key, title, enabled, position) VALUES
  ('hero', 'Шапка с графиком (Hero)', true, 1),
  ('products', 'Карточки роботов', true, 2),
  ('compare', 'Сравнение роботов', true, 3),
  ('calculator', 'Калькулятор доходности', true, 4),
  ('how', 'Как это работает', true, 5),
  ('faq', 'Частые вопросы', true, 6),
  ('lead', 'Форма заявки', true, 7),
  ('cta', 'Призыв к действию (CTA)', true, 8)
ON CONFLICT (key) DO NOTHING;

DROP TRIGGER IF EXISTS site_sections_updated_at ON site_sections;
CREATE TRIGGER site_sections_updated_at
  BEFORE UPDATE ON site_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();