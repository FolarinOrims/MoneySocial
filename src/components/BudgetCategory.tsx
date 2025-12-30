import { OwnerBadge } from "./OwnerBadge";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface BudgetCategoryData {
  id: string;
  name: string;
  spent: number;
  budget: number;
  icon: LucideIcon;
  owner: "me" | "partner" | "shared";
}

interface BudgetCategoryProps {
  category: BudgetCategoryData;
  className?: string;
  style?: React.CSSProperties;
}

export function BudgetCategory({ category, className, style }: BudgetCategoryProps) {
  const Icon = category.icon;
  const percentage = (category.spent / category.budget) * 100;
  const isOverBudget = percentage > 100;

  return (
    <div
      style={style}
      className={cn(
        "p-4 bg-card rounded-xl card-shadow animate-fade-in",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              isOverBudget ? "bg-destructive/10" : "bg-muted"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                isOverBudget ? "text-destructive" : "text-foreground"
              )}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">{category.name}</h3>
              <OwnerBadge owner={category.owner} size="sm" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "font-semibold text-sm",
              isOverBudget && "text-destructive"
            )}
          >
            ${category.spent.toFixed(0)}
          </p>
          <p className="text-xs text-muted-foreground">
            of ${category.budget.toFixed(0)}
          </p>
        </div>
      </div>
      <ProgressBar
        value={category.spent}
        max={category.budget}
        variant={isOverBudget ? "warning" : "primary"}
        size="sm"
      />
    </div>
  );
}
