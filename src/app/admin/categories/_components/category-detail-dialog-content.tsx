'use client';

import { use } from 'react';

import { getCategoryByIdAction } from '@/entities/categories/categories.actions';

type Props = {
  request: ReturnType<typeof getCategoryByIdAction>;
  children: (result: Awaited<ReturnType<typeof getCategoryByIdAction>>) => React.ReactNode;
};

export default function CategoryDetailDialogContent({ request, children }: Props) {
  return children(use(request));
}
