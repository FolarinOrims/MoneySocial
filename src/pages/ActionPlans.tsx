import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ActionPlanItem, ActionPlan } from "@/components/ActionPlanItem";
import { SummaryCard } from "@/components/SummaryCard";
import { CheckCircle, Clock, Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "me" | "partner" | "shared";
type StatusFilter = "all" | "pending" | "completed";

const initialActionPlans: ActionPlan[] = [
  {
    id: "1",
    title: "Review subscriptions",
    description: "Cancel unused streaming services to save $50/month",
    owner: "me",
    completed: false,
    priority: "high",
    dueDate: "Jan 5",
  },
  {
    id: "2",
    title: "Consolidate student loans",
    description: "Research refinancing options for better rates",
    owner: "partner",
    completed: false,
    priority: "medium",
    dueDate: "Jan 15",
  },
  {
    id: "3",
    title: "Set up automatic savings",
    description: "Create weekly transfer of $100 to vacation fund",
    owner: "shared",
    completed: true,
    priority: "high",
  },
  {
    id: "4",
    title: "Compare car insurance",
    description: "Get quotes from 3 providers before renewal",
    owner: "me",
    completed: false,
    priority: "medium",
    dueDate: "Jan 20",
  },
  {
    id: "5",
    title: "Update emergency contacts",
    description: "Add beneficiaries to all accounts",
    owner: "shared",
    completed: false,
    priority: "low",
    dueDate: "Feb 1",
  },
  {
    id: "6",
    title: "Review credit report",
    description: "Check for errors and dispute if needed",
    owner: "partner",
    completed: true,
    priority: "medium",
  },
  {
    id: "7",
    title: "Maximize 401k match",
    description: "Increase contribution to get full employer match",
    owner: "me",
    completed: false,
    priority: "high",
    dueDate: "Jan 10",
  },
  {
    id: "8",
    title: "Create monthly budget review",
    description: "Schedule recurring meeting to review spending",
    owner: "shared",
    completed: false,
    priority: "medium",
    dueDate: "Jan 7",
  },
];

const ownerFilters: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Me", value: "me" },
  { label: "Partner", value: "partner" },
  { label: "Shared", value: "shared" },
];

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

export default function ActionPlans() {
  const [actions, setActions] = useState(initialActionPlans);
  const [ownerFilter, setOwnerFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  const handleToggle = (id: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === id ? { ...action, completed: !action.completed } : action
      )
    );
  };

  const filteredActions = actions.filter((action) => {
    const matchesOwner = ownerFilter === "all" || action.owner === ownerFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !action.completed) ||
      (statusFilter === "completed" && action.completed);
    return matchesOwner && matchesStatus;
  });

  const pendingCount = actions.filter((a) => !a.completed).length;
  const completedCount = actions.filter((a) => a.completed).length;
  const highPriorityCount = actions.filter(
    (a) => a.priority === "high" && !a.completed
  ).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Action Plans" subtitle="Financial to-dos">
        <button className="p-2 rounded-full bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </button>
      </PageHeader>

      <div className="px-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-warning/10 rounded-xl p-3 text-center">
            <AlertTriangle className="h-5 w-5 text-warning mx-auto mb-1" />
            <p className="text-lg font-bold">{highPriorityCount}</p>
            <p className="text-[10px] text-muted-foreground">High Priority</p>
          </div>
          <div className="bg-muted rounded-xl p-3 text-center">
            <Clock className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold">{pendingCount}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </div>
          <div className="bg-success/10 rounded-xl p-3 text-center">
            <CheckCircle className="h-5 w-5 text-success mx-auto mb-1" />
            <p className="text-lg font-bold">{completedCount}</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                statusFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Owner Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {ownerFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setOwnerFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                ownerFilter === filter.value
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-muted card-shadow"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Action Plans List */}
        <section>
          <p className="text-xs text-muted-foreground mb-3">
            {filteredActions.length} action{filteredActions.length !== 1 && "s"}
          </p>
          <div className="space-y-3">
            {filteredActions.map((action, index) => (
              <ActionPlanItem
                key={action.id}
                action={action}
                onToggle={handleToggle}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
            {filteredActions.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No actions found</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
