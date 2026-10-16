import { Suspense } from 'react';

import { routePaths } from '@/configs/route.path';
import { getSession } from '@/utils/session';

import { LazyMobileBottomNavigation } from './lazy-mobile-bottom-navigation';

async function MobileBottomNavigationContainer({
  sessionPromise,
}: Readonly<{ sessionPromise: ReturnType<typeof getSession> }>) {
  const session = await sessionPromise;

  return (
    <LazyMobileBottomNavigation
      accountHref={session ? routePaths.profile : routePaths.login}
      accountLabel={session ? 'پروفایل' : 'حساب کاربری'}
    />
  );
}

export function MobileBottomNavigationWrapper() {
  const sessionPromise = getSession();

  return (
    <Suspense fallback={null}>
      <MobileBottomNavigationContainer sessionPromise={sessionPromise} />
    </Suspense>
  );
}
