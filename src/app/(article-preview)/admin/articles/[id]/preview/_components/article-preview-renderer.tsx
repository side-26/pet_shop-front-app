import type { ArticleDTO } from '@/entities/articles/articles.dto';
import { cn } from '@/lib/utils';

import { ArticlePreviewCreatedTime } from './article-preview-created-time';
import { ArticlePreviewHeroSection } from './article-preview-hero-section';
import { ArticlePreviewProfile } from './article-preview-profile';
import { ArticlePreviewShareButton } from './article-preview-share-button';

type ArticlePreviewRendererProps = Readonly<{
  article?: ArticleDTO;
  isSkeleton?: boolean;
}>;

export function ArticlePreviewRenderer({
  article,
  isSkeleton = false,
}: ArticlePreviewRendererProps) {
  return (
    <article
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:mx-auto tw:w-full tw:max-w-5xl tw:space-y-8 tw:px-4 tw:py-8 tw:sm:px-6 tw:lg:px-8 tw:lg:py-12',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <ArticlePreviewHeroSection article={article} />
      <section
        aria-label="اطلاعات نویسنده و اشتراک‌گذاری"
        className="tw:flex tw:items-center tw:gap-3"
      >
        <ArticlePreviewProfile author={article?.author}>
          <ArticlePreviewCreatedTime createdAt={article?.createdAt} />
        </ArticlePreviewProfile>
        <div className="tw:ms-auto">
          <ArticlePreviewShareButton disabled={isSkeleton} title={article?.title ?? 'مقاله'} />
        </div>
      </section>
    </article>
  );
}
