-- Full reference-style flow: fix section positions, final slider copy

-- 1. Fix positions after 20250113 (cta/tryIt shared position 10)
UPDATE site_sections SET position = 2 WHERE key = 'products';
UPDATE site_sections SET position = 3 WHERE key = 'why';
UPDATE site_sections SET position = 4 WHERE key = 'connect';
UPDATE site_sections SET position = 5 WHERE key = 'advantages';
UPDATE site_sections SET position = 6 WHERE key = 'benefits';
UPDATE site_sections SET position = 7 WHERE key = 'pricing';
UPDATE site_sections SET position = 8 WHERE key = 'conclusion';
UPDATE site_sections SET position = 9 WHERE key = 'questions';
UPDATE site_sections SET position = 10 WHERE key = 'cta';
UPDATE site_sections SET position = 11 WHERE key = 'tryIt';

INSERT INTO site_sections (key, title, enabled, position) VALUES
  ('cta', 'Понравился наш робот? (слайдер)', true, 10)
ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

-- the final slider renders via the "cta" key; drop the duplicate row
DELETE FROM site_sections WHERE key = 'tryIt';

-- faq/calculator/lead stay out of the main landing flow
UPDATE site_sections SET enabled = false WHERE key IN ('faq', 'calculator', 'lead');

-- 2. Final slider copy: "Понравился наш робот? Выберите подходящий"
UPDATE site_content SET data = data || '{
  "title": {"ru": "Понравился наш робот? Выберите подходящий", "en": "Liked our bot? Pick the right one"},
  "subtitle": {"ru": "Листайте слайды — каждый ведёт на подробное описание робота.", "en": "Flip through the slides — each one leads to the bot''s detailed description."},
  "btn": {"ru": "Смотреть роботов", "en": "View bots"}
}'::jsonb WHERE section = 'tryIt';
