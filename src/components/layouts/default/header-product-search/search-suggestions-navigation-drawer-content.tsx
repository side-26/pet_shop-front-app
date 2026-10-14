'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { LandingSearchResultDTO } from '@/entities/landing/landing.dto';

import { HeaderProductSearchSuggestionsContent } from './search-suggestions-dialog-content';

type HeaderProductSearchNavigationDrawerContentProps = Readonly<{
  initialSuggestions: LandingSearchResultDTO[];
  onClose: () => void;
  open: boolean;
  query: string;
}>;

export function HeaderProductSearchNavigationDrawerContent({
  initialSuggestions,
  onClose,
  open,
  query,
}: HeaderProductSearchNavigationDrawerContentProps) {
  return (
    <Drawer open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()} showSwipeHandle>
      <DrawerContent color="primary" className="tw:max-h-[calc(100svh-2rem)] tw:gap-0 tw:p-0">
        <DrawerHeader className="tw:flex-row tw:items-start tw:justify-between tw:border-b tw:border-border tw:px-6 tw:py-4">
          <div className="tw:flex tw:flex-col tw:gap-1">
            <DrawerTitle>جستجوی سریع</DrawerTitle>
            <DrawerDescription>آیتم موردنظرتان را جستجو کنید.</DrawerDescription>
          </div>
          <DrawerClose
            render={<Button iconOnly size="sm" variant="flat" aria-label="بستن جستجو" />}
          >
            <X aria-hidden="true" />
          </DrawerClose>
        </DrawerHeader>
        <HeaderProductSearchSuggestionsContent
          initialSuggestions={initialSuggestions}
          query={query}
        />
      </DrawerContent>
    </Drawer>
  );
}
