'use client';

import { useArticleMainTextQuery } from '@/entities/articles/articles.client';

type Props = {
  children: (article: ReturnType<typeof useArticleMainTextQuery>['data']) => React.ReactNode;
};

export default function UpdateMainTextDialogContent({ children }: Props) {
  const { data } = useArticleMainTextQuery();

  return children(data);
}
