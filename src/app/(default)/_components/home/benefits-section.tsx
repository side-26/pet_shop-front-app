import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { benefitIconStyles, homeBenefits } from './home-data';
import { RevealItem, RevealSection } from './motion-primitives';

export function BenefitsSection() {
  return (
    <RevealSection
      id="benefits"
      labelledBy="benefits-title"
      className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-10 tw:px-4 tw:py-16 tw:sm:px-6 tw:md:px-8 tw:lg:py-24"
    >
      <RevealItem className="tw:mx-auto tw:flex tw:max-w-2xl tw:flex-col tw:items-center tw:gap-3 tw:text-center">
        <span className="tw:text-label-m tw:font-bold tw:text-primary">
          مراقبت، ساده‌تر از همیشه
        </span>
        <h2 id="benefits-title" className="tw:text-heading-2 tw:text-balance tw:lg:text-heading-1">
          چرا پت‌شاپ پرشین؟
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          چالش‌های نگهداری از حیوانات خانگی را می‌شناسیم و برای هرکدام راهکاری روشن داریم.
        </p>
      </RevealItem>

      <div className="tw:grid tw:grid-cols-1 tw:gap-5 tw:md:grid-cols-3 tw:lg:gap-6">
        {homeBenefits.map(({ title, description, icon: Icon, color }) => (
          <RevealItem key={title}>
            <Card
              size="md"
              className="tw:h-full tw:transition-[transform,box-shadow] tw:duration-300 tw:hover:-translate-y-2 tw:hover:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none"
            >
              <CardHeader>
                <div
                  className={cn(
                    'tw:mb-3 tw:flex tw:size-12 tw:items-center tw:justify-center tw:rounded-2xl',
                    benefitIconStyles[color],
                  )}
                >
                  <Icon aria-hidden="true" className="tw:size-6" />
                </div>
                <CardTitle className="tw:text-title-l">{title}</CardTitle>
              </CardHeader>
              <CardContent className="tw:text-body-s tw:text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          </RevealItem>
        ))}
      </div>
    </RevealSection>
  );
}
