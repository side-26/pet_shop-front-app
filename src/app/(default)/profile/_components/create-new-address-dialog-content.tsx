'use client';

import { NeshanMap } from '@/components/ui/map/neshan-map/default';
import { NeshanMapPointerIcon } from '@/components/ui/map/neshan-map/plugins/icons/pointer';
import { NeshanMapPointer } from '@/components/ui/map/neshan-map/plugins/pointer';
import { NeshanMapPluginWrapper } from '@/components/ui/map/neshan-map/plugins/plugin-wrapper';
import { NeshanMapProvinceSelector } from '@/components/ui/map/neshan-map/plugins/province-selector';
import type { ProvinceDTO } from '@/entities/locations/locations.dto';
import type { ReactNode } from 'react';

type Props = Readonly<{
  lngLat: readonly [number, number];
  setLngLat: (lngLat: readonly [number, number]) => void;
  children: (content: ReactNode) => ReactNode;
}>;

function displayCoordinate(value: number) {
  return value.toFixed(6);
}

export default function CreateNewAddressDialogContent({ lngLat, setLngLat, children }: Props) {
  return children(
    <div className="tw:flex tw:flex-col tw:gap-3">
      <p className="tw:text-body-m tw:text-muted-foreground">
        استان را انتخاب کنید، سپس نشانگر را برای تعیین دقیق موقعیت جابه‌جا کنید.
      </p>
      <NeshanMap
        aria-label="نقشه انتخاب موقعیت نشانی"
        className="tw:h-80 tw:w-full tw:border tw:border-border/60"
        copyRightPosition="bottom-left"
      >
        {({ flyTo }) => (
          <>
            <NeshanMapPointer
              lngLat={lngLat}
              setLatLng={setLngLat}
              anchor="bottom"
              clickMap
              draggable
            >
              <NeshanMapPointerIcon.Root aria-label="موقعیت انتخاب‌شده" />
            </NeshanMapPointer>
            <NeshanMapPluginWrapper position="top-left">
              <NeshanMapProvinceSelector
                flyTo={flyTo}
                defaultProvinceId={8}
                onProvinceSelect={(province: ProvinceDTO) => {
                  if (!province.latLng) return;
                  const [latitude, longitude] = province.latLng;
                  setLngLat([longitude, latitude]);
                }}
              />
            </NeshanMapPluginWrapper>
          </>
        )}
      </NeshanMap>
      <output
        aria-live="polite"
        className="tw:rounded-xl tw:border tw:border-border/60 tw:bg-muted/45 tw:px-3 tw:py-2 tw:text-body-s tw:text-muted-foreground"
      >
        <bdi dir="ltr">lat: {displayCoordinate(lngLat[1])}</bdi>
        <span aria-hidden="true"> · </span>
        <bdi dir="ltr">lng: {displayCoordinate(lngLat[0])}</bdi>
      </output>
    </div>,
  );
}
