import { Menu, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { Brand } from './brand';
import { DesktopNavigation } from './desktop-navigation';

export function DefaultHeader() {
  return (
    <header className="tw:fixed tw:inset-x-0 tw:top-0 tw:z-50 tw:border-b tw:border-border/60 tw:bg-background/82 tw:shadow-sm tw:supports-backdrop-filter:backdrop-blur-2xl">
      <div className="tw:mx-auto tw:flex tw:h-[76px] tw:w-full tw:max-w-7xl tw:items-center tw:justify-between tw:px-4 tw:md:px-8 tw:lg:h-[88px]">
        <div className="tw:flex tw:items-center tw:gap-1 tw:lg:gap-0">
          <Button
            type="button"
            variant="flat"
            size="lg"
            iconOnly
            aria-label="باز کردن منوی اصلی"
            className="tw:lg:hidden"
          >
            <Menu aria-hidden="true" />
          </Button>
          <Brand size="compact" />
        </div>

        <DesktopNavigation />

        <div className="tw:flex tw:items-center tw:gap-0.5 tw:sm:gap-1.5">
          <Button type="button" variant="flat" size="lg" iconOnly aria-label="جستجو">
            <Search aria-hidden="true" />
          </Button>
          <Link
            href={routePaths.cart}
            aria-label="سبد خرید"
            data-icon-only="true"
            className={buttonVariants({ variant: 'flat', color: 'primary', size: 'lg' })}
          >
            <ShoppingCart aria-hidden="true" />
          </Link>
          <ThemeToggle variant="icon" />
          <Link
            href={routePaths.login}
            className={cn(buttonVariants({ size: 'lg' }), 'tw:hidden tw:px-5 tw:lg:inline-flex')}
          >
            ورود | ثبت‌نام
          </Link>
        </div>
      </div>
    </header>
  );
}
