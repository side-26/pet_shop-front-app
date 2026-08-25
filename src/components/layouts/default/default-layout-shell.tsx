import { Suspense } from 'react';

import { DefaultFooter } from './default-footer';
import { DefaultHeader } from './default-header';
import { MobileBottomNavigation, MobileBottomNavigationView } from './mobile-bottom-navigation';

type DefaultLayoutShellProps = Readonly<{
  children: React.ReactNode;
}>;

export function DefaultLayoutShell({ children }: DefaultLayoutShellProps) {
  return (
    <div className="tw:flex tw:min-h-svh tw:flex-col tw:bg-background tw:text-foreground">
      <DefaultHeader />
      <main className="tw:flex-1 tw:pt-[76px] tw:pb-24 tw:sm:pb-28 tw:lg:pt-[88px] tw:lg:pb-0">
        {children}
      </main>
      <DefaultFooter />
      <Suspense fallback={<MobileBottomNavigationView />}>
        <MobileBottomNavigation />
      </Suspense>
    </div>
  );
}
