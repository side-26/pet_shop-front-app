import { ArrowLeft, PackageCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';

import { ParallaxMedia, RevealItem, RevealSection } from './motion-primitives';

export function DeliverySection() {
  return (
    <RevealSection
      labelledBy="delivery-title"
      className="tw:mx-auto tw:grid tw:w-full tw:max-w-7xl tw:items-center tw:gap-10 tw:px-4 tw:py-16 tw:sm:px-6 tw:md:px-8 tw:lg:grid-cols-2 tw:lg:gap-16 tw:lg:py-24"
    >
      <RevealItem className="tw:relative">
        <div className="tw:absolute tw:inset-0 tw:rotate-3 tw:rounded-[2rem] tw:bg-primary-muted" />
        <ParallaxMedia className="tw:relative tw:overflow-hidden tw:rounded-[2rem] tw:border tw:border-border/60 tw:bg-card tw:shadow-xl">
          <div className="tw:relative tw:aspect-[4/3]">
            <Image
              src="/images/home/delivery.jpg"
              alt="تحویل بسته محصولات پت در درب منزل"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="tw:object-cover"
            />
          </div>
        </ParallaxMedia>
      </RevealItem>

      <div className="tw:flex tw:flex-col tw:items-start tw:gap-5">
        <RevealItem>
          <Badge variant="tonal" color="error" size="lg">
            <PackageCheck aria-hidden="true" />
            پایان خریدهای طاقت‌فرسا
          </Badge>
        </RevealItem>
        <RevealItem>
          <h2
            id="delivery-title"
            className="tw:text-heading-2 tw:text-balance tw:lg:text-heading-1"
          >
            خرید وسایل سنگین پت، دیگر یک کابوس نیست
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="tw:text-body-m tw:text-muted-foreground tw:sm:text-body-l">
            حمل کیسه‌های غذای خشک و خاک گربه از فروشگاه تا خانه را به ما بسپارید. اقلام تخصصی و
            برندهای معتبر با چند کلیک، سالم و مطمئن به دست شما می‌رسند.
          </p>
        </RevealItem>
        <RevealItem>
          <p className="tw:text-body-m tw:text-muted-foreground">
            زمان و انرژی خود را برای بازی و مراقبت از دوست پشمالویتان نگه دارید؛ بقیه مسیر با ما.
          </p>
        </RevealItem>
        <RevealItem>
          <Link
            href={routePaths.products}
            className={buttonVariants({ variant: 'outlined', size: 'lg' })}
          >
            مشاهده محصولات قابل ارسال
            <ArrowLeft data-icon="inline-end" aria-hidden="true" />
          </Link>
        </RevealItem>
      </div>
    </RevealSection>
  );
}
