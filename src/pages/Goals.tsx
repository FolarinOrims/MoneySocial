import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { GoalCard, Goal } from "@/components/GoalCard";
import { SummaryCard } from "@/components/SummaryCard";
import {
  Plane,
  Home,
  Car,
  GraduationCap,
  Wallet,
  Target,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "me" | "partner" | "shared";

const allGoals: Goal[] = [
  {
    id: "1",
    title: "Summer Vacation",
    targetAmount: 5000,
    currentAmount: 3250,
    icon: Plane,
    owner: "shared",
    dueDate: "Aug 2025",
  },
  {
    id: "2",
    title: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 8500,
    icon: Wallet,
    owner: "shared",
    dueDate: "Dec 2025",
  },
  {
    id: "3",
    title: "New Car Fund",
    targetAmount: 15000,
    currentAmount: 4200,
    icon: Car,
    owner: "me",
    dueDate: "Jun 2026",
  },
  {
    id: "4",
    title: "Home Down Payment",
    targetAmount: 60000,
    currentAmount: 22500,
    icon: Home,
    owner: "shared",
    dueDate: "Dec 2026",
  },
  {
    id: "5",
    title: "Online Course",
    targetAmount: 800,
    currentAmount: 800,
    icon: GraduationCap,
    owner: "partner",
    dueDate: "Jan 2025",
  },
  {
    id: "6",
    title: "Birthday Trip",
    targetAmount: 2000,
    currentAmount: 750,
    icon: Plane,
    owner: "me",
    dueDate: "Mar 2025",
  },
];

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Me", value: "me" },
  { label: "Partner", value: "partner" },
  { label: "Shared", value: "shared" },
];

export default function Goals() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredGoals =
    activeFilter === "all"
      ? allGoals
      : allGoals.filter((goal) => goal.owner === activeFilter);

  const totalSaved = filteredGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = filteredGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completedGoals = filteredGoals.filter(
    (g) => g.currentAmount >= g.targetAmount
  ).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Goals" subtitle="Track your savings goals">
        <button className="p-2 rounded-full bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </button>
      </PageHeader>

      <div className="px-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            title="Total Saved"
            value={`$${totalSaved.toLocaleString()}`}
            subtitle={`of $${totalTarget.toLocaleString()}`}
            icon={Wallet}
            variant="primary"
          />
          <SummaryCard
            title="Completed"
            value={`${completedGoals}/${filteredGoals.length}`}
            subtitle="goals achieved"
            icon={Target}
          />
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

        {/* Goals List */}
        <section>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Your Goals
          </h2>
          <div className="space-y-3">
            {filteredGoals.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
