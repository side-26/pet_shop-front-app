import { UserRoundIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { routePaths } from '@/configs/route.path';
import type { ArticleListDTO } from '@/entities/articles/articles.dto';
import { cn } from '@/lib/utils';

type ArticleCardProps = Readonly<{
  article: ArticleListDTO;
  isSkeleton?: boolean;
}>;

export function ArticleCard({ article, isSkeleton = false }: ArticleCardProps) {
  const name = article.author.fullName || 'نویسنده پت‌شاپ';
  const avatar = article.author.image || article.author.thumbnailImage;
  const card = (
    <Card
      size="xs"
      className={cn(
        'tw:h-full',
        isSkeleton
          ? 'tw:cursor-default'
          : 'tw:cursor-pointer tw:hover:-translate-y-0.5 tw:hover:shadow-xl',
      )}
      variant="elevated"
    >
      <div className="tw:relative tw:mx-3 tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl tw:bg-muted">
        {isSkeleton ? (
          <div className="tw:absolute tw:inset-0" />
        ) : (
          <Image
            src={article.mainImage}
            alt={`تصویر مقاله ${article.title}`}
            fill
            placeholder={article.mainThumbnailImage ? 'blur' : 'empty'}
            blurDataURL={article.mainThumbnailImage}
            sizes="(min-width: 1024px) 28vw, 48vw"
            className="tw:object-cover"
          />
        )}
      </div>
      <CardHeader className="tw:gap-2">
        <CardTitle className="tw:min-h-10 tw:line-clamp-2 tw:text-label-s tw:leading-5 tw:sm:min-h-12 tw:sm:text-title-s">
          {article.title}
        </CardTitle>
        <p className="tw:line-clamp-2 tw:text-caption tw:leading-5 tw:text-muted-foreground tw:sm:text-body-s">
          {article.summary || article.subtitle}
        </p>
      </CardHeader>
      <CardContent className="tw:mt-auto" />
      <CardFooter className="tw:border-t tw:border-border/60 tw:pt-3 tw:text-body-s">
        <Avatar size="sm" aria-label={isSkeleton ? undefined : `تصویر ${name}`}>
          {avatar && !isSkeleton ? <AvatarImage src={avatar} alt="" /> : null}
          <AvatarFallback>
            <UserRoundIcon aria-hidden="true" />
          </AvatarFallback>
        </Avatar>
        <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-1.5 tw:text-caption">
          <p className="tw:truncate tw:text-label-s">{name}</p>
          <span aria-hidden="true" className="tw:text-muted-foreground">
            |
          </span>
          <time className="tw:shrink-0 tw:text-muted-foreground">{article.createdAt || '—'}</time>
        </div>
      </CardFooter>
    </Card>
  );

  return isSkeleton ? (
    card
  ) : (
    <Link href={routePaths.articleDetail(article.slug)} prefetch>
      {card}
    </Link>
  );
}
