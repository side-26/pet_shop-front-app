import { PawPrint } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

import { ShowcaseSection } from './showcase-section';

export function HoverCardShowcase() {
  return (
    <ShowcaseSection
      id="hover-cards"
      title="Hover Card"
      description="پیش‌نمایش کوتاه اطلاعات مرتبط با یک پیوند، با تأخیر کنترل‌شده و جای‌گذاری سازگار با RTL."
    >
      <HoverCard>
        <HoverCardTrigger delay={100} closeDelay={150} render={<Button variant="outlined" />}>
          معرفی نژاد گلدن رتریور
        </HoverCardTrigger>
        <HoverCardContent side="bottom" align="start">
          <div className="tw:flex tw:items-start tw:gap-3">
            <span className="tw:grid tw:size-10 tw:shrink-0 tw:place-items-center tw:rounded-xl tw:bg-primary-muted tw:text-primary">
              <PawPrint className="tw:size-5" aria-hidden="true" />
            </span>
            <div className="tw:flex tw:flex-col tw:gap-1">
              <p className="tw:text-title-s">گلدن رتریور</p>
              <p className="tw:text-body-s tw:text-muted-foreground">
                نژادی اجتماعی، صبور و مناسب خانواده‌هایی که زمان کافی برای بازی و فعالیت دارند.
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </ShowcaseSection>
  );
}
