import { Button } from '@/components/ui/button';
import { Calendar, CalendarFooter } from '@/components/ui/calendar';

import { ShowcaseSection } from './showcase-section';

export function CalendarShowcase() {
  return (
    <ShowcaseSection
      id="calendar"
      title="Calendar"
      description="تقویم جلالی با انتخابگر چرخشی مجازی ماه و سال، انتخاب روز و رنگ‌های معنایی."
    >
      <div className="tw:flex tw:flex-wrap tw:gap-6">
        <div className="tw:w-fit">
          <Calendar mode="single" color="primary" modifiers={{ holiday: new Date(2026, 8, 8) }} />
          <CalendarFooter>
            <Button size="sm">تأیید</Button>
            <Button size="sm" variant="outlined">
              امروز
            </Button>
            <Button size="sm" variant="outlined" color="error">
              لغو
            </Button>
          </CalendarFooter>
        </div>
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
