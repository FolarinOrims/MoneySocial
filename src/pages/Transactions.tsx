import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { TransactionItem } from "@/components/TransactionItem";
import { Transaction, TransactionAPI } from "@/types/transaction";
import { getIconByName } from "@/lib/iconMapping";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "me" | "partner" | "shared";

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Me", value: "me" },
  { label: "Partner", value: "partner" },
  { label: "Shared", value: "shared" },
];

// Fetch transactions from API
async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch("/api/transactions");
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  const apiTransactions: TransactionAPI[] = await response.json();
  
  // Transform API transactions to frontend transactions
  return apiTransactions.map((tx) => ({
    ...tx,
    icon: getIconByName(tx.icon),
  }));
}

export default function Transactions() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  const filteredTransactions = transactions.filter((tx) => {
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
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Loading transactions...
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive text-center py-8">
              Error loading transactions. Please make sure the backend server is running.
            </p>
          )}
          {!isLoading && !error && (
            <>
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
            </>
          )}
        </section>
      </div>
    </div>
  );
}
