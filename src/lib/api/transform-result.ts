import { instanceToPlain } from 'class-transformer';

import type { FetcherResult } from './customFetcher';

export function transformResult<TInput, TOutput>(
  result: TInput,
  transform: (value: TInput) => TOutput,
): TOutput {
  const transformed = transform(result);

  return instanceToPlain(transformed) as TOutput;
}
