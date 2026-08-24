'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import type { ProductGalleryImage } from './product-detail-data';

type ProductGalleryProps = Readonly<{
  images: readonly ProductGalleryImage[];
  discount: string;
}>;

function GalleryImage({ image, sizes }: { image: ProductGalleryImage; sizes: string }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      className={cn(
        image.fit === 'contain' && 'tw:bg-white',
        image.fit === 'contain' ? 'tw:object-contain' : 'tw:object-cover',
      )}
    />
  );
}

export function ProductGallery({ images, discount }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section aria-label="تصاویر محصول">
      <div className="tw:hidden tw:lg:block">
        <div className="tw:relative tw:aspect-square tw:overflow-hidden tw:rounded-3xl tw:bg-white">
          <GalleryImage image={images[selectedImage]} sizes="(min-width: 1024px) 44vw, 100vw" />
          <Badge color="error" variant="fill" size="lg" className="tw:absolute tw:start-4 tw:top-4">
            {discount}
          </Badge>
        </div>

        <div className="tw:mt-4 tw:grid tw:grid-cols-3 tw:gap-3">
          {images.map((image, index) => (
            <Button
              key={image.src}
              type="button"
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

      <Carousel className="tw:lg:hidden" opts={{ loop: false }} aria-label="گالری محصول">
        <CarouselContent className="tw:ms-0">
          {images.map((image, index) => (
            <CarouselItem key={image.src} className="tw:ps-0">
              <div
                className={cn(
                  'tw:relative tw:aspect-[4/3] tw:overflow-hidden',
                  image.fit === 'contain' ? 'tw:bg-white' : 'tw:bg-muted/35',
                )}
              >
                <GalleryImage image={image} sizes="100vw" />
                {index === 0 ? (
                  <Badge
                    color="error"
                    variant="fill"
                    size="md"
                    className="tw:absolute tw:start-4 tw:top-4"
                  >
                    {discount}
                  </Badge>
                ) : null}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div
          className="tw:absolute tw:inset-x-0 tw:bottom-3 tw:flex tw:justify-center tw:gap-1.5"
          aria-hidden="true"
        >
          {images.map((image) => (
            <span key={image.src} className="tw:size-1.5 tw:rounded-full tw:bg-foreground/35" />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
