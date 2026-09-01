'use client';

import { use } from 'react';

import { getSubCategoryByIdAction } from '@/entities/sub-categories/sub-categories.actions';

type Props = {
  request: ReturnType<typeof getSubCategoryByIdAction>;
  children: (result: Awaited<ReturnType<typeof getSubCategoryByIdAction>>) => React.ReactNode;
};

export default function SubCategoryDetailDialogContent({ request, children }: Props) {
  return children(use(request));
}
