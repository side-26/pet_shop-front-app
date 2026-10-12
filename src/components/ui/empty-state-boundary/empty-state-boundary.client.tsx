'use client';

import type { EmptyStateBoundaryProps, EmptyStateData } from './empty-state-boundary.types';

export function EmptyStateBoundaryClient<TData extends EmptyStateData>({
  data,
  fallback,
  children,
  isEmpty = () => data == null || (Array.isArray(data) && data.length === 0),
}: EmptyStateBoundaryProps<TData>) {
  return isEmpty() ? fallback : children;
}
