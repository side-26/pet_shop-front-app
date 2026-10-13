import { ArticleDetailSection } from './_components/article-detail-section';

type ArticleDetailPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  return <ArticleDetailSection params={params} />;
}
