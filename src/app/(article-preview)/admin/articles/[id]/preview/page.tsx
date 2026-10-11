import { getArticlePreviewByIdAction } from '@/entities/articles/articles.actions';

import { ArticlePreviewSection } from './_components/article-preview-section';

export default async function ArticlePreviewPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const articlePromise = getArticlePreviewByIdAction({ id });

  return <ArticlePreviewSection articlePromise={articlePromise} />;
}
