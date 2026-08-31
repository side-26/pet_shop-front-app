'use client';

import { use } from 'react';

import { getBreedPropertyDefinitionsAction } from '@/entities/breeds/breeds.actions';

type Props = {
  request: ReturnType<typeof getBreedPropertyDefinitionsAction>;
  children: (
    result: Awaited<ReturnType<typeof getBreedPropertyDefinitionsAction>>,
  ) => React.ReactNode;
};

export default function BreedPropertyDefinitionsDialogContent({ request, children }: Props) {
  return children(use(request));
}
