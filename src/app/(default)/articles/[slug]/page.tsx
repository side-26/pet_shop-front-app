import type { Metadata } from 'next';

import { getArticlePreviewBySlugAction } from '@/entities/articles/articles.actions';

import { ArticleDetailSection } from './_components/article-detail-section';

type ArticleDetailPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticlePreviewBySlugAction({ slug });

  return {
    title: article.title,
    description: article.summary,
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  return <ArticleDetailSection params={params} />;
}
