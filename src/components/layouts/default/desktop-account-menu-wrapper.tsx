import { Suspense } from 'react';
import Link from 'next/link';
import { UserRound } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { getCurrentUser } from '@/entities/users/users.service';
import { cn } from '@/lib/utils';
import { getSession } from '@/utils/session';

import { DesktopAccountMenu } from './desktop-account-menu';

function DesktopLoginLink() {
  return (
    <Link
      href={routePaths.login}
      aria-label="حساب کاربری"
      data-icon-only="true"
      className={cn(
        buttonVariants({ variant: 'fill', color: 'primary', size: 'lg' }),
        'tw:hidden tw:lg:inline-flex',
      )}
    >
      <UserRound aria-hidden="true" />
    </Link>
  );
}

async function getDesktopAccountUser() {
  if (!(await getSession())) return null;
  return getCurrentUser();
}

async function DesktopAccountMenuContainer({
  accountUserPromise,
}: Readonly<{ accountUserPromise: ReturnType<typeof getDesktopAccountUser> }>) {
  const result = await accountUserPromise;

  if (!result?.isSuccess) return <DesktopLoginLink />;

  return (
    <div className="tw:hidden tw:lg:block">
      <DesktopAccountMenu user={result.data} />
    </div>
  );
}

export function DesktopAccountMenuWrapper() {
  const accountUserPromise = getDesktopAccountUser();

  return (
    <Suspense fallback={<DesktopLoginLink />}>
      <DesktopAccountMenuContainer accountUserPromise={accountUserPromise} />
    </Suspense>
  );
}
