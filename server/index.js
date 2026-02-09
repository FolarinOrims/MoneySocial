import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'transactions.json');

// Initialize OpenAI client (will be null if no API key is set)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper function to read transactions
function readTransactions() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading transactions:', error);
    return [];
  }
}

// Helper function to write transactions
function writeTransactions(transactions) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing transactions:', error);
    return false;
  }
}

// GET /api/transactions - Get all transactions
app.get('/api/transactions', (req, res) => {
  const transactions = readTransactions();
  res.json(transactions);
});

// GET /api/transactions/:id - Get a single transaction
app.get('/api/transactions/:id', (req, res) => {
  const transactions = readTransactions();
  const transaction = transactions.find(tx => tx.id === req.params.id);
  
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  res.json(transaction);
});

// POST /api/transactions - Create a new transaction
app.post('/api/transactions', (req, res) => {
  const transactions = readTransactions();
  const { description, amount, category, icon, owner, date } = req.body;
  
  // Validate required fields
  if (!description || amount === undefined || !category || !icon || !owner || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Generate new ID
  const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  
  const newTransaction = {
    id: newId,
    description,
    amount: Number(amount),
    category,
    icon,
    owner,
    date
  };
  
  transactions.push(newTransaction);
  
  if (writeTransactions(transactions)) {
    res.status(201).json(newTransaction);
  } else {
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

// PUT /api/transactions/:id - Update a transaction
app.put('/api/transactions/:id', (req, res) => {
  const transactions = readTransactions();
  const index = transactions.findIndex(tx => tx.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  const { description, amount, category, icon, owner, date } = req.body;
  
  transactions[index] = {
    ...transactions[index],
    ...(description !== undefined && { description }),
    ...(amount !== undefined && { amount: Number(amount) }),
    ...(category !== undefined && { category }),
    ...(icon !== undefined && { icon }),
    ...(owner !== undefined && { owner }),
    ...(date !== undefined && { date })
  };
  
  if (writeTransactions(transactions)) {
    res.json(transactions[index]);
  } else {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE /api/transactions/:id - Delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
  const transactions = readTransactions();
  const filteredTransactions = transactions.filter(tx => tx.id !== req.params.id);
  
  if (transactions.length === filteredTransactions.length) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  if (writeTransactions(filteredTransactions)) {
    res.status(204).send();
  } else {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// ─── AI Chat Endpoint ───────────────────────────────────────────────────────

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

// POST /api/chat - Get AI response for a conversation
app.post('/api/chat', async (req, res) => {
  const { messages, conversationContext } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // If no OpenAI API key is configured, return a helpful fallback
  if (!openai) {
    return res.status(200).json({
      message: "I'd love to help, but the AI service isn't configured yet. Please add your OpenAI API key to the .env file to enable AI responses! 🔑",
      fallback: true,
    });
  }

  try {
    // Build the system prompt, optionally with conversation context
    let systemPrompt = OPTO_SYSTEM_PROMPT;
    if (conversationContext) {
      systemPrompt += `\n\nContext: This conversation is happening in a ${conversationContext.type} chat. ${conversationContext.details || ''}`;
    }

    // Convert frontend messages to OpenAI format
    const openAIMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.senderId === 'me' ? 'user' : msg.senderId === 'opto' ? 'assistant' : 'user',
        content: msg.senderId !== 'me' && msg.senderId !== 'opto'
          ? `[${msg.senderName || 'Friend'}]: ${msg.text}`
          : msg.text,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openAIMessages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    res.json({ message: aiResponse, fallback: false });
  } catch (error) {
    console.error('OpenAI API error:', error.message);

    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(200).json({
        message: "Oops! The AI service quota has been exceeded. Please check your OpenAI billing settings. 💳",
        fallback: true,
      });
    }

    if (error.code === 'invalid_api_key') {
      return res.status(200).json({
        message: "The AI API key appears to be invalid. Please check your .env file and update the OPENAI_API_KEY. 🔑",
        fallback: true,
      });
    }

    return res.status(200).json({
      message: "I'm having trouble connecting right now. Please try again in a moment! 🔄",
      fallback: true,
    });
  }
});

// GET /api/chat/status - Check if AI is configured
app.get('/api/chat/status', (req, res) => {
  res.json({
    configured: !!openai,
    model: openai ? 'gpt-4o-mini' : null,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OpenAI API: ${openai ? '✅ Configured' : '⚠️  Not configured (add OPENAI_API_KEY to .env)'}`);
});



