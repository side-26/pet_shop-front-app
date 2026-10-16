import { ThemeToggle } from '@/components/ui/theme-toggle';

import { Brand } from './brand';
import { HeaderProductSearch } from './header-product-search';
import { MobileHeaderMenu } from './mobile-header-menu';

export function MobileHeaderContent() {
  return (
    <>
      <div className="tw:flex tw:shrink-0 tw:items-center tw:gap-1">
        <Brand size="compact" showName={false} />
        <MobileHeaderMenu />
      </div>

      <div className="tw:flex tw:shrink-0 tw:items-center tw:gap-1 tw:sm:gap-1.5">
        <HeaderProductSearch />
        <ThemeToggle variant="icon" />
      </div>
    </>
  );
}
