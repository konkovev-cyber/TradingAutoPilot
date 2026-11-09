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
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT;
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget TEXT;

        CREATE TABLE IF NOT EXISTS bots (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          slug TEXT UNIQUE,
          roi TEXT,
          badge TEXT,
          rating NUMERIC,
          color TEXT,
          position INT DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

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

      console.log(`[DB] Schema initialized. Admin user '${defaultAdminEmail}' configured.`);
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

  if (pool) {
    try {
      const q = await pool.query(
        'INSERT INTO leads (name, contact, bot, budget, message, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name || '', contact, bot || '', budget || '', message || '', 'new']
      );
      return res.status(201).json(q.rows[0]);
    } catch (e) {
      console.error('[Leads Error]', e.message);
    }
  }

  // Memory fallback
  const lead = { id: Date.now(), name, contact, bot, budget, message: message || '', status: 'new', created_at: new Date().toISOString() };
  memoryStore.leads.unshift(lead);
  res.status(201).json(lead);
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

// Leads: Update status (Admin)
app.patch('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (pool) {
    try {
      const q = await pool.query('UPDATE leads SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
      return res.json(q.rows[0] || {});
    } catch (e) {
      console.error('[Leads Update Error]', e.message);
    }
  }
  const item = memoryStore.leads.find(l => String(l.id) === String(id));
  if (item) item.status = status;
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

// Bots: List
app.get('/api/bots', async (req, res) => {
  if (pool) {
    try {
      const q = await pool.query('SELECT * FROM bots ORDER BY position ASC, created_at ASC');
      if (q.rows.length > 0) return res.json(q.rows);
    } catch (e) {
      console.error('[Bots List Error]', e.message);
    }
  }
  res.json(memoryStore.bots);
});

// Bots: Upsert
app.post('/api/bots', async (req, res) => {
  const bot = req.body || {};
  if (!bot.id || !bot.name) return res.status(400).json({ error: 'Missing id or name' });

  if (pool) {
    try {
      const q = await pool.query(`
        INSERT INTO bots (id, name, description, slug, roi, badge, rating, color, position)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          slug = EXCLUDED.slug,
          roi = EXCLUDED.roi,
          badge = EXCLUDED.badge,
          rating = EXCLUDED.rating,
          color = EXCLUDED.color,
          position = EXCLUDED.position
        RETURNING *;
      `, [bot.id, bot.name, bot.description, bot.slug, bot.roi, bot.badge, bot.rating, bot.color, bot.position || 0]);
      return res.json(q.rows[0]);
    } catch (e) {
      console.error('[Bots Upsert Error]', e.message);
    }
  }
  res.json(bot);
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
  let viewsCount = 0;
  let viewsToday = 0;

  if (pool) {
    try {
      const l = await pool.query('SELECT COUNT(*) FROM leads');
      leadsCount = parseInt(l.rows[0].count, 10);
      const v = await pool.query('SELECT COUNT(*) FROM page_views');
      viewsCount = parseInt(v.rows[0].count, 10);
      const vt = await pool.query("SELECT COUNT(*) FROM page_views WHERE created_at >= CURRENT_DATE");
      viewsToday = parseInt(vt.rows[0].count, 10);
    } catch (e) {
      // fallback
    }
  } else {
    leadsCount = memoryStore.leads.length;
    viewsCount = memoryStore.pageViews.length;
  }

  res.json({
    leads: leadsCount,
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
