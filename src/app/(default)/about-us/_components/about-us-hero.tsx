import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon, HeartHandshakeIcon, PawPrintIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

export function AboutUsHero() {
  return (
    <section
      aria-labelledby="about-us-title"
      className="tw:relative tw:py-10 tw:sm:py-14 tw:lg:py-20"
    >
      <div className="tw:default-layout-container tw:grid tw:items-center tw:gap-10 tw:lg:grid-cols-2 tw:lg:gap-16">
        <div className="tw:order-2 tw:flex tw:flex-col tw:items-start tw:gap-5 tw:lg:order-1">
          <Badge color="primary" size="lg" variant="transparent">
            <PawPrintIcon aria-hidden="true" />
            درباره پت‌شاپ پرشین
          </Badge>
          <h1
            id="about-us-title"
            className="tw:max-w-2xl tw:text-heading-1 tw:text-balance tw:sm:text-display-l tw:lg:text-display-xl"
          >
            کنار شما هستیم تا <span className="tw:text-primary">انتخاب برای دوست پشمالویتان</span>{' '}
            ساده‌تر شود.
          </h1>
          <div className="tw:max-w-xl tw:space-y-4 tw:text-body-m tw:leading-8 tw:text-muted-foreground tw:sm:text-body-l tw:sm:leading-9">
            <p>
              پت‌شاپ پرشین از یک دغدغه ساده شروع شد: هر سرپرست حیوان خانگی باید بتواند با خیال راحت،
              انتخابی آگاهانه و مهربانانه داشته باشد.
            </p>
            <p>
              ما محصولات و راهنمایی‌های کاربردی را کنار هم جمع کرده‌ایم تا مراقبت روزمره، وقت بیشتری
              برای باهم‌بودن به شما هدیه بدهد.
            </p>
          </div>
          <Link
            href={routePaths.products}
            className={cn(buttonVariants({ color: 'primary', size: 'lg' }), 'tw:mt-1')}
          >
            دیدن محصولات
            <ArrowLeftIcon aria-hidden="true" data-icon="inline-end" />
          </Link>
        </div>

        <div className="tw:order-1 tw:mx-auto tw:w-full tw:max-w-md tw:lg:order-2 tw:lg:max-w-xl">
          <div className="tw:relative tw:aspect-square">
            <div
              aria-hidden="true"
              className="tw:absolute tw:inset-x-5 tw:bottom-2 tw:h-1/3 tw:rounded-[50%] tw:bg-primary tw:sm:inset-x-8 tw:sm:bottom-3"
            />
            <figure className="tw:absolute tw:inset-x-0 tw:top-0 tw:bottom-[12%] tw:overflow-hidden tw:rounded-[48%] tw:border tw:border-background tw:bg-muted tw:shadow-xl tw:shadow-foreground/10">
              <Image
                src="/images/home/hero-pets.jpg"
                alt="سگ گلدن رتریور و گربه پرشین در خانه‌ای روشن"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, (min-width: 640px) 28rem, calc(100vw - 2rem)"
                className="tw:object-cover tw:object-center"
              />
              <div className="tw:absolute tw:inset-0 tw:bg-linear-to-t tw:from-foreground/25 tw:via-transparent tw:to-transparent" />
            </figure>
            <div className="tw:absolute tw:bottom-0 tw:start-0 tw:flex tw:items-center tw:gap-2 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-card/90 tw:px-3 tw:py-2 tw:text-label-m tw:text-primary tw:shadow-lg tw:supports-backdrop-filter:backdrop-blur-xl tw:sm:start-3 tw:sm:px-4">
              <HeartHandshakeIcon aria-hidden="true" />
              انتخاب آگاهانه، مراقبت مهربانانه
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
