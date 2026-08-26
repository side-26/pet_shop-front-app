'use client';

import { Menu, PanelRightClose, PanelRightOpen, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ConfirmDialog } from '@/components/common/confirm-dialog/main';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { logoutUser } from '@/entities/auth/auth.client';
import { useCommonStore } from '@/stores/common.store';

import {
  adminLogoutItem,
  adminNavigationItems,
  adminUtilityItems,
  getAdminNavigationItem,
  isAdminNavigationItemActive,
} from './admin-navigation-items';

type AdminLayoutShellProps = Readonly<{ children: React.ReactNode }>;

type AdminNavigationProps = Readonly<{
  collapsed?: boolean;
  pathname: string;
  onNavigate?: () => void;
}>;

function AdminIdentity({ collapsed = false }: Readonly<{ collapsed?: boolean }>) {
  return (
    <div
      className={cn(
        'tw:flex tw:min-h-16 tw:items-center tw:gap-3 tw:overflow-hidden tw:px-3',
        collapsed && 'tw:justify-center tw:px-2',
      )}
    >
      <Avatar size="lg">
        <AvatarFallback className="tw:bg-primary-muted tw:font-bold tw:text-primary">
          م
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'tw:min-w-0 tw:flex-1 tw:transition-[opacity,transform] tw:duration-200 tw:motion-reduce:transition-none',
          collapsed && 'tw:pointer-events-none tw:absolute tw:translate-x-2 tw:opacity-0',
        )}
      >
        <p className="tw:truncate tw:text-label-m tw:font-bold tw:text-sidebar-foreground">
          پنل مدیریت
        </p>
        <p className="tw:truncate tw:text-label-s tw:text-muted-foreground">مدیر ارشد</p>
      </div>
    </div>
  );
}

function AdminNavigationLink({
  collapsed = false,
  disabled = false,
  href,
  icon: Icon,
  isActive,
  label,
  onNavigate,
}: Readonly<{
  collapsed?: boolean;
  disabled?: boolean;
  href: string;
  icon: (typeof adminNavigationItems)[number]['icon'];
  isActive: boolean;
  label: string;
  onNavigate?: () => void;
}>) {
  const linkClassName = cn(
    buttonVariants({
      variant: isActive ? 'fill' : 'flat',
      color: isActive ? 'primary' : 'secondary',
      size: 'sm',
      block: !collapsed,
    }),
    'tw:h-10 tw:text-label-s',
    isActive
      ? 'tw:bg-primary tw:text-primary-foreground tw:hover:bg-primary/80 tw:hover:text-primary-foreground'
      : 'tw:text-foreground tw:hover:bg-primary/80 tw:hover:text-primary-foreground tw:active:text-primary-foreground',
    disabled && 'tw:pointer-events-none tw:opacity-50',
    collapsed ? 'tw:justify-center' : 'tw:justify-start',
  );

  const linkContent = (
    <>
      <Icon data-icon="inline-start" aria-hidden="true" />
      {!collapsed && <span className="tw:truncate">{label}</span>}
    </>
  );

  const link = disabled ? (
    <span
      aria-disabled="true"
      aria-label={collapsed ? label : undefined}
      data-slot="admin-navigation-link"
      data-icon-only={collapsed || undefined}
      className={linkClassName}
    >
      {linkContent}
    </span>
  ) : (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      aria-current={isActive ? 'page' : undefined}
      data-slot="admin-navigation-link"
      data-icon-only={collapsed || undefined}
      className={linkClassName}
    >
      {linkContent}
    </Link>
  );

  if (!collapsed || disabled) return link;

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}

function AdminNavigation({ collapsed = false, pathname, onNavigate }: AdminNavigationProps) {
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);

  return (
    <TooltipProvider>
      <div className="tw:flex tw:h-full tw:min-h-0 tw:flex-col">
        <AdminIdentity collapsed={collapsed} />
        <Separator />

        <nav aria-label="ناوبری مدیریت" className="tw:flex-1 tw:overflow-y-auto tw:px-2 tw:py-4">
          <ul className="tw:flex tw:flex-col tw:gap-1.5">
            {adminNavigationItems.map((item) => (
              <li key={item.href} className={cn(collapsed && 'tw:flex tw:justify-center')}>
                <AdminNavigationLink
                  {...item}
                  collapsed={collapsed}
                  isActive={isAdminNavigationItemActive(pathname, item.href)}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </nav>

        <Separator />
        <nav aria-label="حساب مدیریت" className="tw:px-2 tw:py-3">
          <ul className="tw:flex tw:flex-col tw:gap-1">
            {adminUtilityItems.map((item) => (
              <li key={item.href} className={cn(collapsed && 'tw:flex tw:justify-center')}>
                <AdminNavigationLink
                  {...item}
                  collapsed={collapsed}
                  isActive={isAdminNavigationItemActive(pathname, item.href)}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
            <li className={cn(collapsed && 'tw:flex tw:justify-center')}>
              <Button
                aria-label={collapsed ? adminLogoutItem.label : undefined}
                block={!collapsed}
                color="error"
                data-icon-only={collapsed || undefined}
                size="sm"
                variant="flat"
                className={cn(
                  'tw:h-10 tw:text-label-s tw:text-foreground tw:hover:bg-error tw:hover:text-error-foreground tw:active:text-error-foreground',
                  collapsed ? 'tw:justify-center' : 'tw:justify-start',
                )}
                onClick={() => {
                  onNavigate?.();
                  showConfirmDialog({
                    title: 'از پنل خارج می‌شوید؟',
                    message: 'برای ادامه، لازم است دوباره وارد حساب کاربری خود شوید.',
                    icon: adminLogoutItem.icon,
                    variant: 'warning',
                    onSuccess: logoutUser,
                  });
                }}
              >
                <adminLogoutItem.icon data-icon="inline-start" aria-hidden="true" />
                {!collapsed && <span className="tw:truncate">{adminLogoutItem.label}</span>}
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </TooltipProvider>
  );
}

export function AdminLayoutShellView({
  children,
  pathname,
}: AdminLayoutShellProps & { pathname: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const currentNavigationItem = getAdminNavigationItem(pathname);
  const CurrentNavigationIcon = currentNavigationItem.icon;

  return (
    <div className="tw:flex tw:min-h-svh tw:bg-muted/50 tw:text-foreground">
      <aside
        data-collapsed={collapsed}
        className={cn(
          'tw:sticky tw:top-0 tw:hidden tw:h-svh tw:shrink-0 tw:overflow-hidden tw:border-e tw:border-sidebar-border tw:bg-sidebar tw:shadow-sm tw:transition-[width] tw:duration-300 tw:ease-out tw:motion-reduce:transition-none tw:md:block',
          collapsed ? 'tw:w-20' : 'tw:w-64 tw:xl:w-72',
        )}
      >
        <AdminNavigation collapsed={collapsed} pathname={pathname} />
      </aside>

      <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col">
        <header className="tw:px-4 tw:pt-3 tw:pb-1 tw:sm:pt-4 tw:md:pt-4 tw:md:pb-[5px]">
          <Card variant="elevated" size="xs" data-slot="admin-header-card" className="tw:h-16">
            <CardContent className="tw:flex tw:flex-1 tw:items-center tw:justify-between tw:gap-3">
              <div className="tw:flex tw:items-center tw:gap-2">
                <Button
                  iconOnly
                  variant="tonal"
                  aria-label="باز کردن منوی مدیریت"
                  onClick={() => setMobileNavigationOpen(true)}
                  className="tw:md:hidden"
                >
                  <Menu aria-hidden="true" />
                </Button>
                <Button
                  iconOnly
                  variant="flat"
                  size="sm"
                  aria-label={collapsed ? 'باز کردن نوار مدیریت' : 'جمع کردن نوار مدیریت'}
                  aria-expanded={!collapsed}
                  onClick={() => setCollapsed((value) => !value)}
                  className="tw:hidden tw:md:inline-flex"
                >
                  {collapsed ? (
                    <PanelRightOpen aria-hidden="true" />
                  ) : (
                    <PanelRightClose aria-hidden="true" />
                  )}
                </Button>
                <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-2">
                  <CurrentNavigationIcon
                    data-slot="admin-page-title-icon"
                    aria-hidden="true"
                    className="tw:size-5 tw:shrink-0"
                  />
                  <h1 className="tw:truncate tw:text-title-s tw:font-extrabold">
                    {currentNavigationItem.label}
                  </h1>
                </div>
              </div>

              <Button iconOnly variant="tonal" aria-label="تازه‌سازی صفحه">
                <RotateCcw aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        </header>

        <main className="tw:flex tw:min-h-0 tw:flex-1 tw:px-4 tw:pt-3 tw:md:pt-[11px]">
          <Card
            variant="elevated"
            data-slot="admin-content-card"
            className="tw:min-h-0 tw:w-full tw:flex-1 tw:gap-0 tw:rounded-b-none tw:p-[6px]"
          >
            <CardContent className="tw:min-h-0 tw:flex-1 tw:p-0">{children}</CardContent>
          </Card>
        </main>
      </div>

      <Drawer
        open={mobileNavigationOpen}
        onOpenChange={setMobileNavigationOpen}
        swipeDirection="left"
      >
        <DrawerContent color="primary">
          <DrawerTitle className="tw:sr-only">منوی مدیریت</DrawerTitle>
          <DrawerDescription className="tw:sr-only">دسترسی به بخش‌های پنل مدیریت</DrawerDescription>
          <AdminNavigation pathname={pathname} onNavigate={() => setMobileNavigationOpen(false)} />
        </DrawerContent>
      </Drawer>
      <ConfirmDialog />
    </div>
  );
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  return <AdminLayoutShellView pathname={usePathname()}>{children}</AdminLayoutShellView>;
}
