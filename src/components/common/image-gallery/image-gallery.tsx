'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import { GalleryImage } from './plugins/image-gallery-item';

import type { ImageGalleryProps } from './image-gallery.types';

export function ImageGallery({
  ariaLabel = 'گالری تصاویر',
  className,
  images,
  previewImagePreview,
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = images[selectedImageIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  if (!selectedImage) return null;

  return (
    <section aria-label={ariaLabel} className={cn('tw:w-full tw:min-w-0', className)}>
      <div className="tw:hidden tw:w-full tw:lg:block">
        <div
          className={cn(
            'tw:relative tw:aspect-square tw:w-full tw:overflow-hidden tw:rounded-3xl tw:bg-muted/35',
            selectedImage.fit === 'contain' && 'tw:bg-white',
          )}
        >
          <GalleryImage
            image={selectedImage}
            loading={selectedImageIndex === 0 ? 'eager' : 'lazy'}
            sizes="(min-width: 1280px) 600px, (min-width: 1024px) 44vw, 100vw"
          />
          {previewImagePreview}
        </div>

        <div
          aria-label="تصاویر قابل انتخاب"
          className="tw:mt-4 tw:grid tw:w-full tw:grid-cols-3 tw:gap-3"
          role="list"
        >
          {images.map((image, index) => (
            <Button
              key={`${image.src}-${index}`}
              type="button"
              variant="outlined"
              color="secondary"
              aria-label={`نمایش تصویر ${index + 1}`}
              aria-pressed={selectedImageIndex === index}
              className={cn(
                'tw:relative tw:h-auto tw:aspect-4/3 tw:overflow-hidden tw:rounded-2xl tw:p-0',
                'tw:transition-transform tw:duration-150 tw:ease-out tw:will-change-transform',
                'tw:hover:scale-102 tw:focus-visible:scale-102 tw:motion-reduce:transition-none',
                selectedImageIndex === index &&
                  'tw:scale-102 tw:border-primary tw:ring-3 tw:ring-primary/25',
              )}
              onClick={() => setSelectedImageIndex(index)}
            >
              <GalleryImage image={image} sizes="(min-width: 1024px) 15vw, 100vw" />
            </Button>
          ))}
        </div>
      </div>

      <Carousel className="tw:w-full tw:lg:hidden" opts={{ loop: false }} aria-label={ariaLabel}>
        <CarouselContent className="tw:ms-0">
          {images.map((image, index) => (
            <CarouselItem
              key={`${image.src}-${index}`}
              className="tw:basis-full tw:ps-0 tw:md:basis-1/2"
            >
              <div className="tw:px-1 tw:pb-4 tw:sm:px-2 tw:md:px-3">
                <div
                  className={cn(
                    'tw:relative tw:aspect-4/3 tw:overflow-hidden tw:rounded-3xl tw:bg-muted/35',
                    image.fit === 'contain' && 'tw:bg-white',
                  )}
                >
                  <GalleryImage
                    image={image}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 767px) 100vw, 50vw"
                  />
                  {previewImagePreview}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {hasMultipleImages ? (
          <>
            <CarouselPrevious className="tw:start-3" />
            <CarouselNext className="tw:end-3" />
          </>
        ) : null}
      </Carousel>
    </section>
  );
}
