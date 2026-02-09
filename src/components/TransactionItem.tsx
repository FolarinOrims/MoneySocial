import { OwnerBadge } from "./OwnerBadge";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/transaction";

interface TransactionItemProps {
  transaction: Transaction;
  className?: string;
  style?: React.CSSProperties;
}

export function TransactionItem({ transaction, className, style }: TransactionItemProps) {
  const Icon = transaction.icon;
  const isExpense = transaction.amount < 0;

  return (
    <div
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 bg-card rounded-xl card-shadow animate-fade-in",
        className
      )}
    >
      <div className="p-2.5 rounded-xl bg-muted">
        <Icon className="h-5 w-5 text-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{transaction.description}</p>
          <OwnerBadge owner={transaction.owner} size="sm" />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {transaction.category} • {transaction.date}
        </p>
      </div>
      <p
        className={cn(
          "font-semibold text-sm",
          isExpense ? "text-foreground" : "text-success"
        )}
      >
        {isExpense ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
      </p>
    </div>
  );
}
