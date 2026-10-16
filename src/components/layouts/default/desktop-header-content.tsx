import { Suspense } from 'react';

import { ThemeToggle } from '@/components/ui/theme-toggle';

import { Brand } from './brand';
import { DesktopAccountButton } from './desktop-account-button';
import { DesktopCartButton } from './desktop-cart-button';
import { DesktopNavigation, DesktopNavigationView } from './desktop-navigation';
import { HeaderProductSearch } from './header-product-search';

export function DesktopHeaderContent() {
  return (
    <>
      <div className="tw:flex tw:shrink-0 tw:items-center tw:gap-1">
        <Brand size="compact" />
      </div>

      <Suspense fallback={<DesktopNavigationView />}>
        <DesktopNavigation />
      </Suspense>

      <div className="tw:flex tw:min-w-0 tw:flex-1 tw:items-center tw:gap-1 tw:sm:gap-1.5 tw:lg:flex-none">
        <HeaderProductSearch className="tw:flex-1" />
        <ThemeToggle variant="icon" />
        <DesktopCartButton />
        <DesktopAccountButton />
      </div>
    </>
  );
}
