'use client';

import { use } from 'react';

import { getBreedAction } from '@/entities/breeds/breeds.actions';

type Props = {
  request: ReturnType<typeof getBreedAction>;
  children: (result: Awaited<ReturnType<typeof getBreedAction>>) => React.ReactNode;
};

export default function BreedDetailDialogContent({ request, children }: Props) {
  return children(use(request));
}
