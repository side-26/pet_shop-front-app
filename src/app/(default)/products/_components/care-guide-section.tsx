import { ArrowLeft, HeartHandshake } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';

import { MotionItem, MotionSection, ParallaxProductMedia } from './product-landing-motion';
import { careSteps } from './product-landing-data';

export async function CareGuideSection() {
  'use cache';
  cacheLife('max');

  return <CareGuideRenderer />;
}

export function CareGuideRenderer() {
  return (
    <MotionSection
      id="care-guide"
      labelledBy="care-guide-title"
      cacheSection="care-guide"
      className="tw:bg-surface tw:px-4 tw:py-16 tw:sm:px-6 tw:md:px-8 tw:lg:py-24"
    >
      <div className="tw:mx-auto tw:grid tw:w-full tw:max-w-7xl tw:items-center tw:gap-10 tw:lg:grid-cols-2 tw:lg:gap-16">
        <MotionItem className="tw:flex tw:flex-col tw:items-start tw:gap-6">
          <Badge variant="tonal" color="secondary" size="lg">
            <HeartHandshake aria-hidden="true" />
            خرید آگاهانه، مراقبت بهتر
          </Badge>
          <div className="tw:flex tw:flex-col tw:gap-3">
            <h2 id="care-guide-title" className="tw:text-heading-2 tw:lg:text-heading-1">
              مسیر انتخاب را کوتاه کرده‌ایم
            </h2>
            <p className="tw:max-w-xl tw:text-body-m tw:text-muted-foreground tw:sm:text-body-l">
              محصول خوب فقط ظاهر جذاب ندارد؛ باید با سن، نیاز و عادت‌های دوست کوچک شما هماهنگ باشد.
              این مسیر سه‌مرحله‌ای کمک می‌کند مطمئن‌تر انتخاب کنید.
            </p>
          </div>

          <ol className="tw:flex tw:w-full tw:flex-col tw:gap-3">
            {careSteps.map(({ number, title, description, icon: Icon }) => (
              <li
                key={title}
                className="tw:grid tw:grid-cols-[auto_1fr_auto] tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-card/75 tw:p-4"
              >
                <span className="tw:flex tw:size-10 tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary-muted tw:text-primary-muted-foreground">
                  <Icon aria-hidden="true" className="tw:size-5" />
                </span>
                <span className="tw:flex tw:flex-col">
                  <strong className="tw:text-title-s">{title}</strong>
                  <span className="tw:text-body-s tw:text-muted-foreground">{description}</span>
                </span>
                <bdi className="tw:text-label-m tw:text-muted-foreground">{number}</bdi>
              </li>
            ))}
          </ol>

          <a
            href="#featured-products"
            className={buttonVariants({ variant: 'fill', color: 'primary', size: 'lg' })}
          >
            دیدن انتخاب‌ها
            <ArrowLeft aria-hidden="true" data-icon="inline-end" />
          </a>
        </MotionItem>

        <ParallaxProductMedia className="tw:relative tw:mx-auto tw:w-full tw:max-w-xl">
          <div className="tw:absolute tw:-inset-3 tw:rounded-[2.5rem] tw:bg-secondary-muted tw:-rotate-3" />
          <div className="tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:rounded-[2.25rem] tw:border tw:border-border/70 tw:shadow-xl">
            <Image
              src="/images/home/delivery.jpg"
              alt="تحویل بسته محصولات پت در درب منزل"
              fill
              sizes="(min-width: 1024px) 50vw, 92vw"
              className="tw:object-cover"
            />
          </div>
          <div className="tw:absolute tw:-bottom-5 tw:start-4 tw:max-w-64 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-card/90 tw:p-4 tw:shadow-xl tw:supports-backdrop-filter:backdrop-blur-xl tw:sm:start-8">
            <p className="tw:text-title-s">سنگین‌ها را هم به ما بسپار</p>
            <p className="tw:text-body-s tw:text-muted-foreground">غذا و خاک پت، امن تا درِ خانه</p>
          </div>
        </ParallaxProductMedia>
      </div>
    </MotionSection>
  );
}
