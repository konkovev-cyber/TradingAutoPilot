-- Localized SEO meta: convert title/description to {ru, en} objects

UPDATE site_content SET data = jsonb_set(jsonb_set(
  data,
  '{title}',
  '{
    "ru": "Торговые боты для криптобирж и акций | TradingAutoPilot (без подписки)",
    "en": "Trading bots for crypto and stock exchanges | TradingAutoPilot (no subscription)"
  }'::jsonb,
  true),
  '{description}',
  '{
    "ru": "Автоматизируйте торговлю на BYBIT, Binance и фондовых рынках. 3 стратегии: от консервативной до импульсной. Подключение по API за 2 минуты. Средства остаются на вашей бирже.",
    "en": "Automate trading on BYBIT, Binance and stock markets. 3 strategies from conservative to impulse. API connection in 2 minutes. Funds stay on your exchange."
  }'::jsonb,
  true)
WHERE section = 'meta';
