import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { Brand } from './brand';
import { DesktopNavigation, DesktopNavigationView } from './desktop-navigation';
import { HeaderProductSearch } from './header-product-search';
import { DesktopAccountButton } from './desktop-account-button';
import { MobileHeaderMenu } from './mobile-header-menu';

export function DefaultHeader() {
  return (
    <header className="tw:fixed tw:inset-x-0 tw:top-0 tw:z-50 tw:border-b tw:border-border/60 tw:bg-background/82 tw:shadow-sm tw:supports-backdrop-filter:backdrop-blur-2xl">
      <div className="tw:default-layout-container tw:flex tw:h-[76px] tw:items-center tw:justify-between tw:gap-3 tw:lg:h-[88px]">
        <div className="tw:flex tw:shrink-0 tw:items-center tw:gap-1">
          <Brand size="compact" showName={false} className="tw:lg:hidden" />
          <MobileHeaderMenu />
          <Brand size="compact" className="tw:hidden tw:lg:inline-flex" />
        </div>

        <Suspense fallback={<DesktopNavigationView />}>
          <DesktopNavigation />
        </Suspense>

        <div className="tw:flex tw:min-w-0 tw:flex-1 tw:items-center tw:gap-1 tw:sm:gap-1.5 tw:lg:flex-none">
          <HeaderProductSearch className="tw:flex-1" />
          <ThemeToggle variant="icon" />
          <Link
            href={routePaths.cart}
            aria-label="سبد خرید"
            data-icon-only="true"
            className={cn(
              buttonVariants({ variant: 'tonal', color: 'primary', size: 'lg' }),
              'tw:hidden tw:lg:inline-flex',
            )}
          >
            <ShoppingCart aria-hidden="true" />
          </Link>
          <DesktopAccountButton />
        </div>
      </div>
    </header>
  );
}
