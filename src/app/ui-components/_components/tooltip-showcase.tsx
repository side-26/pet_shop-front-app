import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipContentProps,
} from '@/components/ui/tooltip';
import { ShowcaseSection } from './showcase-section';

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies ReadonlyArray<NonNullable<TooltipContentProps['color']>>;
const variants = ['fill', 'outlined', 'tonal'] as const satisfies ReadonlyArray<
  NonNullable<TooltipContentProps['variant']>
>;

export function TooltipShowcase() {
  return (
    <ShowcaseSection
      id="tooltips"
      title="Tooltip"
      description="راهنمای کوتاه با رنگ‌های معنایی؛ متن و فلش برای هر نوع سطح به‌صورت یکپارچه تنظیم می‌شوند."
    >
      <TooltipProvider delay={0}>
        <div className="tw:flex tw:flex-col tw:gap-5">
          {variants.map((variant) => (
            <div key={variant} className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
              {colors.map((color) => (
                <Tooltip key={`${variant}-${color}`}>
                  <TooltipTrigger
                    render={
                      <Button
                        iconOnly
                        aria-label={`راهنمای ${color} ${variant}`}
                        variant="outlined"
                        color={color}
                        size="sm"
                      />
                    }
                  >
                    <Info />
                  </TooltipTrigger>
                  <TooltipContent variant={variant} color={color} data-showcase="tooltip-surface">
                    {variant} · {color}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      </TooltipProvider>
    </ShowcaseSection>
  );
}
