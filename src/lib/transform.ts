import 'reflect-metadata';

import { plainToInstance, type ClassConstructor } from 'class-transformer';

export function transform<T, V>(cls: ClassConstructor<T>, value: V): T {
  return plainToInstance(cls, value, {
    excludeExtraneousValues: true,
  });
  // add new transformer options here if needed
}

export function transformMany<T, V>(cls: ClassConstructor<T>, value: V[]): T[] {
  return plainToInstance(cls, value, {
    excludeExtraneousValues: true,
  });
}
