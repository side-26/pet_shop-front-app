'use client';

import { forwardRef, useImperativeHandle, useState, type ReactNode } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  type DrawerContentProps,
} from '@/components/ui/drawer';

export interface ExpandableDrawerHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface ExpandableDrawerContentProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  color?: DrawerContentProps['color'];
}

/**
 * Owns Drawer visibility and exposes imperative controls for an adjacent preview.
 */
export const ExpandableDrawerContent = forwardRef<
  ExpandableDrawerHandle,
  ExpandableDrawerContentProps
>(function ExpandableDrawerContent(
  { children, title = 'جزئیات بیشتر', description, color = 'primary' },
  ref,
) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((previous) => !previous),
    }),
    [],
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} showSwipeHandle>
      <DrawerContent color={color}>
        <DrawerTitle className="tw:sr-only">{title}</DrawerTitle>
        {description && <DrawerDescription className="tw:sr-only">{description}</DrawerDescription>}
        <div className="tw:min-h-0 tw:overflow-y-auto tw:p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
});
