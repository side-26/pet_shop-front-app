'use client';

import { useArticleTagsQuery } from '@/entities/articles/articles.client';

type Props = {
  children: (tags: ReturnType<typeof useArticleTagsQuery>['data']) => React.ReactNode;
};

export default function UpdateTagsDialogContent({ children }: Props) {
  const { data } = useArticleTagsQuery();
  return children(data);
}
