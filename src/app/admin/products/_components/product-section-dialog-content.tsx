'use client';

import { use } from 'react';

import type {
  ProductFormOptionsRequest,
  ProductSectionRequest,
} from './product-section-dialog.types';

export default function ProductSectionDialogContent({
  request,
  optionsRequest,
  children,
}: {
  request: ProductSectionRequest;
  optionsRequest: ProductFormOptionsRequest;
  children: (
    result: Awaited<ProductSectionRequest>,
    options: Awaited<ProductFormOptionsRequest>,
  ) => React.ReactNode;
}) {
  return children(use(request as Promise<Awaited<ProductSectionRequest>>), use(optionsRequest));
}
