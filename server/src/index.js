import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db.js';
import { authRouter } from './routes/auth.js';
import { subjectsRouter } from './routes/subjects.js';
import { quizRouter } from './routes/quiz.js';
import { progressRouter } from './routes/progress.js';
import { adminRouter } from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Security: trust proxy only when behind reverse proxy (e.g. Vercel/Heroku)
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);

// Rate limiting - stricter on auth
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login/signup attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});

if (isProd) {
  app.use(helmet({
    contentSecurityPolicy: true,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
} else {
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
}
const defaultOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [
  defaultOrigin,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
].filter((o, i, a) => o && a.indexOf(o) === i);
// When Origin is missing (e.g. same-origin via proxy), use Referer so the response is allowed
function getRequestOrigin(req) {
  const origin = req.get('Origin');
  if (origin) return origin;
  try {
    const r = req.get('Referer');
    if (r) return new URL(r).origin;
  } catch (_) {}
  return defaultOrigin;
}

// Set CORS headers on every request so proxy/same-origin always gets the right Allow-Origin
app.use((req, res, next) => {
  const origin = getRequestOrigin(req);
  const allow =
    allowedOrigins.includes(origin) ||
    (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
  if (allow) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  next();
});
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(generalLimiter);

// Explicit CORS preflight for /api so auth signup is never blocked
app.use((req, res, next) => {
  const path = req.originalUrl?.split('?')[0] || req.url?.split('?')[0] || req.path || '';
  if (req.method === 'OPTIONS' && path.startsWith('/api')) {
    const origin = getRequestOrigin(req);
    const allow =
      allowedOrigins.includes(origin) ||
      (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
    if (allow) res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
  }
  next();
});

// Log /api requests in dev to debug routing (before any route handler)
if (!isProd) {
  app.use((req, res, next) => {
    if ((req.originalUrl || req.url || '').startsWith('/api')) {
      console.log('[api]', req.method, req.originalUrl || req.url);
    }
    next();
  });
}

// Auth routes only – no requireAdmin, no top-level signup; tokens in body
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/progress', progressRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

start().catch((err) => {
  if (err.name === 'MongooseServerSelectionError' || err.message?.includes('ECONNREFUSED')) {
    console.error('\n❌ MongoDB is not running. The server cannot connect to', process.env.MONGODB_URI || 'localhost:27017');
    console.error('\nOptions:');
    console.error('  1. Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas → create cluster → get connection string → set MONGODB_URI in .env');
    console.error('  2. Run MongoDB locally: brew install mongodb-community && brew services start mongodb-community (macOS)\n');
  } else {
    console.error('Failed to start:', err);
  }
  process.exit(1);
});
