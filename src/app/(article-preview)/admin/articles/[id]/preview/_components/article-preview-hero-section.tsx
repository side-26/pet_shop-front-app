import Image from 'next/image';

import type { ArticleDTO } from '@/entities/articles/articles.dto';

type ArticlePreviewHeroSectionProps = Readonly<{
  article?: ArticleDTO;
  isSkeleton?: boolean;
}>;

export function ArticlePreviewHeroSection({
  article,
  isSkeleton = false,
}: ArticlePreviewHeroSectionProps) {
  const title = article?.title ?? 'عنوان مقاله';
  const subtitle = article?.subtitle ?? 'زیرعنوان مقاله';

  return (
    <section
      aria-label="معرفی مقاله"
      className="tw:relative tw:aspect-[16/9] tw:overflow-hidden tw:rounded-3xl tw:bg-muted"
    >
      {article?.mainImage ? (
        <Image
          src={article.mainImage}
          alt={title}
          fill
          loading="eager"
          sizes="(min-width: 1024px) 1024px, 100vw"
          placeholder={article.mainThumbnailImage ? 'blur' : 'empty'}
          blurDataURL={article.mainThumbnailImage}
          className="tw:object-cover"
        />
      ) : null}
      <div
        dir="rtl"
        className="tw:absolute tw:inset-x-0 tw:bottom-0 tw:bg-linear-to-l tw:from-black/90 tw:via-black/60 tw:to-white/10 tw:p-4 tw:sm:p-6 tw:lg:p-8"
      >
        <h1 className="tw:max-w-3xl tw:text-heading-3 tw:text-white tw:drop-shadow-sm tw:md:text-heading-2 tw:lg:text-heading-1">
          {isSkeleton ? 'عنوان مقاله' : title}
        </h1>
        <p className="tw:mt-2 tw:max-w-2xl tw:text-body-s tw:text-white/90 tw:drop-shadow-sm tw:md:text-body-m tw:lg:text-body-l">
          {isSkeleton ? 'زیرعنوان مقاله' : subtitle}
        </p>
      </div>
    </section>
  );
}
