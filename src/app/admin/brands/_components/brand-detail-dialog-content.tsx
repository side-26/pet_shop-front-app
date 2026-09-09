'use client';

import { use } from 'react';

import type { BrandDetailRequest } from './brand-form-dialog.types';

type Props = {
  request: BrandDetailRequest;
  children: (result: Awaited<BrandDetailRequest>) => React.ReactNode;
};

export default function BrandDetailDialogContent({ request, children }: Props) {
  return children(use(request));
}
