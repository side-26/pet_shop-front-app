'use client';

import { useState } from 'react';

import { AnimatedPrice } from '@/components/ui/animated-price';
import { Button } from '@/components/ui/button';

import { ShowcaseSection } from './showcase-section';

export function AnimatedPriceShowcase() {
  const [price, setPrice] = useState(1_250_000);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ShowcaseSection
      id="animated-prices"
      title="Animated Price"
      description="قیمت با حرکت مستقل هر رقم، شبیه شمارشگر دستگاه پول‌شمار؛ در حالت کاهش حرکت، همان نمایش ثابت Price را نشان می‌دهد."
    >
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
        <AnimatedPrice
          number={price}
          isLoading={isLoading}
          className="tw:text-price-l tw:text-primary"
        />
        <Button variant="outlined" onClick={() => setPrice((value) => value + 57_500)}>
          افزایش قیمت
        </Button>
        <Button variant="tonal" onClick={() => setPrice((value) => Math.max(0, value - 125_000))}>
          کاهش قیمت
        </Button>
        <Button variant="text" onClick={() => setIsLoading((value) => !value)}>
          {isLoading ? 'نمایش قیمت' : 'نمایش بارگذاری'}
        </Button>
        <AnimatedPrice emptyValue="نامشخص" aria-label="قیمت نامشخص" />
      </div>
    </ShowcaseSection>
  );
}
