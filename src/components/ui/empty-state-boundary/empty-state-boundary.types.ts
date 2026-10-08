import type { ReactNode } from 'react';

export type EmptyStateData = readonly unknown[] | null | undefined;

export type EmptyStateBoundaryProps<TData extends EmptyStateData> = Readonly<{
  data: TData;
  fallback: ReactNode;
  children: ReactNode;
  isEmpty?: () => boolean;
}>;
