'use client';

import { use } from 'react';

import type { PetFormOptionsRequest, PetSectionRequest } from './pet-section-dialog.types';

export default function PetSectionDialogContent({
  request,
  optionsRequest,
  children,
}: {
  request: PetSectionRequest;
  optionsRequest: PetFormOptionsRequest;
  children: (
    result: Awaited<PetSectionRequest>,
    options: Awaited<PetFormOptionsRequest>,
  ) => React.ReactNode;
}) {
  return children(use(request), use(optionsRequest));
}
