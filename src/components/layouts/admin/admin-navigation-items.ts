import {
  CircleHelp,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Package,
  PawPrint,
  Settings,
  UsersRound,
} from 'lucide-react';

import { routePaths } from '@/configs/route.path';

export const adminNavigationItems = [
  { label: 'داشبورد', href: routePaths.admin, icon: LayoutDashboard },
  { label: 'حیوانات', href: routePaths.adminPage('pets'), icon: PawPrint },
  { label: 'محصولات', href: routePaths.adminPage('products'), icon: Package },
  { label: 'کاربران', href: routePaths.adminPage('users'), icon: UsersRound },
  { label: 'تنظیمات', href: routePaths.adminPage('settings'), icon: Settings },
] as const;

export const adminUtilityItems = [
  { label: 'پروفایل', href: routePaths.adminPage('profile'), icon: CircleUserRound },
  { label: 'پشتیبانی', href: routePaths.adminPage('support'), icon: CircleHelp },
] as const;

export const adminLogoutItem = {
  label: 'خروج',
  href: routePaths.login,
  icon: LogOut,
} as const;

export function isAdminNavigationItemActive(pathname: string, href: string) {
  return href === routePaths.admin
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}
