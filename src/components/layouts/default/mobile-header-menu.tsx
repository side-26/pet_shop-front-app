'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { mobileOverflowNavigationItems } from './navigation-items';

export function MobileHeaderMenu() {
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
