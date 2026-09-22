'use client';

import { UserRound } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { useAuthStore } from '@/entities/auth/auth.store';
import { cn } from '@/lib/utils';

import { DesktopAccountMenu } from './desktop-account-menu';

export function DesktopAccountButton() {
  const userIdentity = useAuthStore((state) => state.userIdentity);

  if (userIdentity) {
    return (
      <div className="tw:hidden tw:lg:block">
        <DesktopAccountMenu user={userIdentity} />
      </div>
    );
  }

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
