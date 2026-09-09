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
              'tw:relative tw:pb-2 tw:text-body-m tw:text-muted-foreground tw:outline-none tw:transition-colors tw:after:pointer-events-none tw:after:absolute tw:after:inset-x-0 tw:after:bottom-0 tw:after:h-0.5 tw:after:origin-right tw:after:scale-x-0 tw:after:bg-primary tw:after:transition-transform tw:after:duration-200 tw:after:ease-out tw:hover:text-primary tw:hover:after:scale-x-100 tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25 tw:focus-visible:after:scale-x-100 tw:motion-reduce:transition-none tw:motion-reduce:after:transition-none',
              isActive && 'tw:after:scale-x-100 tw:font-bold tw:text-primary',
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
