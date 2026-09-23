'use client';

import { getProvincesAction } from './locations.actions';
import type { ProvinceDTO } from './locations.dto';
import { globalErrorHandler } from '@/utils/helpers';

export async function loadProvinces(): Promise<ProvinceDTO[] | null> {
  const result = await getProvincesAction();

  if (result.isSuccess) return result.data;

  globalErrorHandler(result);
  return null;
}
