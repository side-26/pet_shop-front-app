'use client';

import Image from 'next/image';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import type { PetDetailViewModel } from './pet-detail-data';

type PetDetailGalleryProps = Readonly<{
  images: PetDetailViewModel['images'];
  title: string;
  isSkeleton?: boolean;
}>;

/** Full-width, touch-first gallery for the pet-detail mobile and tablet composition. */
export function PetDetailGallery({ images, title, isSkeleton = false }: PetDetailGalleryProps) {
  return (
    <Carousel
      opts={{ loop: false }}
      aria-label={`گالری تصاویر ${title}`}
      className={cn('tw:lg:hidden', isSkeleton && 'skeleton tw:pointer-events-none')}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image.src ?? `pet-gallery-image-${index}`} className="tw:md:basis-1/2">
            <div className="tw:px-1 tw:pb-4 tw:sm:px-2 tw:md:px-3">
              <div className="tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:rounded-3xl tw:bg-muted/35">
                {image.src ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 0px"
                    placeholder={image.placeholder ? 'blur' : 'empty'}
                    blurDataURL={image.placeholder}
                    className="tw:object-cover"
                  />
                ) : null}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
