import { ArrowLeft, HeartPulse, PawPrint } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { HeroSequence, RevealItem } from './motion-primitives';
import { ShaderBackground } from './shader-background';

export function HeroSection() {
  return (
    <section className="tw:relative tw:isolate tw:overflow-hidden tw:px-4 tw:py-8 tw:sm:px-6 tw:sm:py-12 tw:md:px-8 tw:lg:py-16">
      <div className="tw:absolute tw:inset-0 tw:-z-20 tw:bg-linear-to-bl tw:from-primary-muted/70 tw:via-background tw:to-secondary-muted/65" />
      <ShaderBackground />
      <div className="tw:absolute tw:inset-0 tw:-z-10 tw:bg-background/35 tw:supports-backdrop-filter:backdrop-blur-[2px]" />

      <HeroSequence className="tw:relative tw:mx-auto tw:grid tw:min-h-[calc(100svh-140px)] tw:w-full tw:max-w-7xl tw:items-center tw:gap-8 tw:lg:min-h-[640px] tw:lg:grid-cols-12 tw:lg:gap-10">
        <div className="tw:flex tw:flex-col tw:items-start tw:gap-5 tw:lg:col-span-5">
          <RevealItem>
            <Badge variant="transparent" color="primary" size="lg">
              <PawPrint aria-hidden="true" />
              خانه‌ای برای انتخاب‌های بهتر
            </Badge>
          </RevealItem>
          <RevealItem>
            <h1 className="tw:max-w-xl tw:text-heading-1 tw:text-balance tw:sm:text-display-l tw:lg:text-display-xl">
              بهترین دوستت، <span className="tw:text-primary">لایق بهترین‌هاست</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="tw:max-w-xl tw:text-body-m tw:text-muted-foreground tw:sm:text-body-l">
              مراقبت حرفه‌ای، محصولات مطمئن و تجربه‌ای ساده برای اینکه زمان بیشتری را کنار دوست کوچک
              خود بگذرانید.
            </p>
          </RevealItem>
          <RevealItem className="tw:flex tw:w-full tw:flex-col tw:gap-3 tw:sm:w-auto tw:sm:flex-row">
            <Link
              href={routePaths.products}
              className={cn(buttonVariants({ size: 'xl' }), 'tw:w-full tw:sm:w-auto')}
            >
              مشاهده محصولات
              <ArrowLeft data-icon="inline-end" aria-hidden="true" />
            </Link>
            <Link
              href={routePaths.pets}
              className={cn(
                buttonVariants({ variant: 'transparent', size: 'xl' }),
                'tw:w-full tw:sm:w-auto',
              )}
            >
              انتخاب بر اساس حیوان
            </Link>
          </RevealItem>
          <RevealItem className="tw:flex tw:flex-wrap tw:gap-3 tw:pt-1 tw:text-label-m tw:text-muted-foreground">
            <span className="tw:inline-flex tw:items-center tw:gap-2">
              <PawPrint aria-hidden="true" className="tw:size-4 tw:text-primary" />
              انتخاب حرفه‌ای
            </span>
            <span className="tw:inline-flex tw:items-center tw:gap-2">
              <HeartPulse aria-hidden="true" className="tw:size-4 tw:text-secondary" />
              مراقبت مطمئن
            </span>
          </RevealItem>
        </div>

        <RevealItem className="tw:relative tw:lg:col-span-7">
          <div className="tw:absolute tw:-inset-3 tw:rounded-[2.25rem] tw:bg-primary/15 tw:blur-2xl tw:sm:-inset-5" />
          <div className="tw:relative tw:aspect-[16/10] tw:overflow-hidden tw:rounded-[2rem] tw:border tw:border-background/70 tw:bg-card tw:shadow-2xl tw:shadow-foreground/15">
            <Image
              src="/images/home/hero-pets.png"
              alt="سگ گلدن رتریور و گربه پرشین در خانه‌ای روشن، کنار نمای موبایل پت‌شاپ"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="tw:object-cover tw:object-center"
            />
            <div className="tw:absolute tw:inset-0 tw:bg-linear-to-t tw:from-foreground/20 tw:via-transparent tw:to-transparent" />
          </div>
        </RevealItem>
      </HeroSequence>
    </section>
  );
}
