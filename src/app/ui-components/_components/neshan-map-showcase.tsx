'use client';

import { useRef } from 'react';

import { NeshanMap } from '@/components/ui/map/neshan-map/default';
import { NeshanMapPluginWrapper } from '@/components/ui/map/neshan-map/plugins/plugin-wrapper';
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
            <>
              <NeshanMapPluginWrapper position="top-left">
                <output className="tw:pointer-events-none tw:rounded-lg tw:bg-background/90 tw:px-3 tw:py-2 tw:text-label-s tw:text-foreground tw:shadow-sm">
                  افزونهٔ نقشه
                </output>
              </NeshanMapPluginWrapper>
              <NeshanMapPluginWrapper position="top-right">
                <output className="tw:pointer-events-none tw:rounded-lg tw:bg-background/90 tw:px-3 tw:py-2 tw:text-label-s tw:text-foreground tw:shadow-sm">
                  {mapCoordinate.join(', ')}
                </output>
              </NeshanMapPluginWrapper>
            </>
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
