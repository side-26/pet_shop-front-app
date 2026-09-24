'use client';

import { useRef, useState } from 'react';

import { NeshanMap } from '@/components/ui/map/neshan-map/default';
import { NeshanMapPointerIcon } from '@/components/ui/map/neshan-map/plugins/icons/pointer';
import { NeshanMapPointer } from '@/components/ui/map/neshan-map/plugins/pointer';
import { NeshanMapPluginWrapper } from '@/components/ui/map/neshan-map/plugins/plugin-wrapper';
import { Button } from '@/components/ui/button';

import { ShowcaseSection } from './showcase-section';

export function NeshanMapShowcase() {
  const mapRef = useRef<React.ComponentRef<typeof NeshanMap>>(null);
  const [pointerLngLat, setPointerLngLat] = useState<readonly [number, number]>([51.389, 35.6892]);

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
              <NeshanMapPointer lngLat={pointerLngLat} setLatLng={setPointerLngLat} draggable>
                <NeshanMapPointerIcon.Root aria-label="نشانگر قابل‌جابه‌جایی تهران" />
              </NeshanMapPointer>
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
          onClick={() => {
            setPointerLngLat([51.389, 35.6892]);
            mapRef.current?.flyTo([51.389, 35.6892]);
          }}
        >
          بازگرداندن نشانگر تهران
        </Button>
      </div>
    </ShowcaseSection>
  );
}
