'use client';

import { useState } from 'react';
import { LogOut, MoreHorizontal, Settings, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShowcaseSection } from './showcase-section';

export function DropdownMenuShowcase() {
  const [notifications, setNotifications] = useState(true);
  const [pet, setPet] = useState('cat');
  return (
    <ShowcaseSection
      id="dropdown-menus"
      title="Dropdown Menu"
      description="منوی غیرمودال Base UI با پیمایش آزاد صفحه؛ شروع هر اسکرول، منوی باز را خودکار می‌بندد."
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outlined" iconOnly aria-label="باز کردن منوی حساب" />}
        >
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
            <DropdownMenuItem>
              <UserRound />
              پروفایل<DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings />
              تنظیمات سازمان
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>حیوان فعال</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={pet} onValueChange={setPet}>
                  <DropdownMenuRadioItem value="cat">گربه</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dog">سگ</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem checked={notifications} onCheckedChange={setNotifications}>
              اعلان سفارش‌ها
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut />
            خروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ShowcaseSection>
  );
}
