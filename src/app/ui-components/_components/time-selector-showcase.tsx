import { TimeSelector, type TimeSelectorProps } from '@/components/ui/time-selector';

import { ShowcaseSection } from './showcase-section';

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies ReadonlyArray<NonNullable<TimeSelectorProps['color']>>;

export function TimeSelectorShowcase() {
  return (
    <ShowcaseSection
      id="time-selector"
      title="Time Selector"
      description="انتخاب ساعت، دقیقه و ثانیه با چرخ‌های مجازی، رنگ و ظاهر معنایی و چینش افقی قابل تنظیم."
    >
      <div className="tw:flex tw:flex-col tw:gap-6">
        <TimeSelector defaultValue="09:30:45" color="primary" />
        <TimeSelector defaultValue="14:05:00" color="success" variant="outlined" align="right" />
        <TimeSelector defaultValue="23:59:59" color="error" variant="tonal" align="left" disabled />
      </div>
      <div className="tw:grid tw:gap-6 tw:lg:grid-cols-2">
        {colors.map((color) => (
          <TimeSelector key={color} defaultValue="12:30:15" color={color} label={color} />
        ))}
      </div>
    </ShowcaseSection>
  );
}
