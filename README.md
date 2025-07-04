
# Captcha Kombat Backend

A simple backend API for a Telegram captcha-solving game.  
Built with Node.js, Express, and PostgreSQL (via Neon).

## Routes

- `POST /api/auth` → Create or get user
- `GET /api/captcha` → Get a new captcha
- `POST /api/submit` → Submit answer
- `GET /api/leaderboard` → Top users
