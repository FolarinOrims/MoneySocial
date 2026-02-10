import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In production you'd read this from an env var; fine for local dev
const JWT_SECRET = process.env.JWT_SECRET || 'opto-local-dev-secret-2026';
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

// ─── Password helpers ───────────────────────────────────────────────────────

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// ─── JWT helpers ────────────────────────────────────────────────────────────

export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);        // throws on invalid / expired
}

// ─── Express middleware ─────────────────────────────────────────────────────

/**
 * Require a valid JWT in the Authorization header.
 * Sets req.userId on success, returns 401 otherwise.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = verifyToken(header.slice(7));
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
