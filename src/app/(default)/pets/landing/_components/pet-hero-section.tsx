import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

export function PetHeroSection() {
  return (
    <section
      aria-labelledby="pet-hero-title"
      className="tw:mx-auto tw:w-full tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:md:px-8 tw:md:py-12"
    >
      <div className="tw:group/hero tw:relative tw:h-[530px] tw:overflow-hidden tw:rounded-3xl tw:shadow-lg tw:md:h-[600px]">
        <Image
          src="/images/home/hero-pets.png"
          alt="سگ گلدن رتریور و گربه پرشین در خانه‌ای روشن"
          fill
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="tw:object-cover tw:transition-transform tw:duration-700 tw:group-hover/hero:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/hero:transform-none"
        />
        <div className="tw:absolute tw:inset-0 tw:bg-linear-to-t tw:from-foreground/80 tw:via-foreground/35 tw:to-transparent" />
        <div className="tw:absolute tw:inset-x-0 tw:bottom-0 tw:flex tw:flex-col tw:items-center tw:px-6 tw:pb-10 tw:text-center tw:text-primary-foreground tw:md:inset-0 tw:md:justify-center tw:md:px-16 tw:md:pb-0">
          <h1
            id="pet-hero-title"
            className="tw:max-w-3xl tw:text-heading-1 tw:font-extrabold tw:text-balance tw:md:text-display-xl"
          >
            بهترین دوست خود را پیدا کنید
          </h1>
          <p className="tw:mt-3 tw:max-w-xl tw:text-body-m tw:text-primary-foreground/90 tw:md:mt-6 tw:md:text-body-l">
            پت‌شاپ پرمیوم؛ جایی برای یافتن عشق واقعی در قالب یک دوست کوچک.
          </p>
          <Link
            href={routePaths.petsList}
            className={cn(buttonVariants({ size: 'xl' }), 'tw:mt-6 tw:md:mt-10')}
          >
            شروع جستجو
            <ArrowLeft data-icon="inline-end" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
