import { LucideIcon } from "lucide-react";

// Frontend Transaction type (with icon component)
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  icon: LucideIcon;
  owner: "me" | "partner" | "shared";
  date: string;
}

// API Transaction type (with icon as string)
export interface TransactionAPI {
  id: string;
  description: string;
  amount: number;
  category: string;
  icon: string; // Icon name as string
  owner: "me" | "partner" | "shared";
  date: string;
}



