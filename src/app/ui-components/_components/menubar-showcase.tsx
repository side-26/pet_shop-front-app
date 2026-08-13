'use client';

import { useState } from 'react';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ShowcaseSection } from './showcase-section';

export function MenubarShowcase() {
  const [compact, setCompact] = useState(false);
  const [language, setLanguage] = useState('fa');
  return (
    <ShowcaseSection
      id="menubars"
      title="Menubar"
      description="نوار منوی Base UI غیرمودال با ناوبری کامل صفحه‌کلید، زیرمنو و ترکیب صحیح گروه‌ها در RTL."
    >
      <Menubar aria-label="منوی برنامه">
        <MenubarMenu>
          <MenubarTrigger>پرونده</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarLabel>سفارش</MenubarLabel>
              <MenubarItem>
                سفارش جدید<MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                چاپ فاکتور<MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>بایگانی</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem variant="destructive">خروج</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>نمایش</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarCheckboxItem checked={compact} onCheckedChange={setCompact}>
                حالت فشرده
              </MenubarCheckboxItem>
              <MenubarSub>
                <MenubarSubTrigger>زبان</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarRadioGroup value={language} onValueChange={setLanguage}>
                    <MenubarRadioItem value="fa">فارسی</MenubarRadioItem>
                    <MenubarRadioItem value="en">
                      <bdi dir="ltr">English</bdi>
                    </MenubarRadioItem>
                  </MenubarRadioGroup>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>راهنما</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>مرکز راهنما</MenubarItem>
              <MenubarItem>درباره پت‌شاپ</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </ShowcaseSection>
  );
}
