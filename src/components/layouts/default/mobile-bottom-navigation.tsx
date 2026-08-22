'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { isNavigationItemActive, mobileNavigationItems } from './navigation-items';

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="tw:fixed tw:inset-x-0 tw:bottom-0 tw:z-40 tw:border-t tw:border-border/70 tw:bg-background/92 tw:px-1 tw:pb-[max(0.5rem,env(safe-area-inset-bottom))] tw:shadow-lg tw:supports-backdrop-filter:backdrop-blur-2xl tw:sm:inset-x-auto tw:sm:bottom-4 tw:sm:left-1/2 tw:sm:w-[calc(100%_-_3rem)] tw:sm:max-w-3xl tw:sm:-translate-x-1/2 tw:sm:rounded-2xl tw:sm:border tw:sm:px-3 tw:sm:pb-2 tw:lg:hidden"
      aria-label="ناوبری موبایل"
    >
      <ul className="tw:mx-auto tw:grid tw:h-16 tw:grid-cols-6 tw:items-center tw:sm:h-[68px]">
        {mobileNavigationItems.map(({ href, label, icon: Icon }) => {
          const isActive = isNavigationItemActive(pathname, href);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className="tw:group tw:relative tw:flex tw:min-h-14 tw:flex-col tw:items-center tw:justify-center tw:gap-0.5 tw:rounded-xl tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'tw:flex tw:size-7 tw:items-center tw:justify-center tw:rounded-lg tw:text-muted-foreground tw:transition-[background-color,color,box-shadow] tw:group-hover:bg-primary-muted tw:group-hover:text-primary tw:motion-reduce:transition-none tw:sm:size-8 tw:sm:rounded-xl',
                    isActive && 'tw:bg-primary tw:text-primary-foreground tw:shadow-sm',
                  )}
                >
                  <Icon className="tw:size-4 tw:sm:size-4.5" />
                </span>
                <span
                  className={cn(
                    'tw:max-w-full tw:truncate tw:text-[0.625rem] tw:leading-4 tw:text-muted-foreground tw:transition-colors tw:group-hover:text-primary tw:sm:text-label-s',
                    isActive && 'tw:font-bold tw:text-primary',
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
