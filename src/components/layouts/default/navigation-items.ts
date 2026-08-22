import { House, PawPrint, ShoppingCart, UserRound } from 'lucide-react';

import { routePaths } from '@/configs/route.path';

export const desktopNavigationItems = [
  { label: 'خانه', href: routePaths.home },
  { label: 'نژاد حیوانات', href: routePaths.pets },
  { label: 'محصولات', href: routePaths.products },
] as const;

export const mobileNavigationItems = [
  { label: 'خانه', href: routePaths.home, icon: House },
  { label: 'حیوانات', href: routePaths.pets, icon: PawPrint },
  { label: 'سبد خرید', href: routePaths.cart, icon: ShoppingCart },
  { label: 'پروفایل', href: routePaths.profile, icon: UserRound },
] as const;

export function isNavigationItemActive(pathname: string, href: string) {
  return href === routePaths.home
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}
