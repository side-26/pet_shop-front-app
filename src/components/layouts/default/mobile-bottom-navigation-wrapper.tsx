import { Suspense } from 'react';

import { routePaths } from '@/configs/route.path';
import { getSession } from '@/utils/session';

import { MobileBottomNavigation, MobileBottomNavigationView } from './mobile-bottom-navigation';

async function MobileBottomNavigationContainer({
  sessionPromise,
}: Readonly<{ sessionPromise: ReturnType<typeof getSession> }>) {
  const session = await sessionPromise;

  return (
    <MobileBottomNavigation
      accountHref={session ? routePaths.profile : routePaths.login}
      accountLabel={session ? 'پروفایل' : 'حساب کاربری'}
    />
  );
}

export function MobileBottomNavigationWrapper() {
  const sessionPromise = getSession();

  return (
    <Suspense fallback={<MobileBottomNavigationView />}>
      <MobileBottomNavigationContainer sessionPromise={sessionPromise} />
    </Suspense>
  );
}
