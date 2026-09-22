'use client';

import { LogOut, Package, UserRound } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { logoutUser } from '@/entities/auth/auth.client';
import type { CurrentUserDTO } from '@/entities/users/users.dto';

type Props = Readonly<{ user: CurrentUserDTO }>;

export function DesktopAccountMenu({ user }: Props) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.phoneNumber;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button iconOnly size="lg" aria-label="حساب کاربری" variant="fill" />}
      >
        <UserRound aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="tw:min-w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="tw:flex tw:items-center tw:gap-3">
            <Avatar size="lg">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={`تصویر پروفایل ${fullName}`} />
              ) : null}
              <AvatarFallback className="tw:bg-primary-muted tw:font-bold tw:text-primary">
                {fullName.slice(0, 1) || '_'}
              </AvatarFallback>
            </Avatar>
            <span className="tw:min-w-0 tw:truncate tw:text-label-m tw:font-bold tw:text-foreground">
              <bdi dir={user.firstName || user.lastName ? undefined : 'ltr'}>{fullName}</bdi>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuItem render={<Link href={routePaths.profile} />}>
            <UserRound aria-hidden="true" />
            پروفایل
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Package aria-hidden="true" />
            سفارش‌ها
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => void logoutUser()}>
            <LogOut aria-hidden="true" />
            خروج
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
