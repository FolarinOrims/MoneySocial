import { OwnerBadge } from "./OwnerBadge";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: LucideIcon;
  owner: "me" | "partner" | "shared";
  dueDate?: string;
}

interface GoalCardProps {
  goal: Goal;
  className?: string;
  style?: React.CSSProperties;
}

export function GoalCard({ goal, className, style }: GoalCardProps) {
  const Icon = goal.icon;
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <div
      style={style}
      className={cn(
        "p-4 bg-card rounded-xl card-shadow animate-fade-in",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-soft">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{goal.title}</h3>
              <OwnerBadge owner={goal.owner} size="sm" />
            </div>
            {goal.dueDate && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Target: {goal.dueDate}
              </p>
            )}
          </div>
        </div>
      </div>
      <ProgressBar
        value={goal.currentAmount}
        max={goal.targetAmount}
        variant={percentage >= 100 ? "success" : "primary"}
        size="md"
      />
      <div className="flex justify-between mt-2">
        <p className="text-xs text-muted-foreground">
          ${goal.currentAmount.toLocaleString()}
        </p>
        <p className="text-xs font-medium">
          ${goal.targetAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
