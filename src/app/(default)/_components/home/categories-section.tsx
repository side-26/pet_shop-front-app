import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { petCategories } from './home-data';
import { RevealItem, RevealSection } from './motion-primitives';

export function CategoriesSection() {
  return (
    <RevealSection
      labelledBy="categories-title"
      className="tw:overflow-hidden tw:bg-surface tw:py-16 tw:lg:py-24"
    >
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-8 tw:px-4 tw:sm:px-6 tw:md:px-8">
        <RevealItem className="tw:flex tw:items-end tw:justify-between tw:gap-4">
          <div className="tw:flex tw:flex-col tw:gap-2">
            <span className="tw:text-label-m tw:font-bold tw:text-primary">برای هر دوست کوچک</span>
            <h2 id="categories-title" className="tw:text-heading-2 tw:lg:text-heading-1">
              دسته‌بندی حیوانات
            </h2>
            <p className="tw:text-body-m tw:text-muted-foreground">
              محصولات تخصصی متناسب با نیاز هر حیوان خانگی
            </p>
          </div>
          <Link
            href={routePaths.pets}
            className={cn(buttonVariants({ variant: 'flat' }), 'tw:hidden tw:sm:inline-flex')}
          >
            مشاهده همه
            <ArrowLeft data-icon="inline-end" aria-hidden="true" />
          </Link>
        </RevealItem>

        <RevealItem>
          <Carousel aria-label="دسته‌بندی حیوانات" opts={{ align: 'start' }} className="tw:w-full">
            <CarouselContent className="tw:pb-2">
              {petCategories.map(({ title, description, image, imageAlt }) => (
                <CarouselItem
                  key={title}
                  className="tw:basis-[88%] tw:sm:basis-1/2 tw:lg:basis-1/3 tw:xl:basis-1/4"
                >
                  <Link
                    href={routePaths.pets}
                    className="tw:group/category tw:block tw:rounded-3xl tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
                  >
                    <article className="tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:rounded-3xl tw:border tw:border-border/70 tw:bg-card tw:shadow-lg tw:transition-[transform,box-shadow] tw:duration-300 tw:group-hover/category:-translate-y-1 tw:group-hover/category:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:group-hover/category:transform-none">
                      <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
                        className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/category:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/category:transform-none"
                      />
                      <div className="tw:absolute tw:inset-0 tw:bg-linear-to-t tw:from-foreground/85 tw:via-foreground/15 tw:to-transparent" />
                      <div className="tw:absolute tw:inset-x-0 tw:bottom-0 tw:flex tw:flex-col tw:gap-1 tw:p-5 tw:text-primary-foreground">
                        <h3 className="tw:text-title-l">{title}</h3>
                        <p className="tw:text-body-s tw:text-primary-foreground/85">
                          {description}
                        </p>
                      </div>
                    </article>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="tw:start-2" />
            <CarouselNext className="tw:end-2" />
          </Carousel>
        </RevealItem>
      </div>
    </RevealSection>
  );
}
