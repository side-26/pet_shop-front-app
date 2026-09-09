import Image from 'next/image';
import Link from 'next/link';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { routePaths } from '@/configs/route.path';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  petTypes: readonly LandingPetTypeDTO[];
  isLoading?: boolean;
}>;

export function PetTypesCarouselSection({ petTypes, isLoading = false }: Props) {
  if (!isLoading && petTypes.length === 0) return null;

  return (
    <Carousel
      aria-label="دسته‌بندی حیوانات"
      aria-busy={isLoading || undefined}
      opts={{ align: 'start' }}
      className={cn('tw:w-full', isLoading && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <CarouselContent className="tw:pb-2">
        {petTypes.map((petType) => (
          <CarouselItem
            key={petType.id}
            className="tw:basis-[88%] tw:sm:basis-1/2 tw:lg:basis-1/3 tw:xl:basis-1/4"
          >
            <Link
              href={routePaths.pets}
              aria-label={isLoading ? undefined : `مشاهده ${petType.title}`}
              tabIndex={isLoading ? -1 : undefined}
              className="tw:group/category tw:block tw:rounded-3xl tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
            >
              <article className="tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:rounded-3xl tw:border tw:border-border/70 tw:bg-card tw:shadow-lg tw:transition-[transform,box-shadow] tw:duration-300 tw:group-hover/category:-translate-y-1 tw:group-hover/category:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:group-hover/category:transform-none">
                {isLoading ? (
                  <div className="tw:absolute tw:inset-0" />
                ) : (
                  <Image
                    src={petType.mainImage}
                    alt={`تصویر دسته‌بندی ${petType.title}`}
                    fill
                    placeholder="blur"
                    blurDataURL={petType.thumbnail}
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
                    className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/category:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/category:transform-none"
                  />
                )}
                <div className="tw:absolute tw:inset-0 tw:bg-linear-to-t tw:from-foreground/85 tw:via-foreground/15 tw:to-transparent" />
                <div className="tw:absolute tw:inset-x-0 tw:bottom-0 tw:p-5 tw:text-primary-foreground">
                  <h3 className="tw:text-title-l">{petType.title}</h3>
                </div>
              </article>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="tw:start-2" disabled={isLoading} />
      <CarouselNext className="tw:end-2" disabled={isLoading} />
    </Carousel>
  );
}
