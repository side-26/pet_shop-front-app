import { HeartHandshake, House, Info, PawPrint, ShoppingBag, ShoppingCart } from 'lucide-react';

import { routePaths } from '@/configs/route.path';

export const desktopNavigationItems = [
  { label: 'خانه', href: routePaths.home },
  { label: 'حیوانات', href: routePaths.pets },
  { label: 'محصولات', href: routePaths.products },
  { label: 'خدمات ما', href: routePaths.services },
  { label: 'درباره ما', href: routePaths.about },
] as const;

export const mobileNavigationItems = [
  { label: 'خانه', href: routePaths.home, icon: House },
  { label: 'حیوانات', href: routePaths.pets, icon: PawPrint },
  { label: 'محصولات', href: routePaths.products, icon: ShoppingBag },
  { label: 'خدمات', href: routePaths.services, icon: HeartHandshake },
  { label: 'درباره ما', href: routePaths.about, icon: Info },
  { label: 'سبد خرید', href: routePaths.cart, icon: ShoppingCart },
] as const;

export function isNavigationItemActive(pathname: string, href: string) {
  return href === routePaths.home
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}
