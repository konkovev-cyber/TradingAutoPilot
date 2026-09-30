-- Contact channels editable in the admin panel (site_content "contacts")

INSERT INTO site_content (section, data) VALUES
  ('contacts', '{
    "telegram": "https://t.me/coinsofter",
    "whatsapp": "https://wa.me/79990000000",
    "email": "mailto:info@coinsofter.com",
    "phone": "+7 999 000-00-00"
  }'::jsonb)
ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = now();
