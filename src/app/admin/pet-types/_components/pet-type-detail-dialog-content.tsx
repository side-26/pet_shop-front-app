'use client';

import { use } from 'react';

import { getPetTypeByIdAction } from '@/entities/pet-types/pet-types.actions';

type Props = {
  request: ReturnType<typeof getPetTypeByIdAction>;
  children: (result: Awaited<ReturnType<typeof getPetTypeByIdAction>>) => React.ReactNode;
};

export default function PetTypeDetailDialogContent({ request, children }: Props) {
  return children(use(request));
}
