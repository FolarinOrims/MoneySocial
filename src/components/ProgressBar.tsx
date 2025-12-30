import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: "primary" | "secondary" | "success" | "warning";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  variant = "primary",
  size = "sm",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full rounded-full bg-muted overflow-hidden",
          size === "sm" && "h-2",
          size === "md" && "h-3"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variant === "primary" && "bg-primary",
            variant === "secondary" && "bg-secondary",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {percentage.toFixed(0)}%
        </p>
      )}
    </div>
  );
}
