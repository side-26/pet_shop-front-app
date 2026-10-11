import { FetcherError } from './fetcher.shared';

export class InternalApiError<E = unknown> extends Error implements FetcherError<E> {
  readonly isSuccess = false as const;

  readonly data: FetcherError<E>['data'];

  constructor(
    message: string,
    data?: FetcherError<E>['data'],
    public readonly status?: number,
  ) {
    super(message);

    this.name = 'InternalApiError';

    this.data = data ?? {
      messages: {},
      details: {},
    };
  }
}
