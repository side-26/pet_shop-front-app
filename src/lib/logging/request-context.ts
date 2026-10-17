import 'server-only';

import { AsyncLocalStorage } from 'node:async_hooks';

type RequestContext = Readonly<{ requestId: string }>;

const requestContext = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(requestId: string, operation: () => T): T {
  return requestContext.run({ requestId }, operation);
}

export function getRequestContextId(): string | undefined {
  return requestContext.getStore()?.requestId;
}
