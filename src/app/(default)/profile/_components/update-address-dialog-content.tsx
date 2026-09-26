'use client';

import { use, useEffect, type ReactNode } from 'react';

import type { getProfileAddressAction } from '@/entities/profile/profile.actions';

type Props = Readonly<{
  request: ReturnType<typeof getProfileAddressAction>;
  onResolved: (result: Awaited<ReturnType<typeof getProfileAddressAction>>) => void;
  children: (result: Awaited<ReturnType<typeof getProfileAddressAction>>) => ReactNode;
}>;

export default function UpdateAddressDialogContent({ request, onResolved, children }: Props) {
  const result = use(request);
  useEffect(() => onResolved(result), [onResolved, result]);
  return children(result);
}
