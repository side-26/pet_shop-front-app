'use client';

import { getProvincesAction, reverseGeocodeAction } from './locations.actions';
import type { ProvinceDTO, ReverseGeocodedLocationDTO } from './locations.dto';
import type { ReverseGeocodeInput } from './locations.schema';
import { globalErrorHandler } from '@/utils/helpers';

export async function loadProvinces(): Promise<ProvinceDTO[] | null> {
  const result = await getProvincesAction();

  if (result.isSuccess) return result.data;

  globalErrorHandler(result);
  return null;
}

export async function loadReverseGeocodedLocation(
  input: ReverseGeocodeInput,
): Promise<ReverseGeocodedLocationDTO | null> {
  const result = await reverseGeocodeAction(input);

  if (result.isSuccess) return result.data;

  globalErrorHandler(result);
  return null;
}
