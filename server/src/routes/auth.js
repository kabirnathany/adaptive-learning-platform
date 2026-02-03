/**
 * Auth routes – signup, login, logout, me.
 * No requireAdmin. Tokens returned in body so client can use Authorization header (avoids cookie/CORS issues).
 */
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { User, hashPassword, comparePassword } from '../models/User.js';
import { requireAuth, signAccessToken } from '../middleware/auth.js';

const router = Router();

// ----- Signup -----
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
      res.status(201).json({
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
        accessToken,
      });
    } catch (e) {
      next(e);
    }
  }
);

// ----- Login -----
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
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
      res.json({
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
        accessToken,
      });
    } catch (e) {
      next(e);
    }
  }
);

// ----- Logout (client clears token; this is for consistency) -----
router.post('/logout', (req, res) => {
  res.json({ ok: true });
});

// ----- Current user (requires Authorization: Bearer <token>) -----
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
