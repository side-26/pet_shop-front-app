import {
  CircleHelp,
  CircleUserRound,
  Dog,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  PawPrint,
  Settings,
  ShoppingCart,
  Tags,
  UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { routePaths } from '@/configs/route.path';

export type AdminNavigationItem = Readonly<{
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}>;

export const adminNavigationItems = [
  { label: 'داشبورد', href: routePaths.admin, icon: LayoutDashboard },
  { label: 'سفارش‌ها', href: routePaths.adminPage('orders'), icon: ShoppingCart },
  { label: 'محصولات', href: routePaths.adminPage('products'), icon: Package },
  { label: 'حیوانات', href: routePaths.adminPage('pets'), icon: PawPrint },
  { label: 'دسته‌بندی', href: routePaths.adminCategories, icon: Tags },
  { label: 'زیردسته‌بندی', href: routePaths.adminSubCategories, icon: FolderTree },
  { label: 'نژاد', href: routePaths.adminBreeds, icon: Dog },
  { label: 'نوع حیوان', href: routePaths.adminPetTypes, icon: PawPrint },
  { label: 'کاربران', href: routePaths.adminPage('users'), icon: UsersRound },
  {
    label: 'تنظیمات',
    href: routePaths.adminPage('settings'),
    icon: Settings,
    disabled: true,
  },
] as const satisfies ReadonlyArray<AdminNavigationItem>;

export const adminUtilityItems = [
  { label: 'پروفایل', href: routePaths.adminPage('profile'), icon: CircleUserRound },
  { label: 'پشتیبانی', href: routePaths.adminPage('support'), icon: CircleHelp },
] as const;

export const adminLogoutItem = {
  label: 'خروج',
  icon: LogOut,
} as const;

export function isAdminNavigationItemActive(pathname: string, href: string) {
  return href === routePaths.admin
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminNavigationItem(pathname: string): AdminNavigationItem {
  return (
    adminNavigationItems.find((item) => isAdminNavigationItemActive(pathname, item.href)) ??
    adminNavigationItems[0]
  );
}
