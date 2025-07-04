import { db } from './db.js';

export function registerRoutes(app) {
  app.get('/', (req, res) => {
    res.send('🚀 Captcha Kombat API running!');
  });

  // Create or fetch user
  app.post('/api/auth', async (req, res) => {
    const { telegramId, username } = req.body;
    if (!telegramId || !username) return res.status(400).json({ error: "Missing data" });

    const existing = await db.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);

    if (existing.rows.length > 0) {
      return res.json({ user: existing.rows[0] });
    }

    const result = await db.query(
      `INSERT INTO users (telegram_id, username, points) VALUES ($1, $2, 0) RETURNING *`,
      [telegramId, username]
    );
    res.json({ user: result.rows[0] });
  });

  // Generate a new captcha
  app.get('/api/captcha', (req, res) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const code = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    res.json({ captcha: code });
  });

  // Submit captcha answer
  app.post('/api/submit', async (req, res) => {
    const { telegramId, answer, expected } = req.body;

    if (!telegramId || !answer || !expected) {
      return res.status(400).json({ error: "Missing data" });
    }

    const isCorrect = answer.toUpperCase() === expected.toUpperCase();
    if (isCorrect) {
      await db.query('UPDATE users SET points = points + 1 WHERE telegram_id = $1', [telegramId]);
    }

    res.json({ correct: isCorrect });
  });

  // Leaderboard
  app.get('/api/leaderboard', async (req, res) => {
    const result = await db.query('SELECT username, points FROM users ORDER BY points DESC LIMIT 10');
    res.json({ leaderboard: result.rows });
  });
}
