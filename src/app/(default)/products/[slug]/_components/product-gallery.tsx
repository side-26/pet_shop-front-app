'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import type { ProductGalleryImage } from './product-detail-data';

type ProductGalleryProps = Readonly<{
  className?: string;
  images: readonly ProductGalleryImage[];
  discountPercentage: number;
  itemLabel?: string;
  isSkeleton?: boolean;
}>;

function GalleryImage({ image, sizes }: { image: ProductGalleryImage; sizes: string }) {
  if (!image.src) return <div aria-hidden="true" className="tw:absolute tw:inset-0" />;

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      placeholder={image.placeholder ? 'blur' : 'empty'}
      blurDataURL={image.placeholder}
      className={cn(
        image.fit === 'contain' && 'tw:bg-white',
        image.fit === 'contain' ? 'tw:object-contain' : 'tw:object-cover',
      )}
    />
  );
}

export function ProductGallery({
  className,
  images,
  discountPercentage,
  itemLabel = 'محصول',
  isSkeleton,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section aria-label={`تصاویر ${itemLabel}`} className={className}>
      <div className="tw:hidden tw:lg:block">
        <div className="tw:relative tw:aspect-square tw:overflow-hidden tw:rounded-3xl tw:bg-white">
          <GalleryImage image={images[selectedImage]} sizes="(min-width: 1024px) 44vw, 100vw" />
          {discountPercentage > 0 ? (
            <Badge
              color="error"
              variant="fill"
              size="lg"
              className="tw:absolute tw:start-4 tw:top-4"
            >
              {discountPercentage.toLocaleString('fa-IR')}٪ تخفیف
            </Badge>
          ) : null}
        </div>

        <div className="tw:mt-4 tw:grid tw:grid-cols-3 tw:gap-3">
          {images.map((image, index) => (
            <Button
              key={image.src ?? `gallery-image-${index}`}
              type="button"
              disabled={isSkeleton}
              variant="outlined"
              color="secondary"
              aria-label={`نمایش تصویر ${index + 1}`}
              aria-pressed={selectedImage === index}
              className={cn(
                'tw:relative tw:h-auto tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl tw:p-0',
                selectedImage === index && 'tw:ring-3 tw:ring-primary/25 tw:border-primary',
              )}
              onClick={() => setSelectedImage(index)}
            >
              <GalleryImage image={image} sizes="15vw" />
            </Button>
          ))}
        </div>
      </div>

      <Carousel className="tw:lg:hidden" opts={{ loop: false }} aria-label={`گالری ${itemLabel}`}>
        <CarouselContent className="tw:ms-0">
          {images.map((image, index) => (
            <CarouselItem
              key={image.src ?? `gallery-image-${index}`}
              className="tw:basis-full tw:ps-0 tw:md:basis-1/2"
            >
              <div className="tw:px-1 tw:pb-4 tw:sm:px-2 tw:md:px-3">
                <div
                  className={cn(
                    'tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:rounded-3xl',
                    image.fit === 'contain' ? 'tw:bg-white' : 'tw:bg-muted/35',
                  )}
                >
                  <GalleryImage image={image} sizes="(max-width: 767px) 100vw, 50vw" />
                  {index === 0 && discountPercentage > 0 ? (
                    <Badge
                      color="error"
                      variant="fill"
                      size="md"
                      className="tw:absolute tw:start-4 tw:top-4"
                    >
                      {discountPercentage.toLocaleString('fa-IR')}٪ تخفیف
                    </Badge>
                  ) : null}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div
          className="tw:absolute tw:inset-x-0 tw:bottom-3 tw:flex tw:justify-center tw:gap-1.5"
          aria-hidden="true"
        >
          {images.map((image, index) => (
            <span
              key={image.src ?? `gallery-image-${index}`}
              className="tw:size-1.5 tw:rounded-full tw:bg-foreground/35"
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
