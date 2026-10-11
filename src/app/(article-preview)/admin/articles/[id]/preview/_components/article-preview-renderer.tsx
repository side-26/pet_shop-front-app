import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ArticleDTO } from '@/entities/articles/articles.dto';
import { cn } from '@/lib/utils';

type ArticlePreviewRendererProps = Readonly<{
  article?: ArticleDTO;
  isSkeleton?: boolean;
}>;

function formatJalaliTime(value?: string) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ArticlePreviewRenderer({
  article,
  isSkeleton = false,
}: ArticlePreviewRendererProps) {
  const authorName = article
    ? `${article.author.firstName} ${article.author.lastName}`.trim()
    : 'نام نویسنده';
  const authorInitial = authorName.at(0) ?? 'ن';

  return (
    <article
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:mx-auto tw:w-full tw:max-w-5xl tw:space-y-8 tw:px-4 tw:py-8 tw:sm:px-6 tw:lg:px-8 tw:lg:py-12',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <section
        aria-label="تصویر اصلی مقاله"
        className="tw:relative tw:aspect-[16/9] tw:overflow-hidden tw:rounded-3xl tw:bg-muted"
      >
        {article?.mainImage ? (
          <Image
            src={article.mainImage}
            alt={article.title}
            fill
            preload
            sizes="(min-width: 1024px) 1024px, 100vw"
            placeholder={article.mainThumbnailImage ? 'blur' : 'empty'}
            blurDataURL={article.mainThumbnailImage}
            className="tw:object-cover"
          />
        ) : null}
      </section>
      <section aria-label="اطلاعات نویسنده" className="tw:flex tw:items-center tw:gap-3">
        <Avatar size="lg">
          {article?.author.avatar ? (
            <AvatarImage src={article.author.avatar} alt={authorName} />
          ) : null}
          <AvatarFallback>{authorInitial}</AvatarFallback>
        </Avatar>
        <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-0.5">
          <p className="tw:truncate tw:text-body-m tw:font-medium tw:text-foreground">
            {authorName}
          </p>
          <time dateTime={article?.createdAt} className="tw:text-body-s tw:text-muted-foreground">
            {formatJalaliTime(article?.createdAt)}
          </time>
        </div>
      </section>
    </article>
  );
}
