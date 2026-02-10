import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import multer from 'multer';

import {
  getUserByEmail,
  getUserByIdRaw,
  getUserById,
  getAllUsers,
  createUser,
  updateProfile,
  updateAvatar,
  updateCoverPhoto,
} from './db.js';

import {
  hashPassword,
  comparePassword,
  signToken,
  requireAuth,
} from './auth.js';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'transactions.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Initialize OpenAI client (will be null if no API key is set)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// ─── Multer setup for photo uploads ──────────────────────────────────────────

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), ok);
  },
});

// ─── Middleware ──────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// ─── Transaction helpers ────────────────────────────────────────────────────

function readTransactions() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeTransactions(transactions) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already taken
    if (getUserByEmail(email)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    const password_hash = await hashPassword(password);
    const user = createUser({ id, email: email.toLowerCase().trim(), password_hash, name: name.trim() });
    const token = signToken(id);

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const row = getUserByEmail(email.toLowerCase().trim());
    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await comparePassword(password, row.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(row.id);
    const user = getUserById(row.id);                  // sanitized (no password)

    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// GET /api/auth/me  –  get current user from token
app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = getUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE ENDPOINTS  (require auth)
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/profiles – public list of all profiles
app.get('/api/profiles', (_req, res) => {
  try {
    res.json(getAllUsers());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// GET /api/profiles/:id – public view of one profile
app.get('/api/profiles/:id', (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Profile not found' });
  res.json(user);
});

// PUT /api/profiles/me – update *own* profile
app.put('/api/profiles/me', requireAuth, (req, res) => {
  try {
    const updated = updateProfile(req.userId, req.body);
    if (!updated) return res.status(404).json({ error: 'Profile not found' });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/profiles/me/avatar – upload own avatar
app.post('/api/profiles/me/avatar', requireAuth, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    // Delete old file if local
    const existing = getUserById(req.userId);
    if (existing?.avatar_url?.startsWith('/uploads/')) {
      const old = path.join(__dirname, existing.avatar_url);
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    const url = `/uploads/${req.file.filename}`;
    res.json(updateAvatar(req.userId, url));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// POST /api/profiles/me/cover – upload own cover photo
app.post('/api/profiles/me/cover', requireAuth, upload.single('cover'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    const existing = getUserById(req.userId);
    if (existing?.cover_photo_url?.startsWith('/uploads/')) {
      const old = path.join(__dirname, existing.cover_photo_url);
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    const url = `/uploads/${req.file.filename}`;
    res.json(updateCoverPhoto(req.userId, url));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload cover photo' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTION ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/transactions', (req, res) => {
  res.json(readTransactions());
});

app.get('/api/transactions/:id', (req, res) => {
  const tx = readTransactions().find(t => t.id === req.params.id);
  if (!tx) return res.status(404).json({ error: 'Transaction not found' });
  res.json(tx);
});

app.post('/api/transactions', (req, res) => {
  const transactions = readTransactions();
  const { description, amount, category, icon, owner, date } = req.body;
  if (!description || amount === undefined || !category || !icon || !owner || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newTx = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    description, amount: Number(amount), category, icon, owner, date,
  };
  transactions.push(newTx);
  writeTransactions(transactions) ? res.status(201).json(newTx) : res.status(500).json({ error: 'Failed to save' });
});

app.put('/api/transactions/:id', (req, res) => {
  const transactions = readTransactions();
  const idx = transactions.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { description, amount, category, icon, owner, date } = req.body;
  transactions[idx] = {
    ...transactions[idx],
    ...(description !== undefined && { description }),
    ...(amount !== undefined && { amount: Number(amount) }),
    ...(category !== undefined && { category }),
    ...(icon !== undefined && { icon }),
    ...(owner !== undefined && { owner }),
    ...(date !== undefined && { date }),
  };
  writeTransactions(transactions) ? res.json(transactions[idx]) : res.status(500).json({ error: 'Failed to update' });
});

app.delete('/api/transactions/:id', (req, res) => {
  const transactions = readTransactions();
  const filtered = transactions.filter(t => t.id !== req.params.id);
  if (transactions.length === filtered.length) return res.status(404).json({ error: 'Not found' });
  writeTransactions(filtered) ? res.status(204).send() : res.status(500).json({ error: 'Failed to delete' });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AI CHAT ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

const OPTO_SYSTEM_PROMPT = `You are Opto, a friendly and knowledgeable AI financial wellness assistant. Your role is to:
- Provide practical, actionable financial advice
- Help users with budgeting, saving, investing, and debt management
- Be encouraging and supportive about their financial journey
- Use simple language (avoid jargon unless the user is advanced)
- Keep responses concise (2-4 sentences usually, unless they ask for detail)
- Add relevant emojis sparingly to keep the tone warm
- Never give specific investment recommendations or guarantees
- Encourage users to consult a licensed financial advisor for complex decisions
- If the conversation is between friends, provide relevant financial insight based on what they're discussing

You are integrated into a social financial wellness platform where users track their financial scores, chat with friends, and work on financial goals together.`;

app.post('/api/chat', async (req, res) => {
  const { messages, conversationContext } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }
  if (!openai) {
    return res.json({ message: "I'd love to help, but the AI service isn't configured yet. Please add your OpenAI API key to the .env file to enable AI responses! 🔑", fallback: true });
  }
  try {
    let systemPrompt = OPTO_SYSTEM_PROMPT;
    if (conversationContext) {
      systemPrompt += `\n\nContext: This conversation is happening in a ${conversationContext.type} chat. ${conversationContext.details || ''}`;
    }
    const openAIMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.senderId === 'me' ? 'user' : msg.senderId === 'opto' ? 'assistant' : 'user',
        content: msg.senderId !== 'me' && msg.senderId !== 'opto' ? `[${msg.senderName || 'Friend'}]: ${msg.text}` : msg.text,
      })),
    ];
    const completion = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: openAIMessages, max_tokens: 500, temperature: 0.7 });
    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) return res.status(500).json({ error: 'No response from AI' });
    res.json({ message: aiResponse, fallback: false });
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    if (error.code === 'insufficient_quota') return res.json({ message: "Oops! The AI service quota has been exceeded. 💳", fallback: true });
    if (error.code === 'invalid_api_key') return res.json({ message: "The AI API key appears to be invalid. 🔑", fallback: true });
    return res.json({ message: "I'm having trouble connecting right now. Please try again in a moment! 🔄", fallback: true });
  }
});

app.get('/api/chat/status', (_req, res) => {
  res.json({ configured: !!openai, model: openai ? 'gpt-4o-mini' : null });
});

// ═══════════════════════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OpenAI API: ${openai ? '✅ Configured' : '⚠️  Not configured (add OPENAI_API_KEY to .env)'}`);
  console.log(`Uploads dir: ${UPLOADS_DIR}`);
});
