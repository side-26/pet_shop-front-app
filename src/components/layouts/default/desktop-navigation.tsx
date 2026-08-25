'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { desktopNavigationItems, isNavigationItemActive } from './navigation-items';

export function DesktopNavigationView({ pathname }: Readonly<{ pathname?: string }>) {
  return (
    <nav
      className="tw:hidden tw:items-center tw:gap-5 tw:lg:flex tw:xl:gap-7"
      aria-label="ناوبری اصلی"
    >
      {desktopNavigationItems.map(({ href, label }) => {
        const isActive = pathname ? isNavigationItemActive(pathname, href) : false;

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'tw:rounded-sm tw:border-b-2 tw:border-transparent tw:pb-1 tw:text-body-m tw:text-muted-foreground tw:outline-none tw:transition-colors tw:hover:text-primary tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25',
              isActive && 'tw:border-primary tw:font-bold tw:text-primary',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DesktopNavigation() {
  return <DesktopNavigationView pathname={usePathname()} />;
}
