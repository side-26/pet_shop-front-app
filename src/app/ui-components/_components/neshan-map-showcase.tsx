'use client';

import { useRef } from 'react';

import { NeshanMap } from '@/components/ui/map/neshan-map/default';
import { Button } from '@/components/ui/button';

import { ShowcaseSection } from './showcase-section';

export function NeshanMapShowcase() {
  const mapRef = useRef<React.ComponentRef<typeof NeshanMap>>(null);

  return (
    <ShowcaseSection
      id="neshan-maps"
      title="Neshan Map"
      description="نقشه تعاملی نشان با پشتیبانی پیش‌فرض از برچسب‌های راست‌به‌چپ و کنترل برنامه‌نویسی‌شدهٔ موقعیت."
    >
      <div className="tw:flex tw:flex-col tw:gap-4">
        <NeshanMap
          ref={mapRef}
          aria-label="نمونه نقشه نشان تهران"
          className="tw:h-96"
          center={[51.389, 35.6892]}
        >
          {({ mapCoordinate }) => (
            <output className="tw:pointer-events-none tw:absolute tw:start-3 tw:top-3 tw:z-1 tw:rounded-lg tw:bg-background/90 tw:px-3 tw:py-2 tw:text-label-s tw:text-foreground tw:shadow-sm">
              {mapCoordinate.join(', ')}
            </output>
          )}
        </NeshanMap>
        <Button
          type="button"
          size="sm"
          onClick={() => mapRef.current?.addNewPointer([51.389, 35.6892])}
        >
          افزودن نشانگر تهران
        </Button>
      </div>
    </ShowcaseSection>
  );
}
