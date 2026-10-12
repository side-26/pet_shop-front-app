import Image from 'next/image';

import type { ArticleDTO } from '@/entities/articles/articles.dto';

type ArticlePreviewHeroSectionProps = Readonly<{
  article?: ArticleDTO;
}>;

export function ArticlePreviewHeroSection({ article }: ArticlePreviewHeroSectionProps) {
  return (
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
  );
}
