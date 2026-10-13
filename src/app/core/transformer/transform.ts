import { plainToInstance, type ClassConstructor } from 'class-transformer';

import type { PaginateDataDTO } from '@/entities/pagination/pagination.dto';

export function transformData<T extends object>(dto: ClassConstructor<T>, data: object[]): T[];
export function transformData<T extends object>(dto: ClassConstructor<T>, data: object): T;
export function transformData<T extends object>(
  dto: ClassConstructor<T>,
  data: object | object[],
): T | T[] {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
  });
}

export function transformPaginateResult<T extends object>(
  dto: ClassConstructor<T>,
  data: Pick<PaginateDataDTO<object>, 'result'>,
): T[] {
  return transformData(dto, data.result);
}
