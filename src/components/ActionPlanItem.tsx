import { OwnerBadge } from "./OwnerBadge";
import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  owner: "me" | "partner" | "shared";
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate?: string;
}

interface ActionPlanItemProps {
  action: ActionPlan;
  onToggle?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const priorityStyles = {
  high: "border-l-destructive",
  medium: "border-l-warning",
  low: "border-l-muted-foreground",
};

export function ActionPlanItem({ action, onToggle, className, style }: ActionPlanItemProps) {
  return (
    <div
      style={style}
      className={cn(
        "p-4 bg-card rounded-xl card-shadow border-l-4 animate-fade-in",
        priorityStyles[action.priority],
        action.completed && "opacity-60",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle?.(action.id)}
          className={cn(
            "mt-0.5 p-0.5 rounded-full transition-colors",
            action.completed
              ? "bg-success text-success-foreground"
              : "border-2 border-muted-foreground text-transparent hover:border-primary"
          )}
        >
          {action.completed ? (
            <Check className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={cn(
                "font-semibold text-sm",
                action.completed && "line-through"
              )}
            >
              {action.title}
            </h3>
            <OwnerBadge owner={action.owner} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {action.description}
          </p>
          {action.dueDate && (
            <p className="text-xs text-muted-foreground mt-2">
              Due: {action.dueDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
