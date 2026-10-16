'use client';

import { Search } from 'lucide-react';
import { useMemo, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { useDialogController } from '@/hooks/use-dialog-controller';
import { cn } from '@/lib/utils';

import { HeaderProductSearchProvider } from './header-product-search-context';
import {
  HeaderProductSearchNavigationDrawer,
  type HeaderProductSearchNavigationDrawerHandle,
} from './search-suggestions-navigation-drawer';

type MobileHeaderProductSearchProps = Readonly<{
  className?: string;
}>;

export function MobileHeaderProductSearch({ className }: MobileHeaderProductSearchProps) {
  const searchDrawerRef = useRef<HeaderProductSearchNavigationDrawerHandle>(null);
  const { open: openSearchDrawer } = useDialogController(
    useMemo(() => ({ mobileSearch: { ref: searchDrawerRef } }), []),
  );

  return (
    <HeaderProductSearchProvider onCloseHoverCard={() => searchDrawerRef.current?.close()}>
      <div className={cn('tw:shrink-0', className)}>
        <Button
          type="button"
          iconOnly
          size="lg"
          variant="flat"
          color="secondary"
          aria-label="باز کردن جستجوی سریع"
          onClick={() => openSearchDrawer('mobileSearch', { initialSuggestions: [], query: '' })}
        >
          <Search aria-hidden="true" />
        </Button>
      </div>
      <HeaderProductSearchNavigationDrawer ref={searchDrawerRef} />
    </HeaderProductSearchProvider>
  );
}
