'use client';

import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';
import type { SelectFieldProps } from '@/components/ui/fields/select-field';
import type { NeshanMapChildrenContext } from '@/components/ui/map/neshan-map/default';
import { loadProvinces } from '@/entities/locations/locations.client';
import type { ProvinceDTO } from '@/entities/locations/locations.dto';
import { cn } from '@/lib/utils';

const triggerSizeClassNames: Record<NonNullable<SelectFieldProps['size']>, string> = {
  xs: 'tw:h-8 tw:px-2 tw:text-body-s',
  sm: 'tw:h-9',
  md: 'tw:h-10',
  lg: 'tw:h-11 tw:text-body-l',
  xl: 'tw:h-12 tw:text-body-l',
};

export type NeshanMapProvinceSelectorProps = Readonly<{
  /** The map callback supplied by NeshanMap's child render prop. */
  flyTo: NeshanMapChildrenContext['flyTo'];
  size?: SelectFieldProps['size'];
  className?: string;
}>;

export function NeshanMapProvinceSelector({
  flyTo,
  size = 'md',
  className,
}: NeshanMapProvinceSelectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [provinces, setProvinces] = useState<ProvinceDTO[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void loadProvinces()
      .then((items) => {
        if (isMounted) setProvinces(items ?? []);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={cn('tw:w-52', className)} aria-busy={isLoading || undefined}>
      <Select
        items={provinces.map((province) => ({
          label: province.title,
          value: String(province.provinceId),
        }))}
        value={selectedProvinceId}
        disabled={isLoading}
        onValueChange={(value) => {
          const province = provinces.find((item) => item.provinceId === Number(value));
          if (!province?.latLng) return;

          setSelectedProvinceId(String(province.provinceId));
          const [latitude, longitude] = province.latLng;
          flyTo([longitude, latitude]);
        }}
      >
        <SelectTrigger aria-label="انتخاب استان" className={triggerSizeClassNames[size ?? 'md']}>
          <SelectValue placeholder={isLoading ? 'در حال دریافت استان‌ها…' : 'انتخاب استان'} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {provinces.map((province) => (
              <SelectItem key={province.provinceId} value={String(province.provinceId)}>
                {province.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
