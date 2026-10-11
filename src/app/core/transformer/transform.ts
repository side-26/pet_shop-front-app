import { plainToInstance, type ClassConstructor } from 'class-transformer';

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
