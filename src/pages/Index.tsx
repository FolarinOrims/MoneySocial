import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { TransactionItem, Transaction } from "@/components/TransactionItem";
import { GoalCard, Goal } from "@/components/GoalCard";
import { ActionPlanItem, ActionPlan } from "@/components/ActionPlanItem";
import { AccountCard, Account } from "@/components/AccountCard";
import { ProgressBar } from "@/components/ProgressBar";
import {
  Wallet,
  TrendingUp,
  Target,
  CheckCircle,
  ShoppingCart,
  Coffee,
  Car,
  Plane,
  Home,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

const recentTransactions: Transaction[] = [
  {
    id: "1",
    description: "Whole Foods",
    amount: -127.45,
    category: "Groceries",
    icon: ShoppingCart,
    owner: "partner",
    date: "Today",
  },
  {
    id: "2",
    description: "Starbucks",
    amount: -8.5,
    category: "Dining",
    icon: Coffee,
    owner: "me",
    date: "Today",
  },
  {
    id: "3",
    description: "Gas Station",
    amount: -52.0,
    category: "Transport",
    icon: Car,
    owner: "shared",
    date: "Yesterday",
  },
];

const goals: Goal[] = [
  {
    id: "1",
    title: "Vacation Fund",
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
    icon: Home,
    owner: "shared",
    dueDate: "Dec 2025",
  },
];

const actionPlans: ActionPlan[] = [
  {
    id: "1",
    title: "Review subscriptions",
    description: "Cancel unused streaming services",
    owner: "me",
    completed: false,
    priority: "high",
    dueDate: "Jan 5",
  },
  {
    id: "2",
    title: "Consolidate student loans",
    description: "Research refinancing options",
    owner: "partner",
    completed: false,
    priority: "medium",
    dueDate: "Jan 15",
  },
];

const accounts: Account[] = [
  {
    id: "1",
    name: "Chase Checking",
    institution: "Chase",
    balance: 4523.87,
    type: "checking",
    owner: "me",
  },
  {
    id: "2",
    name: "Savings Account",
    institution: "Ally Bank",
    balance: 12450.0,
    type: "savings",
    owner: "shared",
  },
  {
    id: "3",
    name: "Sapphire Reserve",
    institution: "Chase",
    balance: -1850.32,
    type: "credit",
    owner: "partner",
  },
];

export default function Index() {
  const totalBudget = 5500;
  const totalSpent = 3847;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Welcome back!"
        subtitle="Here's your financial snapshot"
      />

      <div className="px-4 space-y-6">
        {/* Budget Overview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              This Month
            </h2>
            <Link
              to="/budget"
              className="text-xs font-medium text-primary flex items-center gap-1"
            >
              See all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-card rounded-xl p-4 card-shadow">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-lg font-semibold text-muted-foreground">
                  ${totalBudget.toLocaleString()}
                </p>
              </div>
            </div>
            <ProgressBar value={totalSpent} max={totalBudget} size="md" />
            <p className="text-xs text-muted-foreground mt-2">
              ${(totalBudget - totalSpent).toLocaleString()} remaining
            </p>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-2 gap-3">
          <SummaryCard
            title="Net Worth"
            value="$47,250"
            icon={TrendingUp}
            trend={{ value: "3.2% this month", positive: true }}
          />
          <SummaryCard
            title="Savings Rate"
            value="24%"
            icon={Target}
            subtitle="of income"
            variant="primary"
          />
        </section>

        {/* Connected Accounts */}
        <section>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Connected Accounts
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Recent Activity
            </h2>
            <Link
              to="/transactions"
              className="text-xs font-medium text-primary flex items-center gap-1"
            >
              See all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        </section>

        {/* Goals Progress */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Goals
            </h2>
            <Link
              to="/goals"
              className="text-xs font-medium text-primary flex items-center gap-1"
            >
              See all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>

        {/* Action Plans */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Action Items
            </h2>
            <Link
              to="/action-plans"
              className="text-xs font-medium text-primary flex items-center gap-1"
            >
              See all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {actionPlans.map((action) => (
              <ActionPlanItem key={action.id} action={action} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
