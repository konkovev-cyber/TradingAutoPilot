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

// In-memory fallback if DB is temporarily unreachable
const memoryStore = {
  leads: [],
  pageViews: [],
  bots: [],
  siteContent: {},
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
        ALTER TABLE bots ADD COLUMN IF NOT EXISTS i18n JSONB;

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
            features: JSON.stringify(['Анализ рынка в режиме реального времени', 'Отслеживание изменений объёмов и цены по множеству торговых пар', 'Поиск возможностей для сделок в LONG и SHORT', 'Оценка рыночной ситуации и определение точных точек входа', 'Контроль рисков и сокращение рутинного анализа трейдера']),
            returns: JSON.stringify([{ period: '30 дней', value: '+7.9%' }, { period: '90 дней', value: '+22.8%' }, { period: '365 дней', value: '+78.4%' }]),
            how_it_works: JSON.stringify([{ title: 'Мониторинг рынка в реальном времени', desc: 'Бот непрерывно сканирует поток котировок и изменения объёмов по множеству торговых пар' }, { title: 'Поиск возможностей LONG & SHORT', desc: 'Алгоритмы выявляют ценовые дисбалансы и подтверждённые импульсы для входа в сделку' }, { title: 'Контроль рисков', desc: 'Автоматический расчёт точек входа, выставление стоп-лоссов и защита капитала' }]),
            example_trade: JSON.stringify([{ title: 'Всплеск объёма', desc: 'Бот фиксирует синхронный рост объёма и ценовое движение на паре' }, { title: 'Вход в сделку', desc: 'Алгоритм вычисляет оптимальную точку входа и открывает позицию в LONG или SHORT' }, { title: 'Сопровождение', desc: 'Динамический контроль рисков и сопровождение позиции по заданным параметрам' }, { title: 'Фиксация прибыли', desc: 'Сделка закрывается по тейк-профиту с защитой накопленной прибыли' }]),
            i18n: JSON.stringify({ en: { name: 'SynchroBot', slogan: 'Less manual analysis — more actionable data for smart trading decisions', badge: 'Volume & Price AI', market: 'Crypto', strategy: 'Real-time volume & price analysis', risk: 'Controlled: mathematical entry calculation and built-in risk management', pairs: 'BTC/USDT, ETH/USDT, SOL/USDT, Bybit, BingX, OKX & more' } }),
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
            INSERT INTO bots (id, slug, name, slogan, short_desc, full_desc, badge, market, strategy, risk, pairs, color, image_url, difficulty, difficulty_tone, features, returns, how_it_works, example_trade, i18n, position)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
            ON CONFLICT (id) DO NOTHING;
          `, [b.id, b.slug, b.name, b.slogan, b.short_desc, b.full_desc, b.badge, b.market, b.strategy, b.risk, b.pairs, b.color, b.image_url, b.difficulty, b.difficulty_tone, b.features, b.returns, b.how_it_works, b.example_trade, b.i18n, b.position]);
        }
        console.log('[DB] Default bots seeded.');
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
        INSERT INTO bots (id, slug, name, slogan, short_desc, full_desc, badge, market, strategy, risk, pairs, color, image_url, difficulty, difficulty_tone, features, returns, how_it_works, example_trade, i18n, position)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug, name = EXCLUDED.name, slogan = EXCLUDED.slogan,
          short_desc = EXCLUDED.short_desc, full_desc = EXCLUDED.full_desc,
          badge = EXCLUDED.badge, market = EXCLUDED.market, strategy = EXCLUDED.strategy,
          risk = EXCLUDED.risk, pairs = EXCLUDED.pairs, color = EXCLUDED.color,
          image_url = EXCLUDED.image_url, difficulty = EXCLUDED.difficulty,
          difficulty_tone = EXCLUDED.difficulty_tone, features = EXCLUDED.features,
          returns = EXCLUDED.returns, how_it_works = EXCLUDED.how_it_works,
          example_trade = EXCLUDED.example_trade, i18n = EXCLUDED.i18n,
          position = EXCLUDED.position
        RETURNING *;
      `, [
        id, bot.slug || id, bot.name, bot.slogan || '', bot.shortDesc || bot.short_desc || '',
        bot.fullDesc || bot.full_desc || '', bot.badge || '', bot.market || '', bot.strategy || '',
        bot.risk || '', bot.pairs || '', bot.color || '#3b82f6', bot.image_url || null,
        bot.difficulty || '', bot.difficulty_tone || '',
        JSON.stringify(bot.features || []), JSON.stringify(bot.returns || []),
        JSON.stringify(bot.how_it_works || []), JSON.stringify(bot.example_trade || []),
        JSON.stringify(bot.i18n || {}), bot.position || 0,
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
          i18n = COALESCE($20::jsonb, i18n), position = COALESCE($21, position)
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
  if (pool) {
    try {
      const q = await pool.query('SELECT * FROM site_content');
      const obj = {};
      q.rows.forEach(r => { obj[r.key] = r.value; });
      return res.json(obj);
    } catch (e) {
      console.error('[Site Content Error]', e.message);
    }
  }
  res.json(memoryStore.siteContent);
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
  if (pool) {
    try {
      const q = await pool.query('SELECT * FROM site_sections ORDER BY position ASC');
      if (q.rows.length > 0) return res.json(q.rows);
    } catch (e) {
      console.error('[Site Sections Error]', e.message);
    }
  }
  res.json(memoryStore.siteSections || []);
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
  let viewsCount = 0;
  let viewsToday = 0;

  if (pool) {
    try {
      const l = await pool.query('SELECT COUNT(*) FROM leads');
      leadsCount = parseInt(l.rows[0].count, 10);
      const nl = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'new'");
      newLeadsCount = parseInt(nl.rows[0].count, 10);
      const v = await pool.query('SELECT COUNT(*) FROM page_views');
      viewsCount = parseInt(v.rows[0].count, 10);
      const vt = await pool.query("SELECT COUNT(*) FROM page_views WHERE created_at >= CURRENT_DATE");
      viewsToday = parseInt(vt.rows[0].count, 10);
    } catch (e) {
      // fallback
    }
  } else {
    leadsCount = memoryStore.leads.length;
    newLeadsCount = memoryStore.leads.filter(l => l.status === 'new').length;
    viewsCount = memoryStore.pageViews.length;
  }

  res.json({
    leads: leadsCount,
    newLeads: newLeadsCount,
    views: viewsCount,
    viewsToday,
  });
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
