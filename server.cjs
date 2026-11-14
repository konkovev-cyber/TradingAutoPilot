const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Database connection
const connectionString = process.env.DATABASE_URL;
let pool = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : (process.env.PGSSLMODE === 'disable' ? false : undefined),
    connectionTimeoutMillis: 5000,
  });
  console.log('[DB] Connecting to PostgreSQL via DATABASE_URL...');
} else {
  console.warn('[DB] DATABASE_URL not set, running in memory-fallback mode');
}

let DEFAULT_SITE_CONTENT = {};
try {
  DEFAULT_SITE_CONTENT = require('./default-site-content.cjs').DEFAULT_SITE_CONTENT || {};
} catch (e) {
  console.warn('[Server] Could not load default-site-content.cjs:', e.message);
}

// In-memory fallback if DB is temporarily unreachable
const memoryStore = {
  leads: [],
  pageViews: [],
  bots: [],
  siteContent: { ...DEFAULT_SITE_CONTENT },
  siteSections: [],
};

// Initialize DB schema on startup
async function initDb() {
  if (!pool) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          name TEXT,
          contact TEXT NOT NULL,
          bot TEXT,
          budget TEXT,
          message TEXT,
          status TEXT DEFAULT 'new',
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT;
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget TEXT;
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT;

        CREATE TABLE IF NOT EXISTS bots (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE,
          name TEXT NOT NULL,
          slogan TEXT,
          short_desc TEXT,
          full_desc TEXT,
          badge TEXT,
          market TEXT,
          strategy TEXT,
          risk TEXT,
          pairs TEXT,
          color TEXT,
          image_url TEXT,
          difficulty TEXT,
          difficulty_tone TEXT,
          features JSONB,
          returns JSONB,
          how_it_works JSONB,
          example_trade JSONB,
          i18n JSONB,
          position INT DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        -- Add columns if upgrading from old schema
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS slogan TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS short_desc TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS full_desc TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS market TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS strategy TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS risk TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS pairs TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS image_url TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS difficulty TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS difficulty_tone TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS features JSONB;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS returns JSONB;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS how_it_works JSONB;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS example_trade JSONB;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS suitable_for TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS exchanges TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS in_development BOOLEAN DEFAULT FALSE;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS avatar_url TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS avatar_dark_url TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS i18n JSONB;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS meta_title TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS meta_description TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS og_image TEXT;
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

        CREATE TABLE IF NOT EXISTS site_content (
          key TEXT PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS site_sections (
          key TEXT PRIMARY KEY,
          title TEXT,
          enabled BOOLEAN DEFAULT true,
          position INT DEFAULT 0
        );
        ALTER TABLE site_sections ADD COLUMN IF NOT EXISTS title TEXT;

        CREATE TABLE IF NOT EXISTS page_views (
          id SERIAL PRIMARY KEY,
          path TEXT,
          referrer TEXT,
          user_agent TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Seed default admin: konkev@bk.ru / admin2026!
      const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'konkev@bk.ru').toLowerCase();
      const defaultAdminPass = process.env.ADMIN_PASSWORD || 'admin2026!';
      const hash = crypto.createHash('sha256').update(defaultAdminPass).digest('hex');

      await client.query(`
        INSERT INTO admin_users (email, password_hash, role)
        VALUES ($1, $2, 'admin')
        ON CONFLICT (email) DO UPDATE SET password_hash = $2;
      `, [defaultAdminEmail, hash]);

      // Seed second admin: coinsoft / coin2026!
      const coinHash = crypto.createHash('sha256').update('coin2026!').digest('hex');
      await client.query(`
        INSERT INTO admin_users (email, password_hash, role)
        VALUES ($1, $2, 'admin')
        ON CONFLICT (email) DO UPDATE SET password_hash = $2;
      `, ['coinsoft', coinHash]);

      console.log(`[DB] Schema initialized. Admin users configured.`);

      // Seed default bots if table is empty
      const botsCount = await client.query('SELECT COUNT(*) FROM bots');
      if (parseInt(botsCount.rows[0].count, 10) === 0) {
        const defaultBots = [
          {
            id: 'synchrobot',
            slug: 'synchrobot',
            name: 'SynchroBot',
            slogan: 'Меньше ручного анализа — больше данных для принятия торговых решений',
            short_desc: 'Интеллектуальный криптотрейдинговый бот, который анализирует рынок в режиме реального времени, отслеживает изменения объёмов и цены по множеству торговых пар и выявляет потенциальные возможности для LONG и SHORT.',
            full_desc: 'SynchroTrade Bot — интеллектуальный криптотрейдинговый бот, который анализирует рынок в режиме реального времени, отслеживает изменения объёмов и цены по множеству торговых пар и выявляет потенциальные возможности для LONG и SHORT.',
            badge: 'Анализ объёмов и цен',
            market: 'Крипта',
            strategy: 'Анализ объёмов и цен в реальном времени',
            risk: 'Контролируемый: математический расчёт точек входа и встроенный риск-менеджмент',
            pairs: 'BTC/USDT, ETH/USDT, SOL/USDT, Bybit, BingX, OKX и др.',
            color: '#00FFB2',
            image_url: '/synchro-bot.jpg',
            difficulty: 'Для новичков и профи',
            difficulty_tone: 'starter',
            suitable_for: 'хочет автоматизировать поиск торговых возможностей и анализировать большое количество рынков',
            exchanges: 'BYBIT, BINGX, OKX',
            features: JSON.stringify(['Анализ рынка в режиме реального времени', 'Отслеживание изменений объёмов и цены по множеству торговых пар', 'Поиск возможностей для сделок в LONG и SHORT', 'Оценка рыночной ситуации и определение точных точек входа', 'Контроль рисков и сокращение рутинного анализа трейдера']),
            returns: JSON.stringify([{ period: '30 дней', value: '+7.9%' }, { period: '90 дней', value: '+22.8%' }, { period: '365 дней', value: '+78.4%' }]),
            how_it_works: JSON.stringify([{ title: 'Мониторинг рынка в реальном времени', desc: 'Бот непрерывно сканирует поток котировок и изменения объёмов по множеству торговых пар' }, { title: 'Поиск возможностей LONG & SHORT', desc: 'Алгоритмы выявляют ценовые дисбалансы и подтверждённые импульсы для входа в сделку' }, { title: 'Контроль рисков', desc: 'Автоматический расчёт точек входа, выставление стоп-лоссов и защита капитала' }]),
            example_trade: JSON.stringify([{ title: 'Всплеск объёма', desc: 'Бот фиксирует синхронный рост объёма и ценовое движение на паре' }, { title: 'Вход в сделку', desc: 'Алгоритм вычисляет оптимальную точку входа и открывает позицию в LONG или SHORT' }, { title: 'Сопровождение', desc: 'Динамический контроль рисков и сопровождение позиции по заданным параметрам' }, { title: 'Фиксация прибыли', desc: 'Сделка закрывается по тейк-профиту с защитой накопленной прибыли' }]),
            i18n: JSON.stringify({ en: { name: 'SynchroBot', slogan: 'Less manual analysis — more actionable data for smart trading decisions', badge: 'Volume & Price AI', market: 'Crypto', strategy: 'Real-time volume & price analysis', risk: 'Controlled: mathematical entry calculation and built-in risk management', pairs: 'BTC/USDT, ETH/USDT, SOL/USDT, Bybit, BingX, OKX & more', suitable_for: 'who want to automate trade opportunity discovery and analyze a large number of markets', exchanges: 'BYBIT, BINGX, OKX' } }),
            position: 1,
          },
          {
            id: 'megagrid-ai',
            slug: 'megagrid-ai',
            name: 'MEGAGRID-AI',
            slogan: 'Высокочастотная сеточная стратегия — сотни сделок в день на автомате',
            short_desc: 'Не обычный grid-бот. Послотная независимая модель вместо усреднения: математическая точность, ИИ сам подбирает пары и параметры.',
            full_desc: 'MEGAGRID не использует стандартную идею усреднения позиции, как большинство простых грид-ботов. Вместо этого применяется послотовая независимая модель: каждый лот — отдельная сделка со своими параметрами.',
            badge: 'ХИТ продаж',
            market: 'Крипта',
            strategy: 'Послотная сетка с ИИ',
            risk: 'Высокая частота сделок: важна настройка риска на лот',
            pairs: 'Топ-50 пар по объёму, подбор через ИИ',
            color: '#FF4D6A',
            image_url: null,
            difficulty: 'Для продвинутых',
            difficulty_tone: 'advanced',
            features: JSON.stringify(['Высокочастотная сетка: сотни сделок в день на автомате', 'Послотная независимая модель — без усреднения', 'Математическая точность и предсказуемость', 'ИИ автоматически подбирает пары и параметры', 'Адаптация параметров под волатильность']),
            returns: JSON.stringify([{ period: '30 дней', value: '+9.1%' }, { period: '90 дней', value: '+27.6%' }, { period: '365 дней', value: '+96.4%' }]),
            how_it_works: JSON.stringify([{ title: 'ИИ подбирает пары', desc: 'Модули ИИ автоматически выбирают торгуемые пары и параметры' }, { title: 'Послотная модель', desc: 'Каждый лот независим — математическая точность вместо усреднения' }, { title: 'Сотни сделок в день', desc: 'Робот совершает сотни сделок в день без вашего участия' }]),
            example_trade: JSON.stringify([{ title: 'Отбор пар', desc: 'ИИ выбирает торгуемые пары и параметры под текущий рынок' }, { title: 'Слоты сетки', desc: 'Робот открывает независимые слоты — каждый лот отдельная сделка' }, { title: 'TP и SL', desc: 'Для каждого слота выставляются свои тейк-профит и стоп-лосс' }, { title: 'Мониторинг', desc: 'Слоты закрываются по своим условиям, робот открывает новые' }]),
            i18n: JSON.stringify({ en: { name: 'MEGAGRID-AI', slogan: 'High-frequency grid strategy — hundreds of trades a day on autopilot', badge: 'Best seller', market: 'Crypto', strategy: 'Slot grid with AI', risk: 'High trade frequency: per-slot risk settings matter', pairs: 'Top-50 pairs by volume, selected by AI' } }),
            position: 2,
          },
          {
            id: 'smartix',
            slug: 'smartix',
            name: 'SMARTIX',
            slogan: 'Охотник за аномалиями — точечные сделки по всей бирже',
            short_desc: 'ИИ-робот сканирует всю биржу и находит пары с резкими импульсными движениями цены. Точечные сделки в Short или Long. Никаких усреднений — только точечные входы.',
            full_desc: 'За счёт разработанного алгоритма и встроенных модулей ИИ торговый робот сканирует всю биржу и ищет пары с определёнными закономерностями и импульсными движениями цены.',
            badge: 'Охотник за аномалиями',
            market: 'Крипта',
            strategy: 'Импульсные движения, точечные сделки',
            risk: 'Повышенная волатильность: обязательны SL по правилам риск-менеджмента',
            pairs: 'Вся биржа — отбор по закономерностям',
            color: '#7B61FF',
            image_url: null,
            difficulty: 'Высокий риск / высокая награда',
            difficulty_tone: 'aggressive',
            features: JSON.stringify(['Сканирует всю биржу 24/7', 'Импульсные движения и аномалии через модули ИИ', 'Только точечные сделки — без усреднений', 'Автоматические TP и SL в каждой сделке', 'Несколько сделок одновременно для диверсификации']),
            returns: JSON.stringify([{ period: '30 дней', value: '+11.3%' }, { period: '90 дней', value: '+33.8%' }, { period: '365 дней', value: '+118.2%' }]),
            how_it_works: JSON.stringify([{ title: 'Поиск актива', desc: 'Находит актив на бирже и открывает сделку в Short или Long' }, { title: 'TP и SL', desc: 'Выставляет тейк-профит и стоп-лосс в каждой сделке' }, { title: 'Мониторинг', desc: 'Дожидается срабатывания условий и продолжает сканирование биржи' }]),
            example_trade: JSON.stringify([{ title: 'Сканирование', desc: 'Робот ищет на бирже пары с резкими импульсными движениями' }, { title: 'Сигнал', desc: 'Найдено совпадение с закономерностями алгоритма' }, { title: 'Вход', desc: 'Открывается точечная сделка в Long или Short' }, { title: 'TP и SL', desc: 'Выставляются тейк-профит и стоп-лосс, усреднения нет' }, { title: 'Закрытие', desc: 'Сделка закрывается по одному из условий, робот продолжает мониторинг' }]),
            i18n: JSON.stringify({ en: { name: 'SMARTIX', slogan: 'Anomaly hunter — point trades across the whole exchange', badge: 'Anomaly hunter', market: 'Crypto', strategy: 'Impulse moves, point trades', risk: 'Elevated volatility: stop-loss required by risk-management rules', pairs: 'The whole exchange — filtered by patterns' } }),
            position: 3,
          },
        ];

        for (const b of defaultBots) {
          await client.query(`
            INSERT INTO bots (id, slug, name, slogan, short_desc, full_desc, badge, market, strategy, risk, pairs, color, image_url, difficulty, difficulty_tone, features, returns, how_it_works, example_trade, i18n, position, suitable_for, exchanges)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
            ON CONFLICT (id) DO NOTHING;
          `, [b.id, b.slug, b.name, b.slogan, b.short_desc, b.full_desc, b.badge, b.market, b.strategy, b.risk, b.pairs, b.color, b.image_url, b.difficulty, b.difficulty_tone, b.features, b.returns, b.how_it_works, b.example_trade, b.i18n, b.position, b.suitable_for ?? null, b.exchanges ?? null]);
        }
        console.log('[DB] Default bots seeded.');
      }

      // Seed site_content if empty or missing default sections
      try {
        const scCount = await client.query('SELECT COUNT(*) FROM site_content');
        if (parseInt(scCount.rows[0].count, 10) < Object.keys(DEFAULT_SITE_CONTENT).length) {
          console.log('[DB] Seeding default site_content...');
          for (const [k, v] of Object.entries(DEFAULT_SITE_CONTENT)) {
            await client.query(`
              INSERT INTO site_content (key, value, updated_at)
              VALUES ($1, $2, NOW())
              ON CONFLICT (key) DO NOTHING;
            `, [k, JSON.stringify(v)]);
          }
          console.log('[DB] Default site_content seeded successfully.');
        }

        // Seed site_sections if table is empty
        const secCount = await client.query('SELECT COUNT(*) FROM site_sections');
        if (parseInt(secCount.rows[0].count, 10) === 0) {
          console.log('[DB] Seeding default site_sections...');
          const DEFAULT_SECTIONS = [
            { key: "hero", title: "Шапка с графиком (Hero)", enabled: true, position: 1 },
            { key: "products", title: "Наши разработки (3 бота)", enabled: true, position: 2 },
            { key: "why", title: "Для чего нужны торговые боты", enabled: true, position: 3 },
            { key: "connect", title: "Подключение и безопасность", enabled: true, position: 4 },
            { key: "advantages", title: "Преимущества использования ботов", enabled: true, position: 5 },
            { key: "benefits", title: "Почему стоит выбрать нас", enabled: true, position: 6 },
            { key: "pricing", title: "Наши цены", enabled: true, position: 7 },
            { key: "conclusion", title: "Заключение", enabled: true, position: 8 },
            { key: "questions", title: "Остались вопросы?", enabled: true, position: 9 },
            { key: "faq", title: "Частые вопросы", enabled: false, position: 10 },
            { key: "calculator", title: "Калькулятор доходности", enabled: false, position: 11 },
            { key: "lead", title: "Форма заявки", enabled: false, position: 12 },
          ];
          for (const s of DEFAULT_SECTIONS) {
            await client.query(`
              INSERT INTO site_sections (key, title, enabled, position)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT (key) DO NOTHING;
            `, [s.key, s.title, s.enabled, s.position]);
          }
          console.log('[DB] Default site_sections seeded.');
        }
      } catch (err) {
        console.error('[DB] seed error:', err.message);
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[DB] Error initializing schema:', err.message);
  }
}

initDb();

// Simple auth helper
function hashPassword(p) {
  return crypto.createHash('sha256').update(p).digest('hex');
}

function generateToken(email) {
  const payload = JSON.stringify({ email, exp: Date.now() + 7 * 24 * 3600 * 1000 });
  const signature = crypto.createHmac('sha256', process.env.JWT_SECRET || 'tap-secret-key-2026').update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  try {
    const payloadStr = Buffer.from(parts[0], 'base64').toString('utf-8');
    const expectedSig = crypto.createHmac('sha256', process.env.JWT_SECRET || 'tap-secret-key-2026').update(payloadStr).digest('hex');
    if (parts[1] !== expectedSig) return null;
    const payload = JSON.parse(payloadStr);
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// ─────────────────────────────────────────
// TELEGRAM NOTIFICATIONS
// ─────────────────────────────────────────
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function getTelegramSettings() {
  let token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  let chatId = (process.env.TELEGRAM_CHAT_ID || '').trim();
  let enabled = true;

  if (pool) {
    try {
      const q = await pool.query("SELECT value FROM site_content WHERE key = 'telegram_settings'");
      if (q.rows.length > 0 && q.rows[0].value) {
        const val = q.rows[0].value;
        if (val.bot_token) token = String(val.bot_token).trim();
        if (val.chat_id) chatId = String(val.chat_id).trim();
        if (val.enabled !== undefined) enabled = Boolean(val.enabled);
      }
    } catch (e) {
      // ignore
    }
  } else if (memoryStore.siteContent['telegram_settings']) {
    const val = memoryStore.siteContent['telegram_settings'];
    if (val.bot_token) token = String(val.bot_token).trim();
    if (val.chat_id) chatId = String(val.chat_id).trim();
    if (val.enabled !== undefined) enabled = Boolean(val.enabled);
  }

  return { token, chatId, enabled };
}

async function sendTelegramMessage(token, chatId, text) {
  if (!token || !chatId) {
    throw new Error('Telegram Bot Token или Chat ID не настроены');
  }
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description || 'Telegram API returned error');
  }
  return true;
}

async function notifyTelegramNewLead(lead) {
  try {
    const { token, chatId, enabled } = await getTelegramSettings();
    if (!enabled || !token || !chatId) return;

    const time = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const text = `🔥 <b>Новая заявка на TradingAutoPilot!</b>\n\n` +
      `👤 <b>Имя:</b> ${escapeHtml(lead.name || 'Не указано')}\n` +
      `📞 <b>Контакт:</b> <code>${escapeHtml(lead.contact || '')}</code>\n` +
      `🤖 <b>Интересует робот:</b> ${escapeHtml(lead.bot || 'Любой')}\n` +
      (lead.budget ? `💰 <b>Бюджет:</b> ${escapeHtml(lead.budget)}\n` : '') +
      (lead.message ? `💬 <b>Вопрос / Сообщение:</b>\n<i>${escapeHtml(lead.message)}</i>\n` : '') +
      `\n🕒 <i>${time} (МСК)</i>`;

    await sendTelegramMessage(token, chatId, text);
    console.log(`[Telegram] Alert sent for lead #${lead.id}`);
  } catch (err) {
    console.error('[Telegram] Failed to send lead alert:', err.message);
  }
}

// ─────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────

// Health check
app.get('/api/health', async (req, res) => {
  let dbOk = false;
  if (pool) {
    try {
      await pool.query('SELECT 1');
      dbOk = true;
    } catch (e) {
      dbOk = false;
    }
  }
  res.json({ status: 'ok', database: dbOk ? 'connected' : 'offline', timestamp: new Date().toISOString() });
});

// Auth Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const defaultPass = process.env.ADMIN_PASSWORD || 'admin2026!';
  const inputHash = hashPassword(password);

  let authenticated = false;
  let userRole = 'admin';

  if (pool) {
    try {
      const q = await pool.query('SELECT * FROM admin_users WHERE email = $1', [cleanEmail]);
      if (q.rows.length > 0) {
        if (q.rows[0].password_hash === inputHash) {
          authenticated = true;
          userRole = q.rows[0].role || 'admin';
        }
      } else if (cleanEmail === 'konkev@bk.ru' && password === defaultPass) {
        // Fallback for initial login
        authenticated = true;
      }
    } catch (err) {
      console.error('[Auth Error]', err.message);
      // Fallback if DB is down
      if (cleanEmail === 'konkev@bk.ru' && password === defaultPass) {
        authenticated = true;
      }
    }
  } else {
    if (cleanEmail === 'konkev@bk.ru' && password === defaultPass) {
      authenticated = true;
    }
  }

  if (!authenticated) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }

  const token = generateToken(cleanEmail);
  const user = {
    id: 'user-' + crypto.createHash('md5').update(cleanEmail).digest('hex').slice(0, 12),
    email: cleanEmail,
    role: userRole,
    app_metadata: { role: userRole },
    user_metadata: {},
  };

  res.json({
    access_token: token,
    token_type: 'bearer',
    user,
    session: {
      access_token: token,
      user,
    },
  });
});

// Leads: Submit from Landing page
app.post('/api/leads', async (req, res) => {
  const { name, contact, bot, budget, message } = req.body || {};
  if (!contact) {
    return res.status(400).json({ error: 'Контакт обязателен' });
  }

  let createdLead = null;

  if (pool) {
    try {
      const q = await pool.query(
        'INSERT INTO leads (name, contact, bot, budget, message, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name || '', contact, bot || '', budget || '', message || '', 'new']
      );
      createdLead = q.rows[0];
    } catch (e) {
      console.error('[Leads Error]', e.message);
    }
  }

  if (!createdLead) {
    // Memory fallback
    createdLead = { id: Date.now(), name, contact, bot, budget, message: message || '', status: 'new', created_at: new Date().toISOString() };
    memoryStore.leads.unshift(createdLead);
  }

  // Trigger Telegram notification asynchronously
  notifyTelegramNewLead(createdLead).catch(err => console.error('[TG Notify Background]', err.message));

  res.status(201).json(createdLead);
});

// Leads: List (Admin)
app.get('/api/leads', async (req, res) => {
  if (pool) {
    try {
      const q = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
      return res.json(q.rows);
    } catch (e) {
      console.error('[Leads List Error]', e.message);
    }
  }
  res.json(memoryStore.leads);
});

// Leads: Update status and notes (Admin)
app.patch('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body || {};
  if (pool) {
    try {
      const q = await pool.query(`
        UPDATE leads SET
          status = COALESCE($1, status),
          notes = CASE WHEN $2::text IS NOT NULL THEN $2::text ELSE notes END
        WHERE id = $3 RETURNING *;
      `, [status !== undefined ? status : null, notes !== undefined ? notes : null, id]);
      return res.json(q.rows[0] || {});
    } catch (e) {
      console.error('[Leads Update Error]', e.message);
      return res.status(500).json({ error: e.message });
    }
  }
  const item = memoryStore.leads.find(l => String(l.id) === String(id));
  if (item) {
    if (status !== undefined) item.status = status;
    if (notes !== undefined) item.notes = notes;
  }
  res.json(item || {});
});

// Leads: Delete (Admin)
app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  if (pool) {
    try {
      await pool.query('DELETE FROM leads WHERE id = $1', [id]);
      return res.json({ success: true });
    } catch (e) {
      console.error('[Leads Delete Error]', e.message);
    }
  }
  memoryStore.leads = memoryStore.leads.filter(l => String(l.id) !== String(id));
  res.json({ success: true });
});

// Telegram: Test notification
app.post('/api/telegram/test', async (req, res) => {
  const { bot_token, chat_id } = req.body || {};
  const current = await getTelegramSettings();
  const token = (bot_token || current.token || '').trim();
  const chatId = (chat_id || current.chatId || '').trim();

  if (!token || !chatId) {
    return res.status(400).json({ error: 'Пожалуйста, укажите Bot Token и Chat ID' });
  }

  try {
    const time = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const text = `🔔 <b>Тестовое уведомление от CoinSoft / TradingAutoPilot!</b>\n\n` +
      `✅ Интеграция с Telegram настроена успешно.\n` +
      `Все новые заявки с сайта будут мгновенно приходить в этот чат.\n\n` +
      `🕒 <i>${time} (МСК)</i>`;
    await sendTelegramMessage(token, chatId, text);
    res.json({ success: true, message: 'Тестовое уведомление успешно отправлено в Telegram!' });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Ошибка отправки в Telegram' });
  }
});

// Bots: List
app.get('/api/bots', async (req, res) => {
  if (pool) {
    try {
      const q = await pool.query('SELECT * FROM bots ORDER BY position ASC, created_at ASC');
      if (q.rows.length > 0) {
        // Map snake_case DB columns → camelCase expected by AdminBots.tsx
        const rows = q.rows.map(r => ({
          ...r,
          shortDesc: r.short_desc || '',
          fullDesc: r.full_desc || '',
          how_it_works: r.how_it_works || [],
          example_trade: r.example_trade || [],
          features: r.features || [],
          returns: r.returns || [],
          i18n: r.i18n || {},
        }));
        return res.json(rows);
      }
    } catch (e) {
      console.error('[Bots List Error]', e.message);
    }
  }
  res.json(memoryStore.bots);
});

// Bots: Upsert (INSERT new bot)
app.post('/api/bots', async (req, res) => {
  const bot = req.body || {};
  if (!bot.name) return res.status(400).json({ error: 'Missing name' });
  // Auto-generate id from slug or name if not provided
  const id = bot.id || bot.slug || bot.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  if (pool) {
    try {
      const q = await pool.query(`
        INSERT INTO bots (id, slug, name, slogan, short_desc, full_desc, badge, market, strategy, risk, pairs, color, image_url, difficulty, difficulty_tone, features, returns, how_it_works, example_trade, i18n, position, meta_title, meta_description, og_image, suitable_for, exchanges, in_development, avatar_url, avatar_dark_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug, name = EXCLUDED.name, slogan = EXCLUDED.slogan,
          short_desc = EXCLUDED.short_desc, full_desc = EXCLUDED.full_desc,
          badge = EXCLUDED.badge, market = EXCLUDED.market, strategy = EXCLUDED.strategy,
          risk = EXCLUDED.risk, pairs = EXCLUDED.pairs, color = EXCLUDED.color,
          image_url = EXCLUDED.image_url, difficulty = EXCLUDED.difficulty,
          difficulty_tone = EXCLUDED.difficulty_tone, features = EXCLUDED.features,
          returns = EXCLUDED.returns, how_it_works = EXCLUDED.how_it_works,
          example_trade = EXCLUDED.example_trade, i18n = EXCLUDED.i18n,
          position = EXCLUDED.position,
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          og_image = EXCLUDED.og_image,
          suitable_for = EXCLUDED.suitable_for,
          exchanges = EXCLUDED.exchanges,
          in_development = EXCLUDED.in_development,
          avatar_url = COALESCE(EXCLUDED.avatar_url, bots.avatar_url),
          avatar_dark_url = COALESCE(EXCLUDED.avatar_dark_url, bots.avatar_dark_url)
        RETURNING *;
      `, [
        id, bot.slug || id, bot.name, bot.slogan || '', bot.shortDesc || bot.short_desc || '',
        bot.fullDesc || bot.full_desc || '', bot.badge || '', bot.market || '', bot.strategy || '',
        bot.risk || '', bot.pairs || '', bot.color || '#3b82f6', bot.image_url || null,
        bot.difficulty || '', bot.difficulty_tone || '',
        JSON.stringify(bot.features || []), JSON.stringify(bot.returns || []),
        JSON.stringify(bot.how_it_works || []), JSON.stringify(bot.example_trade || []),
        JSON.stringify(bot.i18n || {}), bot.position || 0,
        bot.meta_title || bot.metaTitle || null,
        bot.meta_description || bot.metaDescription || null,
        bot.og_image || bot.ogImage || null,
        bot.suitable_for || bot.suitableFor || null,
        bot.exchanges || null,
        bot.in_development === true || bot.inDevelopment === true,
        bot.avatar_url || bot.avatarUrl || null,
        bot.avatar_dark_url || bot.avatarDarkUrl || null,
      ]);
      return res.json(q.rows[0]);
    } catch (e) {
      console.error('[Bots Upsert Error]', e.message);
      return res.status(500).json({ error: e.message });
    }
  }
  res.json({ ...bot, id });
});

// Bots: Update (PATCH by id)
app.patch('/api/bots/:id', async (req, res) => {
  const { id } = req.params;
  const bot = req.body || {};
  if (pool) {
    try {
      const q = await pool.query(`
        UPDATE bots SET
          slug = COALESCE($2, slug), name = COALESCE($3, name), slogan = COALESCE($4, slogan),
          short_desc = COALESCE($5, short_desc), full_desc = COALESCE($6, full_desc),
          badge = COALESCE($7, badge), market = COALESCE($8, market), strategy = COALESCE($9, strategy),
          risk = COALESCE($10, risk), pairs = COALESCE($11, pairs), color = COALESCE($12, color),
          image_url = $13, difficulty = COALESCE($14, difficulty),
          difficulty_tone = COALESCE($15, difficulty_tone),
          features = COALESCE($16::jsonb, features), returns = COALESCE($17::jsonb, returns),
          how_it_works = COALESCE($18::jsonb, how_it_works), example_trade = COALESCE($19::jsonb, example_trade),
          i18n = COALESCE($20::jsonb, i18n), position = COALESCE($21, position),
          meta_title = COALESCE($22, meta_title),
          meta_description = COALESCE($23, meta_description),
          og_image = COALESCE($24, og_image),
          suitable_for = COALESCE($25, suitable_for),
          exchanges = COALESCE($26, exchanges),
          in_development = COALESCE($27, in_development),
          avatar_url = COALESCE($28, avatar_url),
          avatar_dark_url = COALESCE($29, avatar_dark_url)
        WHERE id = $1
        RETURNING *;
      `, [
        id, bot.slug || null, bot.name || null, bot.slogan || null,
        bot.shortDesc || bot.short_desc || null, bot.fullDesc || bot.full_desc || null,
        bot.badge || null, bot.market || null, bot.strategy || null,
        bot.risk || null, bot.pairs || null, bot.color || null,
        bot.image_url !== undefined ? bot.image_url : null,
        bot.difficulty || null, bot.difficulty_tone || null,
        bot.features ? JSON.stringify(bot.features) : null,
        bot.returns ? JSON.stringify(bot.returns) : null,
        bot.how_it_works ? JSON.stringify(bot.how_it_works) : null,
        bot.example_trade ? JSON.stringify(bot.example_trade) : null,
        bot.i18n ? JSON.stringify(bot.i18n) : null,
        bot.position !== undefined ? bot.position : null,
        bot.meta_title || bot.metaTitle || null,
        bot.meta_description || bot.metaDescription || null,
        bot.og_image || bot.ogImage || null,
        bot.suitable_for !== undefined ? (bot.suitable_for || bot.suitableFor) : null,
        bot.exchanges !== undefined ? bot.exchanges : null,
        bot.in_development !== undefined ? (bot.in_development === true || bot.inDevelopment === true) : null,
        bot.avatar_url !== undefined ? bot.avatar_url : (bot.avatarUrl !== undefined ? bot.avatarUrl : null),
        bot.avatar_dark_url !== undefined ? bot.avatar_dark_url : (bot.avatarDarkUrl !== undefined ? bot.avatarDarkUrl : null),
      ]);
      return res.json(q.rows[0] || {});
    } catch (e) {
      console.error('[Bots PATCH Error]', e.message);
      return res.status(500).json({ error: e.message });
    }
  }
  res.json({ ...bot, id });
});

// Bots: Delete
app.delete('/api/bots/:id', async (req, res) => {
  const { id } = req.params;
  if (pool) {
    try {
      await pool.query('DELETE FROM bots WHERE id = $1', [id]);
      return res.json({ success: true });
    } catch (e) {
      console.error('[Bots Delete Error]', e.message);
      return res.status(500).json({ error: e.message });
    }
  }
  res.json({ success: true });
});

// Site Content: Get
app.get('/api/site-content', async (req, res) => {
  const merged = { ...DEFAULT_SITE_CONTENT, ...memoryStore.siteContent };
  if (pool) {
    try {
      const q = await pool.query('SELECT * FROM site_content');
      q.rows.forEach(r => { merged[r.key] = r.value; });
      return res.json(merged);
    } catch (e) {
      console.error('[Site Content Error]', e.message);
    }
  }
  res.json(merged);
});

// Site Content: Save
app.post('/api/site-content', async (req, res) => {
  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ error: 'Key is required' });

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO site_content (key, value, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
      `, [key, JSON.stringify(value)]);
      return res.json({ success: true, key });
    } catch (e) {
      console.error('[Site Content Save Error]', e.message);
    }
  }
  memoryStore.siteContent[key] = value;
  res.json({ success: true, key });
});

// Site Sections: Get
app.get('/api/site-sections', async (req, res) => {
  const fallbackSections = [
    { key: "hero", title: "Шапка с графиком (Hero)", enabled: true, position: 1 },
    { key: "products", title: "Наши разработки (3 бота)", enabled: true, position: 2 },
    { key: "why", title: "Для чего нужны торговые боты", enabled: true, position: 3 },
    { key: "connect", title: "Подключение и безопасность", enabled: true, position: 4 },
    { key: "advantages", title: "Преимущества использования ботов", enabled: true, position: 5 },
    { key: "benefits", title: "Почему стоит выбрать нас", enabled: true, position: 6 },
    { key: "pricing", title: "Наши цены", enabled: true, position: 7 },
    { key: "conclusion", title: "Заключение", enabled: true, position: 8 },
    { key: "questions", title: "Остались вопросы?", enabled: true, position: 9 },
    { key: "faq", title: "Частые вопросы", enabled: false, position: 10 },
    { key: "calculator", title: "Калькулятор доходности", enabled: false, position: 11 },
    { key: "lead", title: "Форма заявки", enabled: false, position: 12 },
  ];

  if (pool) {
    try {
      const q = await pool.query('SELECT * FROM site_sections ORDER BY position ASC');
      if (q.rows.length > 0) return res.json(q.rows);
    } catch (e) {
      console.error('[Site Sections Error]', e.message);
    }
  }
  res.json(memoryStore.siteSections && memoryStore.siteSections.length > 0 ? memoryStore.siteSections : fallbackSections);
});

// Site Sections: Save
app.post('/api/site-sections', async (req, res) => {
  const sections = Array.isArray(req.body) ? req.body : [req.body];
  if (pool) {
    try {
      for (const s of sections) {
        if (!s.key) continue;
        await pool.query(`
          INSERT INTO site_sections (key, title, enabled, position)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (key) DO UPDATE SET
            title = COALESCE(EXCLUDED.title, site_sections.title),
            enabled = EXCLUDED.enabled,
            position = EXCLUDED.position;
        `, [s.key, s.title || '', s.enabled !== false, s.position || 0]);
      }
      return res.json({ success: true });
    } catch (e) {
      console.error('[Site Sections Save Error]', e.message);
    }
  }
  memoryStore.siteSections = sections;
  res.json({ success: true });
});

// Page Views: Record
app.post('/api/page-views', async (req, res) => {
  const { path: p, referrer } = req.body || {};
  const ua = req.headers['user-agent'] || '';

  if (pool) {
    try {
      await pool.query('INSERT INTO page_views (path, referrer, user_agent) VALUES ($1, $2, $3)', [p || '/', referrer || '', ua]);
      return res.json({ success: true });
    } catch (e) {
      // ignore
    }
  }
  memoryStore.pageViews.push({ path: p, referrer, user_agent: ua, created_at: new Date().toISOString() });
  res.json({ success: true });
});

// Stats: Summary (Admin Dashboard)
app.get('/api/stats', async (req, res) => {
  let leadsCount = 0;
  let newLeadsCount = 0;
  let todayLeadsCount = 0;
  let botsCount = 3;
  let viewsCount = 0;
  let viewsToday = 0;
  let views7d = 0;
  let viewsChart = [0, 0, 0, 0, 0, 0, 0];

  const dayKeys = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dayKeys.push(d.toISOString().slice(0, 10));
  }

  if (pool) {
    try {
      const l = await pool.query('SELECT COUNT(*) FROM leads');
      leadsCount = parseInt(l.rows[0].count, 10);

      const nl = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'new'");
      newLeadsCount = parseInt(nl.rows[0].count, 10);

      const tl = await pool.query("SELECT COUNT(*) FROM leads WHERE created_at >= NOW() - INTERVAL '24 HOURS'");
      todayLeadsCount = parseInt(tl.rows[0].count, 10);

      const b = await pool.query('SELECT COUNT(*) FROM bots');
      botsCount = parseInt(b.rows[0].count, 10);

      const v = await pool.query('SELECT COUNT(*) FROM page_views');
      viewsCount = parseInt(v.rows[0].count, 10);

      const vt = await pool.query("SELECT COUNT(*) FROM page_views WHERE created_at >= CURRENT_DATE");
      viewsToday = parseInt(vt.rows[0].count, 10);

      const v7 = await pool.query("SELECT COUNT(*) FROM page_views WHERE created_at >= NOW() - INTERVAL '7 DAYS'");
      views7d = parseInt(v7.rows[0].count, 10);

      const vc = await pool.query(`
        SELECT TO_CHAR(created_at, 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
        FROM page_views
        WHERE created_at >= CURRENT_DATE - INTERVAL '6 DAYS'
        GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
      `);
      const map = {};
      vc.rows.forEach(r => { map[r.day] = r.count; });
      viewsChart = dayKeys.map(k => map[k] || 0);
    } catch (e) {
      console.warn('[Stats Query Fallback]', e.message);
    }
  } else {
    leadsCount = memoryStore.leads.length;
    newLeadsCount = memoryStore.leads.filter(l => l.status === 'new').length;
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    todayLeadsCount = memoryStore.leads.filter(l => (l.created_at || '') >= dayAgo).length;
    botsCount = memoryStore.bots.length || 3;
    viewsCount = memoryStore.pageViews.length;
    const todayStr = new Date().toISOString().slice(0, 10);
    viewsToday = memoryStore.pageViews.filter(v => (v.created_at || '').slice(0, 10) === todayStr).length;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    views7d = memoryStore.pageViews.filter(v => (v.created_at || '') >= weekAgo).length;
    viewsChart = dayKeys.map(k => memoryStore.pageViews.filter(v => (v.created_at || '').slice(0, 10) === k).length);
  }

  res.json({
    leads: leadsCount,
    newLeads: newLeadsCount,
    todayLeads: todayLeadsCount,
    bots: botsCount,
    views: viewsCount,
    viewsToday,
    views7d,
    viewsChart,
  });
});

// ─────────────────────────────────────────
// DYNAMIC SEO: SITEMAP.XML & ROBOTS.TXT
// ─────────────────────────────────────────
app.get('/sitemap.xml', async (req, res) => {
  try {
    let siteUrl = 'https://coinsofter.com';
    let robots = [];

    if (pool) {
      try {
        const metaQ = await pool.query("SELECT value FROM site_content WHERE key = 'meta'");
        if (metaQ.rows.length > 0 && metaQ.rows[0].value) {
          const m = metaQ.rows[0].value;
          if (m.site_url) siteUrl = String(m.site_url).trim().replace(/\/+$/, '');
        }
        const bQ = await pool.query('SELECT slug, created_at, COALESCE(updated_at, created_at) as last_mod FROM bots ORDER BY position ASC, id ASC');
        robots = bQ.rows;
      } catch (e) {
        console.error('[Sitemap Query Error]', e.message);
        try {
          const fallbackQ = await pool.query('SELECT slug, created_at FROM bots ORDER BY position ASC, id ASC');
          robots = fallbackQ.rows;
        } catch {}
      }
    } else {
      robots = memoryStore.bots || [];
    }

    if (!siteUrl || siteUrl === 'https://coinsofter.com') {
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      if (host) siteUrl = `${proto}://${host}`;
    }

    const today = new Date().toISOString().slice(0, 10);
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    for (const b of robots) {
      if (!b.slug) continue;
      const lastmod = (b.last_mod || b.created_at) ? new Date(b.last_mod || b.created_at).toISOString().slice(0, 10) : today;
      xml += `  <url>\n    <loc>${siteUrl}/bots/${encodeURIComponent(b.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.send(xml);
  } catch (err) {
    console.error('[Sitemap Error]', err);
    return res.status(500).send('Error generating sitemap');
  }
});

app.get('/robots.txt', async (req, res) => {
  try {
    let siteUrl = 'https://coinsofter.com';
    let customRobots = null;

    if (pool) {
      try {
        const metaQ = await pool.query("SELECT value FROM site_content WHERE key = 'meta'");
        if (metaQ.rows.length > 0 && metaQ.rows[0].value) {
          const m = metaQ.rows[0].value;
          if (m.site_url) siteUrl = String(m.site_url).trim().replace(/\/+$/, '');
          if (m.robots_txt && String(m.robots_txt).trim()) customRobots = String(m.robots_txt).trim();
        }
      } catch (e) {
        console.error('[Robots Query Error]', e.message);
      }
    }

    if (!siteUrl || siteUrl === 'https://coinsofter.com') {
      const proto = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      if (host) siteUrl = `${proto}://${host}`;
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    if (customRobots) {
      return res.send(customRobots);
    }

    const defaultRobots = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /admin/',
      'Disallow: /api/',
      '',
      `Sitemap: ${siteUrl}/sitemap.xml`,
    ].join('\n');

    return res.send(defaultRobots);
  } catch (err) {
    console.error('[Robots Error]', err);
    return res.status(500).send('User-agent: *\nAllow: /');
  }
});

// ─────────────────────────────────────────
// STATIC ASSETS & SPA ROUTING
// ─────────────────────────────────────────
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));

app.use((req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] TradingAutoPilot running on http://0.0.0.0:${PORT}`);
});
