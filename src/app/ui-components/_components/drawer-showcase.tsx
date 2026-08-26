import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerContentProps,
} from '@/components/ui/drawer';

import { ShowcaseSection } from './showcase-section';

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies ReadonlyArray<NonNullable<DrawerContentProps['color']>>;

export function DrawerShowcase() {
  return (
    <ShowcaseSection
      id="drawers"
      title="Drawer"
      description="کشوی لمسی و RTL با شش رنگ معنایی؛ بدون محورهای variant و size."
    >
      <div className="tw:flex tw:flex-wrap tw:gap-3">
        {colors.map((color) => (
          <Drawer key={color} showSwipeHandle>
            <DrawerTrigger render={<Button variant="outlined" color={color} />}>
              کشوی {color}
            </DrawerTrigger>
            <DrawerContent color={color}>
              <DrawerHeader>
                <DrawerTitle>انتخاب روش ارسال</DrawerTitle>
                <DrawerDescription>
                  زمان و هزینه ارسال سفارش حیوان خانگی را بررسی کنید.
                </DrawerDescription>
              </DrawerHeader>
              <div className="tw:p-4">
                <p>ارسال استاندارد در بازه دو تا سه روز کاری انجام می‌شود.</p>
              </div>
              <DrawerFooter>
                <DrawerClose render={<Button color={color} />}>تأیید و بستن</DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    </ShowcaseSection>
  );
}
