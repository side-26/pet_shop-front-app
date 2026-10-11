import { plainToInstance, type ClassConstructor } from 'class-transformer';

export function transformData<T extends object>(
  dto: ClassConstructor<T>,
  data: Record<string, unknown>[],
): T[] {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
  });
}
