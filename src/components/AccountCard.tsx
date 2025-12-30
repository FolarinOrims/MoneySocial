import { OwnerBadge } from "./OwnerBadge";
import { cn } from "@/lib/utils";
import { CreditCard, Building2, Wallet } from "lucide-react";

export interface Account {
  id: string;
  name: string;
  institution: string;
  balance: number;
  type: "checking" | "savings" | "credit";
  owner: "me" | "partner" | "shared";
}

interface AccountCardProps {
  account: Account;
  className?: string;
}

const accountIcons = {
  checking: Building2,
  savings: Wallet,
  credit: CreditCard,
};

export function AccountCard({ account, className }: AccountCardProps) {
  const Icon = accountIcons[account.type];
  const isCredit = account.type === "credit";

  return (
    <div
      className={cn(
        "p-4 bg-card rounded-xl card-shadow animate-fade-in min-w-[200px]",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        <OwnerBadge owner={account.owner} size="sm" />
      </div>
      <p className="font-medium text-sm">{account.name}</p>
      <p className="text-xs text-muted-foreground">{account.institution}</p>
      <p
        className={cn(
          "text-xl font-bold mt-2",
          isCredit && account.balance < 0 && "text-destructive"
        )}
      >
        ${Math.abs(account.balance).toLocaleString()}
      </p>
      <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
    </div>
  );
}
