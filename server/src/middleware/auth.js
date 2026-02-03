/**
 * Auth middleware – requireAuth reads token from Authorization header only.
 * requireAdmin is used only by admin routes (never by /api/auth).
 */
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (!accessSecret) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }
  try {
    const decoded = jwt.verify(token, accessSecret);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

export function signAccessToken(user) {
  if (!accessSecret) throw new Error('JWT_ACCESS_SECRET not set');
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    accessSecret,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '7d' }
  );
}

export function signRefreshToken(user) {
  if (!refreshSecret) throw new Error('JWT_REFRESH_SECRET not set');
  return jwt.sign(
    { userId: user._id.toString() },
    refreshSecret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );
}

export async function verifyRefreshToken(token) {
  if (!refreshSecret) return null;
  try {
    const decoded = jwt.verify(token, refreshSecret);
    const user = await User.findById(decoded.userId).select('_id role');
    return user;
  } catch (_) {
    return null;
  }
}
