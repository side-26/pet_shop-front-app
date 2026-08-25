'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import type { PetDetailImage } from './pet-detail-data';

type PetGalleryProps = Readonly<{ images: readonly PetDetailImage[] }>;

function PetImage({
  image,
  sizes,
  eager = false,
}: Readonly<{ image: PetDetailImage; sizes: string; eager?: boolean }>) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      className="tw:object-cover"
    />
  );
}

export function PetGallery({ images }: PetGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section aria-label="تصاویر حیوان">
      <div className="tw:hidden tw:lg:grid tw:grid-cols-[5.5rem_1fr] tw:gap-3">
        <div className="tw:flex tw:flex-col tw:gap-3">
          {images.map((image, index) => (
            <Button
              key={image.src}
              type="button"
              variant="outlined"
              color="secondary"
              aria-label={`نمایش تصویر ${index + 1}`}
              aria-pressed={selectedImage === index}
              className={cn(
                'tw:relative tw:h-auto tw:aspect-square tw:overflow-hidden tw:rounded-2xl tw:p-0',
                selectedImage === index && 'tw:border-primary tw:ring-3 tw:ring-primary/20',
              )}
              onClick={() => setSelectedImage(index)}
            >
              <PetImage image={image} sizes="6rem" />
            </Button>
          ))}
        </div>
        <div className="tw:relative tw:aspect-[4/5] tw:overflow-hidden tw:rounded-3xl tw:bg-muted">
          <PetImage image={images[selectedImage]} sizes="(min-width: 1024px) 42vw, 100vw" eager />
        </div>
      </div>

      <Carousel className="tw:lg:hidden" opts={{ loop: false }} aria-label="گالری تصاویر مکس">
        <CarouselContent className="tw:ms-0">
          {images.map((image, index) => (
            <CarouselItem key={image.src} className="tw:ps-0">
              <div className="tw:relative tw:aspect-[4/3] tw:overflow-hidden tw:bg-muted tw:sm:rounded-3xl">
                <PetImage
                  image={image}
                  sizes="(min-width: 1024px) 1px, (min-width: 640px) calc(100vw - 3rem), 100vw"
                  eager={index === 0}
                />
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
              key={image.src}
              className={cn(
                'tw:size-2 tw:rounded-full',
                index === 0 ? 'tw:bg-primary' : 'tw:bg-background/75',
              )}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
