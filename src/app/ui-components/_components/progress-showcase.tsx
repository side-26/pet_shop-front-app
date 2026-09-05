import { BadgeCheckIcon } from 'lucide-react';

import { Progress, type ProgressProps } from '@/components/ui/progress';

import { ShowcaseSection } from './showcase-section';

const colors = [
  'primary',
  'secondary',
  'neutral',
  'info',
  'success',
  'error',
] as const satisfies ReadonlyArray<NonNullable<ProgressProps['color']>>;
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies ReadonlyArray<
  NonNullable<ProgressProps['size']>
>;

export function ProgressShowcase() {
  return (
    <ShowcaseSection
      id="progress"
      title="Progress"
      description="نمایش پیشرفت با برچسب هم‌اندازه، رنگ تکمیل مستقل و محتوای اختیاری پس از رسیدن به ۱۰۰٪."
    >
      <div className="tw:flex tw:flex-col tw:gap-5">
        {colors.map((color) => (
          <Progress key={color} value={64} color={color} aria-label={`پیشرفت ${color}`} />
        ))}
      </div>
      <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
        {sizes.map((size) => (
          <Progress key={size} value={48} size={size} aria-label={`پیشرفت اندازه ${size}`} />
        ))}
      </div>
      <Progress value={100} fullColor="success" aria-label="بارگذاری کامل">
        <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-label-m tw:text-success">
          <BadgeCheckIcon aria-hidden="true" className="tw:size-4" /> بارگذاری کامل شد
        </span>
      </Progress>
    </ShowcaseSection>
  );
}
