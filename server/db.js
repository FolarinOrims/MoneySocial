import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, 'moneysocial.db');
const db = new Database(DB_PATH);

// Performance & safety pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ─────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    display_name TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    cover_photo_url TEXT DEFAULT '',
    interests TEXT DEFAULT '[]',
    level INTEGER DEFAULT 1,
    level_name TEXT DEFAULT 'Getting Started',
    score INTEGER DEFAULT 51,
    streak INTEGER DEFAULT 0,
    is_online INTEGER DEFAULT 0,
    location TEXT DEFAULT '',
    occupation TEXT DEFAULT '',
    financial_goals TEXT DEFAULT '[]',
    joined_date TEXT DEFAULT (date('now')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

// ─── Prepared Statements ────────────────────────────────────────────────────

const stmts = {
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),
  getAllUsers: db.prepare('SELECT * FROM users ORDER BY created_at DESC'),

  createUser: db.prepare(`
    INSERT INTO users (id, email, password_hash, name, display_name, bio, avatar_url, cover_photo_url, interests, level, level_name, score, streak, is_online, location, occupation, financial_goals, joined_date)
    VALUES (@id, @email, @password_hash, @name, @display_name, @bio, @avatar_url, @cover_photo_url, @interests, @level, @level_name, @score, @streak, @is_online, @location, @occupation, @financial_goals, @joined_date)
  `),

  updateProfile: db.prepare(`
    UPDATE users
    SET name = @name,
        display_name = @display_name,
        bio = @bio,
        interests = @interests,
        location = @location,
        occupation = @occupation,
        financial_goals = @financial_goals,
        updated_at = datetime('now')
    WHERE id = @id
  `),

  updateAvatar: db.prepare("UPDATE users SET avatar_url = ?, updated_at = datetime('now') WHERE id = ?"),
  updateCoverPhoto: db.prepare("UPDATE users SET cover_photo_url = ?, updated_at = datetime('now') WHERE id = ?"),

  deleteUser: db.prepare('DELETE FROM users WHERE id = ?'),
};

// ─── Parse JSON fields ──────────────────────────────────────────────────────

function sanitize(row) {
  if (!row) return null;
  const { password_hash, ...rest } = row;            // strip password from public output
  return {
    ...rest,
    is_online: Boolean(rest.is_online),
    interests: JSON.parse(rest.interests || '[]'),
    financial_goals: JSON.parse(rest.financial_goals || '[]'),
  };
}

function rawRow(row) {
  if (!row) return null;
  return row;                                          // includes password_hash
}

// ─── Exported helpers ───────────────────────────────────────────────────────

// Auth helpers (return raw row WITH password_hash)
export function getUserByEmail(email) {
  return rawRow(stmts.getUserByEmail.get(email));
}

export function getUserByIdRaw(id) {
  return rawRow(stmts.getUserById.get(id));
}

// Public helpers (strips password_hash)
export function getUserById(id) {
  return sanitize(stmts.getUserById.get(id));
}

export function getAllUsers() {
  return stmts.getAllUsers.all().map(sanitize);
}

export function createUser({ id, email, password_hash, name }) {
  const data = {
    id,
    email,
    password_hash,
    name,
    display_name: name,
    bio: '',
    avatar_url: '',
    cover_photo_url: '',
    interests: '[]',
    level: 1,
    level_name: 'Getting Started',
    score: 51,
    streak: 0,
    is_online: 0,
    location: '',
    occupation: '',
    financial_goals: '[]',
    joined_date: new Date().toISOString().split('T')[0],
  };
  stmts.createUser.run(data);
  return getUserById(id);
}

export function updateProfile(id, updates) {
  const existing = stmts.getUserById.get(id);
  if (!existing) return null;

  const data = {
    id,
    name: updates.name ?? existing.name,
    display_name: updates.display_name ?? existing.display_name,
    bio: updates.bio ?? existing.bio,
    interests: updates.interests ? JSON.stringify(updates.interests) : existing.interests,
    location: updates.location ?? existing.location,
    occupation: updates.occupation ?? existing.occupation,
    financial_goals: updates.financial_goals ? JSON.stringify(updates.financial_goals) : existing.financial_goals,
  };

  stmts.updateProfile.run(data);
  return getUserById(id);
}

export function updateAvatar(id, url) {
  stmts.updateAvatar.run(url, id);
  return getUserById(id);
}

export function updateCoverPhoto(id, url) {
  stmts.updateCoverPhoto.run(url, id);
  return getUserById(id);
}

export function deleteUser(id) {
  return stmts.deleteUser.run(id).changes > 0;
}

export default db;
