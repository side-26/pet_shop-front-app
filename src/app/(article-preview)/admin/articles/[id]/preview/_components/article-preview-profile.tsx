import type { ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ArticleAuthorDTO } from '@/entities/articles/articles.dto';

type ArticlePreviewProfileProps = Readonly<{
  author?: ArticleAuthorDTO;
  children: ReactNode;
}>;

export function ArticlePreviewProfile({ author, children }: ArticlePreviewProfileProps) {
  const authorName = author ? `${author.firstName} ${author.lastName}`.trim() : 'نام نویسنده';

  return (
    <>
      <Avatar size="lg">
        {author?.avatar ? <AvatarImage src={author.avatar} alt={authorName} /> : null}
        <AvatarFallback>{authorName.at(0) ?? 'ن'}</AvatarFallback>
      </Avatar>
      <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-0.5">
        <p className="tw:truncate tw:text-body-m tw:font-medium tw:text-foreground">{authorName}</p>
        {children}
      </div>
    </>
  );
}
