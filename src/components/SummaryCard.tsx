import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 card-shadow animate-fade-in",
        variant === "default" && "bg-card",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              "text-xs font-medium uppercase tracking-wide",
              variant === "default" && "text-muted-foreground",
              variant !== "default" && "opacity-80"
            )}
          >
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "text-xs mt-1",
                variant === "default" && "text-muted-foreground",
                variant !== "default" && "opacity-70"
              )}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium mt-2",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-2 rounded-lg",
            variant === "default" && "bg-muted",
            variant !== "default" && "bg-background/20"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
