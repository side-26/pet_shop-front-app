'use client';

import { use } from 'react';

import { getPetTypePropertyDefinitionsAction } from '@/entities/pet-types/pet-types.actions';

type Props = {
  request: ReturnType<typeof getPetTypePropertyDefinitionsAction>;
  children: (
    result: Awaited<ReturnType<typeof getPetTypePropertyDefinitionsAction>>,
  ) => React.ReactNode;
};

export default function PetTypePropertyDefinitionsDialogContent({ request, children }: Props) {
  return children(use(request));
}
