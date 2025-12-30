import { cn } from "@/lib/utils";

type Owner = "me" | "partner" | "shared";

interface OwnerBadgeProps {
  owner: Owner;
  size?: "sm" | "md";
  className?: string;
}

const ownerConfig = {
  me: {
    label: "Me",
    className: "bg-primary text-primary-foreground",
  },
  partner: {
    label: "Partner",
    className: "bg-secondary text-secondary-foreground",
  },
  shared: {
    label: "Shared",
    className: "bg-accent text-accent-foreground",
  },
};

export function OwnerBadge({ owner, size = "sm", className }: OwnerBadgeProps) {
  const config = ownerConfig[owner];
  
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
