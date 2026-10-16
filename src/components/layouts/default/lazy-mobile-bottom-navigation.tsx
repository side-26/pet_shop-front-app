'use client';

import dynamic from 'next/dynamic';

import { useDetectMobileViewport } from '@/hooks/use-detect-mobile-viewport';

const MobileBottomNavigation = dynamic(
  async () => {
    const mobileNavigation = await import('./mobile-bottom-navigation');
    return mobileNavigation.MobileBottomNavigation;
  },
  { ssr: false },
);

type LazyMobileBottomNavigationProps = Readonly<{
  accountHref: string;
  accountLabel: string;
}>;

export function LazyMobileBottomNavigation({
  accountHref,
  accountLabel,
}: LazyMobileBottomNavigationProps) {
  const isMobileViewport = useDetectMobileViewport();

  if (!isMobileViewport) return null;

  return <MobileBottomNavigation accountHref={accountHref} accountLabel={accountLabel} />;
}
