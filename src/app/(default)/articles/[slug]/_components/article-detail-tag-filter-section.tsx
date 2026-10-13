'use client';

import { ArticlePreviewTagsSection } from '@/components/articles/article-preview/article-preview-tags-section';
import type { ArticleTagDTO } from '@/entities/articles/articles.dto';
import { useArticleCatalogControls } from '../../_hooks/use-article-catalog-controls';

type ArticleDetailTagFilterSectionProps = Readonly<{
  tags: readonly ArticleTagDTO[];
}>;

export function ArticleDetailTagFilterSection({ tags }: ArticleDetailTagFilterSectionProps) {
  const { toggleTag } = useArticleCatalogControls({});

  return <ArticlePreviewTagsSection tags={tags} onClick={toggleTag} />;
}
