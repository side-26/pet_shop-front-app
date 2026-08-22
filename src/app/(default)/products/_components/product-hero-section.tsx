import { ArrowLeft, Check, PackageOpen, PawPrint } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { HeroMotion, MotionItem, ParallaxProductMedia } from './product-landing-motion';

export async function ProductHeroSection() {
  'use cache';
  cacheLife('max');

  return <ProductHeroRenderer />;
}

export function ProductHeroRenderer() {
  return (
    <section
      aria-labelledby="product-hero-title"
      data-cache-section="hero"
      className="tw:relative tw:isolate tw:overflow-hidden tw:bg-background tw:px-4 tw:py-10 tw:sm:px-6 tw:sm:py-14 tw:md:px-8 tw:lg:py-20"
    >
      <div className="tw:absolute tw:inset-x-0 tw:top-0 tw:-z-10 tw:h-2/3 tw:bg-linear-to-b tw:from-primary-muted/75 tw:to-transparent" />
      <div className="tw:absolute tw:start-[8%] tw:top-16 tw:-z-10 tw:size-44 tw:rounded-full tw:bg-secondary/15 tw:blur-3xl" />
      <div className="tw:mx-auto tw:grid tw:w-full tw:max-w-7xl tw:items-center tw:gap-12 tw:lg:grid-cols-[0.9fr_1.1fr] tw:lg:gap-16">
        <HeroMotion className="tw:flex tw:flex-col tw:items-start tw:gap-6">
          <MotionItem>
            <Badge variant="tonal" color="primary" size="lg">
              <PawPrint aria-hidden="true" />
              فروشگاه تخصصی پت
            </Badge>
          </MotionItem>

          <MotionItem className="tw:flex tw:flex-col tw:gap-4">
            <h1
              id="product-hero-title"
              className="tw:max-w-2xl tw:text-heading-1 tw:font-extrabold tw:text-foreground tw:sm:text-display-l tw:lg:text-display-xl"
            >
              هر چیزی که دوست کوچکت <span className="tw:text-primary">واقعاً نیاز دارد</span>
            </h1>
            <p className="tw:max-w-xl tw:text-body-m tw:text-muted-foreground tw:sm:text-body-l">
              انتخاب‌های مطمئن برای تغذیه، بازی و مراقبت؛ مرتب‌شده برای خریدی سریع‌تر و زندگی شادتر
              کنار پت شما.
            </p>
          </MotionItem>

          <MotionItem className="tw:flex tw:w-full tw:flex-col tw:gap-3 tw:sm:w-auto tw:sm:flex-row">
            <a
              href="#featured-products"
              className={cn(buttonVariants({ size: 'xl' }), 'tw:group tw:sm:min-w-44')}
            >
              شروع خرید
              <ArrowLeft
                aria-hidden="true"
                data-icon="inline-end"
                className="tw:transition-transform tw:duration-200 tw:group-hover:-translate-x-1 tw:motion-reduce:transition-none tw:motion-reduce:group-hover:transform-none"
              />
            </a>
            <a
              href="#pet-categories"
              className={buttonVariants({ variant: 'outlined', color: 'secondary', size: 'xl' })}
            >
              انتخاب بر اساس پت
            </a>
          </MotionItem>

          <MotionItem className="tw:flex tw:flex-wrap tw:gap-x-5 tw:gap-y-2 tw:text-label-m tw:text-muted-foreground">
            {['تضمین کیفیت', 'ارسال امن', 'انتخاب تخصصی'].map((item) => (
              <span key={item} className="tw:flex tw:items-center tw:gap-1.5">
                <Check aria-hidden="true" className="tw:size-4 tw:text-success" />
                {item}
              </span>
            ))}
          </MotionItem>
        </HeroMotion>

        <ParallaxProductMedia className="tw:relative tw:mx-auto tw:w-full tw:max-w-2xl">
          <div className="tw:absolute tw:-inset-3 tw:rounded-[2.75rem] tw:border tw:border-primary/15 tw:bg-primary/5 tw:rotate-2" />
          <div className="tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:rounded-[2.5rem] tw:border tw:border-border/60 tw:bg-card tw:shadow-2xl tw:shadow-primary/15">
            <Image
              src="/images/home/hero-pets.png"
              alt="گلدن رتریور و گربه پرشین در خانه روشن"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 92vw"
              className="tw:object-cover"
            />
            <div className="tw:absolute tw:inset-0 tw:bg-linear-to-t tw:from-foreground/20 tw:via-transparent tw:to-transparent" />
          </div>

          <div className="tw:absolute tw:-start-3 tw:top-8 tw:flex tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-card/85 tw:p-3 tw:shadow-xl tw:supports-backdrop-filter:backdrop-blur-xl tw:sm:-start-8 tw:sm:top-12">
            <span className="tw:flex tw:size-10 tw:items-center tw:justify-center tw:rounded-xl tw:bg-secondary-muted tw:text-secondary-muted-foreground">
              <PackageOpen aria-hidden="true" className="tw:size-5" />
            </span>
            <span className="tw:flex tw:flex-col">
              <strong className="tw:text-label-m">بسته مراقبت ماهانه</strong>
              <span className="tw:text-caption tw:text-muted-foreground">همه‌چیز، یکجا</span>
            </span>
          </div>

          <div className="tw:absolute tw:-end-2 tw:bottom-5 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-card/90 tw:px-4 tw:py-3 tw:shadow-xl tw:supports-backdrop-filter:backdrop-blur-xl tw:sm:-end-5 tw:sm:bottom-10">
            <p className="tw:text-caption tw:text-muted-foreground">رضایت همراهان پرشین</p>
            <p className="tw:text-title-l tw:text-primary">
              <bdi>۴٫۹</bdi> از <bdi>۵</bdi>
            </p>
          </div>
        </ParallaxProductMedia>
      </div>
    </section>
  );
}
