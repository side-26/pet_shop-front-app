'use client';

import { useEffect, useRef, useState } from 'react';

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
  /** Runs after selecting a province with a mappable coordinate. */
  onProvinceSelect?: (province: ProvinceDTO) => void;
  /** Selects and flies to this province as soon as the province list is available. */
  defaultProvinceId?: number;
  /** Selects a province label without changing the current map position. */
  initialProvinceTitle?: string;
  size?: SelectFieldProps['size'];
  className?: string;
}>;

export function NeshanMapProvinceSelector({
  flyTo,
  onProvinceSelect,
  defaultProvinceId,
  initialProvinceTitle,
  size = 'md',
  className,
}: NeshanMapProvinceSelectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [provinces, setProvinces] = useState<ProvinceDTO[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const selectionRef = useRef({ flyTo, onProvinceSelect });

  useEffect(() => {
    selectionRef.current = { flyTo, onProvinceSelect };
  }, [flyTo, onProvinceSelect]);

  function selectProvince(province: ProvinceDTO) {
    setSelectedProvinceId(String(province.provinceId));
    if (!province.latLng) return;

    const [latitude, longitude] = province.latLng;
    selectionRef.current.flyTo([longitude, latitude]);
    selectionRef.current.onProvinceSelect?.(province);
  }

  useEffect(() => {
    let isMounted = true;

    void loadProvinces()
      .then((items) => {
        if (!isMounted) return;

        const nextProvinces = items ?? [];
        setProvinces(nextProvinces);
        const defaultProvince = nextProvinces.find(
          (province) => province.provinceId === defaultProvinceId,
        );
        if (defaultProvince) selectProvince(defaultProvince);
        else if (initialProvinceTitle) {
          const selectedProvince = nextProvinces.find(
            (province) => province.title === initialProvinceTitle,
          );
          if (selectedProvince) setSelectedProvinceId(String(selectedProvince.provinceId));
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [defaultProvinceId, initialProvinceTitle]);

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
          if (province) selectProvince(province);
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
