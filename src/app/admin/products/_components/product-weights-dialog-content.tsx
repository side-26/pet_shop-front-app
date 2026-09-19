'use client';

import { use } from 'react';

import { getProductWeightsAction } from '@/entities/products/products.actions';

type Props = {
  request: ReturnType<typeof getProductWeightsAction>;
  children: (result: Awaited<ReturnType<typeof getProductWeightsAction>>) => React.ReactNode;
};

export default function ProductWeightsDialogContent({ request, children }: Props) {
  return children(use(request));
}
