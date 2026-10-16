'use client';

import dynamic from 'next/dynamic';

import { useDetectMobileViewport } from '@/hooks/use-detect-mobile-viewport';

type HeaderProductSearchProps = Readonly<{
  className?: string;
}>;

const DesktopHeaderProductSearch = dynamic(
  async () => {
    const search = await import('./header-product-search/desktop-header-product-search');
    return search.DesktopHeaderProductSearch;
  },
  { ssr: false },
);
const MobileHeaderProductSearch = dynamic(
  async () => {
    const search = await import('./header-product-search/mobile-header-product-search');
    return search.MobileHeaderProductSearch;
  },
  { ssr: false },
);

/** Renders the interaction model appropriate for the current viewport. */
export function HeaderProductSearch({ className }: HeaderProductSearchProps) {
  const isMobileViewport = useDetectMobileViewport();

  return isMobileViewport ? (
    <MobileHeaderProductSearch className={className} />
  ) : (
    <DesktopHeaderProductSearch className={className} />
  );
}
