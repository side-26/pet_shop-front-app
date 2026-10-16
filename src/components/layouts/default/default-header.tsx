'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

import { useDetectMobileViewport } from '@/hooks/use-detect-mobile-viewport';

const DesktopHeaderContent = dynamic(
  async () => {
    const desktopHeader = await import('./desktop-header-content');
    return desktopHeader.DesktopHeaderContent;
  },
  { ssr: false },
);
const MobileHeaderContent = dynamic(
  async () => {
    const mobileHeader = await import('./mobile-header-content');
    return mobileHeader.MobileHeaderContent;
  },
  { ssr: false },
);

function subscribeToHydration() {
  return () => undefined;
}

export function DefaultHeader() {
  const isMobileViewport = useDetectMobileViewport();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  return (
    <header className="tw:fixed tw:inset-x-0 tw:top-0 tw:z-50 tw:border-b tw:border-border/60 tw:bg-background/82 tw:shadow-sm tw:supports-backdrop-filter:backdrop-blur-2xl">
      <div className="tw:default-layout-container tw:flex tw:h-[76px] tw:items-center tw:justify-between tw:gap-3 tw:lg:h-[88px]">
        {isHydrated ? isMobileViewport ? <MobileHeaderContent /> : <DesktopHeaderContent /> : null}
      </div>
    </header>
  );
}
