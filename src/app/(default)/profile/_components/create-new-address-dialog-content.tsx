'use client';

import { use, type ReactNode } from 'react';

import { reverseGeocodeAction } from '@/entities/locations/locations.actions';

type ReverseGeocodeResult = Awaited<ReturnType<typeof reverseGeocodeAction>>;

type Props = Readonly<{
  request: Promise<ReverseGeocodeResult>;
  children: (result: ReverseGeocodeResult) => ReactNode;
}>;

export default function CreateNewAddressDialogContent({ request, children }: Props) {
  return children(use(request));
}
