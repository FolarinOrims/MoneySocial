import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data', 'transactions.json');

const initialTransactions = [
  { id: "1", description: "Whole Foods", amount: -127.45, category: "Groceries", icon: "ShoppingCart", owner: "partner", date: "Dec 28" },
  { id: "2", description: "Starbucks", amount: -8.50, category: "Dining", icon: "Coffee", owner: "me", date: "Dec 28" },
  { id: "3", description: "Gas Station", amount: -52.00, category: "Transport", icon: "Car", owner: "shared", date: "Dec 27" },
  { id: "4", description: "Rent Payment", amount: -1800.00, category: "Housing", icon: "Home", owner: "shared", date: "Dec 27" },
  { id: "5", description: "Chipotle", amount: -15.75, category: "Dining", icon: "Utensils", owner: "me", date: "Dec 26" },
  { id: "6", description: "Netflix", amount: -15.99, category: "Entertainment", icon: "Film", owner: "shared", date: "Dec 26" },
  { id: "7", description: "Electric Bill", amount: -142.50, category: "Utilities", icon: "Zap", owner: "shared", date: "Dec 25" },
  { id: "8", description: "Salary Deposit", amount: 3500.00, category: "Income", icon: "Briefcase", owner: "me", date: "Dec 24" },
  { id: "9", description: "Target", amount: -89.32, category: "Shopping", icon: "ShoppingCart", owner: "partner", date: "Dec 24" },
  { id: "10", description: "Partner Salary", amount: 3200.00, category: "Income", icon: "Briefcase", owner: "partner", date: "Dec 24" },
  { id: "11", description: "Credit Card Payment", amount: -500.00, category: "Transfer", icon: "CreditCard", owner: "me", date: "Dec 23" },
  { id: "12", description: "Uber", amount: -24.50, category: "Transport", icon: "Car", owner: "partner", date: "Dec 23" },
  { id: "13", description: "Dinner Date", amount: -85.00, category: "Dining", icon: "Utensils", owner: "shared", date: "Dec 22" },
  { id: "14", description: "Gym Membership", amount: -49.99, category: "Health", icon: "Briefcase", owner: "me", date: "Dec 22" },
];

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Check if file already exists and has data
if (fs.existsSync(DATA_FILE)) {
  try {
    const existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (existingData.length > 0) {
      console.log('Database already has data. Skipping seed.');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error reading existing data:', error);
  }
}

// Write initial transactions
fs.writeFileSync(DATA_FILE, JSON.stringify(initialTransactions, null, 2));
console.log(`Seeded ${initialTransactions.length} transactions to ${DATA_FILE}`);



