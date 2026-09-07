import { Calendar } from '@/components/ui/calendar';

import { ShowcaseSection } from './showcase-section';

export function CalendarShowcase() {
  return (
    <ShowcaseSection
      id="calendar"
      title="Calendar"
      description="تقویم جلالی با انتخابگر چرخشی مجازی ماه و سال، انتخاب روز و رنگ‌های معنایی."
    >
      <div className="tw:flex tw:flex-wrap tw:gap-6">
        <Calendar mode="single" color="primary" modifiers={{ holiday: new Date(2026, 8, 8) }} />
        <Calendar
          mode="range"
          selected={{ from: new Date(2026, 8, 6), to: new Date(2026, 8, 11) }}
          color="secondary"
        />
        <Calendar mode="single" selected={new Date(2026, 8, 6)} color="neutral" />
        <Calendar mode="single" selected={new Date(2026, 8, 6)} color="success" />
        <Calendar mode="single" selected={new Date(2026, 8, 6)} color="error" />
      </div>
    </ShowcaseSection>
  );
}
