'use client';

import * as React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
  direction?: 'rtl' | 'ltr';
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

function Carousel({
  orientation = 'horizontal',
  direction = 'rtl',
  opts,
  setApi,
  plugins,
  className,
  children,
  tabIndex = 0,
  ...props
}: React.ComponentProps<'div'> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
      direction,
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        direction === 'rtl' ? scrollNext() : scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        direction === 'rtl' ? scrollPrev() : scrollNext();
      }
    },
    [direction, scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    queueMicrotask(() => onSelect(api));
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api.off('reInit', onSelect);
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        direction,
        orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn('tw:relative tw:w-full tw:min-w-0', className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        dir={direction}
        tabIndex={tabIndex}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<'div'>) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="tw:w-full tw:min-w-0 tw:overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          'tw:flex',
          orientation === 'horizontal' ? 'tw:-ms-4' : 'tw:-mt-4 tw:flex-col',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        'tw:min-w-0 tw:shrink-0 tw:grow-0 tw:basis-full',
        orientation === 'horizontal' ? 'tw:ps-4' : 'tw:pt-4',
        className,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = 'outlined',
  size = 'sm',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      iconOnly
      color="primary"
      className={cn(
        'tw:absolute tw:touch-manipulation tw:rounded-full',
        orientation === 'horizontal'
          ? 'tw:inset-y-0 tw:-start-12 tw:my-auto'
          : 'tw:-top-12 tw:start-1/2 tw:-translate-x-1/2 rtl:tw:translate-x-1/2 tw:rotate-90',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronRightIcon />
      <span className="tw:sr-only">اسلاید قبلی</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = 'outlined',
  size = 'sm',
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      iconOnly
      color="primary"
      className={cn(
        'tw:absolute tw:touch-manipulation tw:rounded-full',
        orientation === 'horizontal'
          ? 'tw:inset-y-0 tw:-end-12 tw:my-auto'
          : 'tw:-bottom-12 tw:start-1/2 tw:-translate-x-1/2 rtl:tw:translate-x-1/2 tw:rotate-90',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="tw:sr-only">اسلاید بعدی</span>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
