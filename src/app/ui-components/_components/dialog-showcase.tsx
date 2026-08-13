import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
} from '@/components/ui/dialog';
import { ShowcaseSection } from './showcase-section';

const sizes = ['sm', 'md', 'lg', 'xl'] as const satisfies ReadonlyArray<
  NonNullable<DialogContentProps['size']>
>;

export function DialogShowcase() {
  return (
    <ShowcaseSection
      id="dialogs"
      title="Dialog"
      description="گفتگوهای مودال macOS-style با اقدام‌های استاندارد: انصراف قرمز و خطی، پذیرش اصلی و پُر."
    >
      <div className="tw:flex tw:flex-wrap tw:gap-3">
        {sizes.map((size) => (
          <Dialog key={size}>
            <DialogTrigger render={<Button variant="outlined" />}>گفتگوی {size}</DialogTrigger>
            <DialogContent size={size}>
              <DialogHeader>
                <DialogTitle>ویرایش مشخصات حیوان</DialogTitle>
                <DialogDescription>اطلاعات جدید را بررسی و سپس ذخیره کنید.</DialogDescription>
              </DialogHeader>
              <div className="tw:rounded-2xl tw:bg-muted tw:p-4 tw:text-body-s">
                محتوای نمونه گفتگو در اندازه {size}
              </div>
              <DialogFooter>
                <DialogCancel>انصراف</DialogCancel>
                <DialogAction>ذخیره</DialogAction>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </ShowcaseSection>
  );
}
