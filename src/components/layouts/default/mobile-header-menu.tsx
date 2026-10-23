'use client';

import { Heart, Menu } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { routePaths } from '@/configs/route.path';
import { useAuthStore } from '@/entities/auth/auth.store';

import { AccountLogoutMenuItem } from './account-logout-menu-item';
import { mobileOverflowNavigationItems } from './navigation-items';

export function MobileHeaderMenu() {
  const userIdentity = useAuthStore((state) => state.userIdentity);

  return (
    <div className="tw:lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button iconOnly variant="tonal" aria-label="باز کردن منوی بیشتر" />}
        >
          <Menu aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="tw:min-w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>صفحات بیشتر</DropdownMenuLabel>
            {mobileOverflowNavigationItems.map(({ href, icon: Icon, label }) => (
              <DropdownMenuItem key={href} render={<Link href={href} />}>
                <Icon aria-hidden="true" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          {userIdentity ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link href={routePaths.profileWishList} />}>
                  <Heart aria-hidden="true" />
                  علاقه‌مندی‌ها
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <AccountLogoutMenuItem label="خروج از حساب" />
              </DropdownMenuGroup>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
