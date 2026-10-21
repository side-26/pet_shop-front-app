'use client';

import { LogOut, Menu } from 'lucide-react';
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
import { useLogoutUser } from '@/entities/auth/auth.client';
import { useAuthStore } from '@/entities/auth/auth.store';
import { useCommonStore } from '@/stores/common.store';

import { mobileOverflowNavigationItems } from './navigation-items';

export function MobileHeaderMenu() {
  const userIdentity = useAuthStore((state) => state.userIdentity);
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const logoutUser = useLogoutUser();

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
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    showConfirmDialog({
                      title: 'از حساب خارج می‌شوید؟',
                      message: 'برای ادامه، لازم است دوباره وارد حساب کاربری خود شوید.',
                      icon: LogOut,
                      variant: 'warning',
                      onSuccess: logoutUser,
                    });
                  }}
                >
                  <LogOut aria-hidden="true" />
                  خروج از حساب
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
