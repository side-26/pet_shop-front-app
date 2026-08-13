import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  type PopoverContentProps,
} from '@/components/ui/popover';
import { ShowcaseSection } from './showcase-section';

const examples = [
  ['fill', 'primary'],
  ['fill', 'error'],
  ['outlined', 'success'],
  ['outlined', 'warning'],
  ['tonal', 'info'],
  ['tonal', 'secondary'],
] as const satisfies ReadonlyArray<
  [NonNullable<PopoverContentProps['variant']>, NonNullable<PopoverContentProps['color']>]
>;

export function PopoverShowcase() {
  return (
    <ShowcaseSection
      id="popovers"
      title="Popover"
      description="سطح‌های تعاملی با رنگ متن هماهنگ با پس‌زمینه و حاشیه، پشتیبانی از RTL و مدیریت کامل فوکوس."
    >
      <div className="tw:flex tw:flex-wrap tw:gap-3">
        {examples.map(([variant, color]) => (
          <Popover key={`${variant}-${color}`}>
            <PopoverTrigger render={<Button variant="outlined" color={color} />}>
              {variant} · {color}
            </PopoverTrigger>
            <PopoverContent variant={variant} color={color} data-showcase="popover-surface">
              <PopoverHeader>
                <PopoverTitle>وضعیت سفارش</PopoverTitle>
                <PopoverDescription>
                  متن توضیحی نیز رنگ خوانا را از سطح جاری دریافت می‌کند.
                </PopoverDescription>
              </PopoverHeader>
              <Button size="sm" variant={variant === 'fill' ? 'tonal' : 'fill'} color={color}>
                مشاهده جزئیات
              </Button>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </ShowcaseSection>
  );
}
