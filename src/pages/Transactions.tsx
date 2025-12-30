import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { TransactionItem, Transaction } from "@/components/TransactionItem";
import {
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Utensils,
  Film,
  Zap,
  Briefcase,
  CreditCard,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "me" | "partner" | "shared";

const allTransactions: Transaction[] = [
  { id: "1", description: "Whole Foods", amount: -127.45, category: "Groceries", icon: ShoppingCart, owner: "partner", date: "Dec 28" },
  { id: "2", description: "Starbucks", amount: -8.50, category: "Dining", icon: Coffee, owner: "me", date: "Dec 28" },
  { id: "3", description: "Gas Station", amount: -52.00, category: "Transport", icon: Car, owner: "shared", date: "Dec 27" },
  { id: "4", description: "Rent Payment", amount: -1800.00, category: "Housing", icon: Home, owner: "shared", date: "Dec 27" },
  { id: "5", description: "Chipotle", amount: -15.75, category: "Dining", icon: Utensils, owner: "me", date: "Dec 26" },
  { id: "6", description: "Netflix", amount: -15.99, category: "Entertainment", icon: Film, owner: "shared", date: "Dec 26" },
  { id: "7", description: "Electric Bill", amount: -142.50, category: "Utilities", icon: Zap, owner: "shared", date: "Dec 25" },
  { id: "8", description: "Salary Deposit", amount: 3500.00, category: "Income", icon: Briefcase, owner: "me", date: "Dec 24" },
  { id: "9", description: "Target", amount: -89.32, category: "Shopping", icon: ShoppingCart, owner: "partner", date: "Dec 24" },
  { id: "10", description: "Partner Salary", amount: 3200.00, category: "Income", icon: Briefcase, owner: "partner", date: "Dec 24" },
  { id: "11", description: "Credit Card Payment", amount: -500.00, category: "Transfer", icon: CreditCard, owner: "me", date: "Dec 23" },
  { id: "12", description: "Uber", amount: -24.50, category: "Transport", icon: Car, owner: "partner", date: "Dec 23" },
  { id: "13", description: "Dinner Date", amount: -85.00, category: "Dining", icon: Utensils, owner: "shared", date: "Dec 22" },
  { id: "14", description: "Gym Membership", amount: -49.99, category: "Health", icon: Briefcase, owner: "me", date: "Dec 22" },
];

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Me", value: "me" },
  { label: "Partner", value: "partner" },
  { label: "Shared", value: "shared" },
];

export default function Transactions() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesFilter = activeFilter === "all" || tx.owner === activeFilter;
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncome = filteredTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = Math.abs(
    filteredTransactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Transactions" subtitle="All activity" />

      <div className="px-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-success/10 rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-xl font-bold text-success">
              +${totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 card-shadow">
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="text-xl font-bold">-${totalExpenses.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <section>
          <p className="text-xs text-muted-foreground mb-3">
            {filteredTransactions.length} transactions
          </p>
          <div className="space-y-2">
            {filteredTransactions.map((tx, index) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                style={{ animationDelay: `${index * 30}ms` }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
