import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { User, hashPassword, comparePassword } from '../models/User.js';
import {
  requireAuth,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../middleware/auth.js';

const router = Router();
const isProd = process.env.NODE_ENV === 'production';
const cookieOpts = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, {
    ...cookieOpts,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, cookieOpts);
}

// Sign up
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number')
      .matches(/[A-Za-z]/)
      .withMessage('Password must contain a letter'),
    body('name').trim().notEmpty().isLength({ max: 100 }).withMessage('Name required (max 100 chars)'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }
      const { email, password, name } = req.body;
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
      const passwordHash = await hashPassword(password);
      const user = await User.create({ email, passwordHash, name });
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      setAuthCookies(res, accessToken, refreshToken);
      res.status(201).json({
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
      });
    } catch (e) {
      next(e);
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await comparePassword(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user);
      setAuthCookies(res, accessToken, refreshToken);
      res.json({
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
      });
    } catch (e) {
      next(e);
    }
  }
);

// Refresh access token
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Session expired' });
    }
    const user = await verifyRefreshToken(refreshToken);
    if (!user) {
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });
      return res.status(401).json({ error: 'Session expired' });
    }
    const newAccess = signAccessToken(user);
    res.cookie('accessToken', newAccess, {
      ...cookieOpts,
      maxAge: 15 * 60 * 1000,
    });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
  res.json({ ok: true });
});

// Current user (requires auth)
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .select('_id email name role createdAt')
      .lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { id: user._id, ...user } });
  } catch (e) {
    next(e);
  }
});

export { router as authRouter };
