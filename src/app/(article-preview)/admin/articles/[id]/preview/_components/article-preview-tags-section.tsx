import { Badge } from '@/components/ui/badge';
import type { ArticleTagDTO } from '@/entities/articles/articles.dto';

const skeletonTags = ['برچسب اول', 'برچسب دوم'];

type ArticlePreviewTagsSectionProps = Readonly<{
  tags?: readonly ArticleTagDTO[];
  isSkeleton?: boolean;
}>;

export function ArticlePreviewTagsSection({
  tags = [],
  isSkeleton = false,
}: ArticlePreviewTagsSectionProps) {
  const tagTitles = isSkeleton
    ? skeletonTags
    : tags.map(({ title }) => title.trim()).filter(Boolean);

  if (!tagTitles.length) return null;

  return (
    <section aria-labelledby="article-preview-tags-title">
      <h2 id="article-preview-tags-title" className="tw:sr-only">
        برچسب‌های مقاله
      </h2>
      <ul className="tw:flex tw:flex-wrap tw:gap-2">
        {tagTitles.map((title, index) => (
          <li key={`${title}-${index}`}>
            <Badge color="primary" size="sm" variant="tonal">
              {title}
            </Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
