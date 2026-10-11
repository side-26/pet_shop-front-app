'use client';

import { useArticleMainInfoQuery } from '@/entities/articles/articles.client';

type Props = {
  children: (article: ReturnType<typeof useArticleMainInfoQuery>['data']) => React.ReactNode;
};

export default function UpdateMainInfoDialogContent({ children }: Props) {
  const { data } = useArticleMainInfoQuery();

  return children(data);
}
