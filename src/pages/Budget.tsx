import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { BudgetCategory, BudgetCategoryData } from "@/components/BudgetCategory";
import { ProgressBar } from "@/components/ProgressBar";
import {
  Wallet,
  Home,
  ShoppingCart,
  Car,
  Utensils,
  Zap,
  Film,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "me" | "partner" | "shared";

const budgetCategories: BudgetCategoryData[] = [
  { id: "1", name: "Housing", spent: 1800, budget: 1800, icon: Home, owner: "shared" },
  { id: "2", name: "Groceries", spent: 487, budget: 600, icon: ShoppingCart, owner: "shared" },
  { id: "3", name: "Transportation", spent: 285, budget: 350, icon: Car, owner: "me" },
  { id: "4", name: "Dining Out", spent: 312, budget: 250, icon: Utensils, owner: "partner" },
  { id: "5", name: "Utilities", spent: 195, budget: 200, icon: Zap, owner: "shared" },
  { id: "6", name: "Entertainment", spent: 128, budget: 200, icon: Film, owner: "me" },
  { id: "7", name: "Healthcare", spent: 45, budget: 150, icon: HeartPulse, owner: "partner" },
  { id: "8", name: "Education", spent: 250, budget: 300, icon: GraduationCap, owner: "me" },
  { id: "9", name: "Other", spent: 345, budget: 400, icon: MoreHorizontal, owner: "shared" },
];

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Me", value: "me" },
  { label: "Partner", value: "partner" },
  { label: "Shared", value: "shared" },
];

export default function Budget() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredCategories =
    activeFilter === "all"
      ? budgetCategories
      : budgetCategories.filter((cat) => cat.owner === activeFilter);

  const totalSpent = filteredCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudget = filteredCategories.reduce((sum, cat) => sum + cat.budget, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Budget" subtitle="December 2024" />

      <div className="px-4 space-y-6">
        {/* Overview Card */}
        <div className="bg-primary text-primary-foreground rounded-xl p-5 card-shadow animate-slide-up">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm opacity-80">Total Spent</p>
              <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Budget</p>
              <p className="text-xl font-semibold opacity-90">
                ${totalBudget.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-primary-foreground/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary-foreground rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
            />
          </div>
          <p className="text-sm mt-3 opacity-80">
            ${(totalBudget - totalSpent).toLocaleString()} remaining
          </p>
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

        {/* Budget Categories */}
        <section>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Categories
          </h2>
          <div className="space-y-3">
            {filteredCategories.map((category, index) => (
              <BudgetCategory
                key={category.id}
                category={category}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
