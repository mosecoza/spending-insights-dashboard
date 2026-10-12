import { Car, Film, ShoppingBag, ShoppingCart, Utensils, Zap, type LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

const categoryIcons: Record<string, LucideIcon> = {
  'shopping-cart': ShoppingCart,
  film: Film,
  car: Car,
  utensils: Utensils,
  'shopping-bag': ShoppingBag,
  zap: Zap,
};

export function CategoryIcon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = categoryIcons[name];
  if (!Icon) return null;
  return <Icon aria-hidden="true" className={className} style={style} />;
}
