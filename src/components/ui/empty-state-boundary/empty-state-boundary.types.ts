import type { ReactNode } from 'react';

export type EmptyStateData = unknown;

export type EmptyStateBoundaryProps<TData extends EmptyStateData> = Readonly<{
  data: TData;
  fallback: ReactNode;
  children: ReactNode;
  isEmpty?: () => boolean;
}>;
