import {
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Utensils,
  Film,
  Zap,
  Briefcase,
  CreditCard,
  LucideIcon,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Plane,
  Wallet,
  TrendingUp,
  Target,
  CheckCircle,
} from "lucide-react";

// Map icon names to icon components
const iconMap: Record<string, LucideIcon> = {
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Utensils,
  Film,
  Zap,
  Briefcase,
  CreditCard,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Plane,
  Wallet,
  TrendingUp,
  Target,
  CheckCircle,
};

/**
 * Get an icon component by name
 * @param iconName - The name of the icon (must match a key in iconMap)
 * @returns The icon component or ShoppingCart as default
 */
export function getIconByName(iconName: string): LucideIcon {
  return iconMap[iconName] || ShoppingCart;
}

/**
 * Get the icon name from an icon component
 * @param icon - The icon component
 * @returns The icon name as a string
 */
export function getIconName(icon: LucideIcon): string {
  // Find the icon name by comparing function references
  for (const [name, IconComponent] of Object.entries(iconMap)) {
    if (IconComponent === icon) {
      return name;
    }
  }
  return "ShoppingCart"; // Default fallback
}



