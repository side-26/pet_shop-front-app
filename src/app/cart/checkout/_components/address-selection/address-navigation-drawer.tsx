'use client';

import { Activity, type ReactNode, useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
export function CheckoutAddressNavigationDrawer({
  onMountChanged,
  children,
}: Readonly<{
  isMounted: boolean;
  onMountChanged: (open: boolean) => void;
  children: ReactNode;
}>) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setOpen(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Drawer open={isOpen} onOpenChange={onMountChanged} showSwipeHandle>
      <DrawerContent color="primary">
        <DrawerHeader className="tw:flex-none">
          <DrawerTitle>انتخاب نشانی تحویل</DrawerTitle>
          <DrawerDescription>نشانی مورد استفاده برای ارسال سفارش را انتخاب کنید.</DrawerDescription>
        </DrawerHeader>
        <div className="tw:flex-auto tw:overflow-auto tw:p-4" data-address-drawer-list>
          <Activity mode={isOpen ? 'visible' : 'hidden'}>{children}</Activity>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button type="button" color="error" block />}>بستن</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
