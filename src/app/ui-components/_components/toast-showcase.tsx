'use client';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from '@/components/ui/toast';
import { ShowcaseSection } from './showcase-section';

const notices = [
  { type: 'success', title: 'سفارش ثبت شد' },
  { type: 'info', title: 'اطلاعات به‌روز شد' },
  { type: 'warning', title: 'موجودی رو به پایان است' },
  { type: 'error', title: 'ثبت سفارش ناموفق بود' },
] as const;
export function ToastShowcase() {
  return (
    <ShowcaseSection
      id="toasts"
      title="Toast"
      description="اعلان‌های موقت Base UI با وضعیت‌های معنایی، خوانایی هوشمند، پشته‌سازی و بستن دسترس‌پذیر."
    >
      <Toaster>
        <div className="tw:flex tw:flex-wrap tw:gap-3">
          {notices.map((item) => (
            <Button
              key={item.type}
              variant="outlined"
              color={item.type}
              onClick={() =>
                toast.add({
                  type: item.type,
                  title: item.title,
                  description: 'این یک پیام نمونه از پت‌شاپ است.',
                })
              }
            >
              {item.type}
            </Button>
          ))}
        </div>
      </Toaster>
    </ShowcaseSection>
  );
}
