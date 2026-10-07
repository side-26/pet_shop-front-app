import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { ArticlesRowActions } from './articles-row-actions';
import type { ArticleTableRow } from './articles-table.types';

type ArticlesTableProps = { articles: ArticleTableRow[]; isLoading?: boolean };

function displayValue(value: string) {
  return value.trim() || '_';
}

export function ArticlesTable({ articles, isLoading = false }: ArticlesTableProps) {
  return (
    <section
      aria-label="فهرست مقاله‌ها"
      aria-busy={isLoading || undefined}
      className={cn(
        'tw:flex tw:h-10 tw:min-h-0 tw:flex-auto tw:flex-col tw:gap-4',
        isLoading && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:min-h-0 tw:flex-1 tw:overflow-auto tw:rounded-2xl tw:border tw:border-border tw:[&>[data-slot=table-container]]:overflow-visible">
        <Table>
          <TableHeader className="tw:[&_[data-slot=table-head]]:sticky tw:[&_[data-slot=table-head]]:top-0 tw:[&_[data-slot=table-head]]:z-10 tw:[&_[data-slot=table-head]]:bg-background">
            <TableRow>
              <TableHead className="tw:w-16">
                <div>
                  <span className="tw:sr-only">تصویر</span>
                </div>
              </TableHead>
              <TableHead>
                <div>عنوان</div>
              </TableHead>
              <TableHead>
                <div>نوع حیوان</div>
              </TableHead>
              <TableHead>
                <div>برچسب‌ها</div>
              </TableHead>
              <TableHead>
                <div>خلاصه</div>
              </TableHead>
              <TableHead className="tw:w-24">
                <div>
                  <span className="tw:sr-only">عملیات</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <Avatar
                    size="lg"
                    aria-label={`تصویر ${displayValue(article.title)}`}
                    style={{
                      backgroundImage: `url("${article.mainThumbnailImage}")`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  >
                    <AvatarImage
                      src={article.mainImage}
                      alt={`تصویر ${displayValue(article.title)}`}
                    />
                    <AvatarFallback className="tw:bg-transparent" />
                  </Avatar>
                </TableCell>
                <TableCell className="tw:max-w-56 tw:font-medium tw:whitespace-normal">
                  <div className="tw:line-clamp-2">{displayValue(article.title)}</div>
                </TableCell>
                <TableCell className="tw:max-w-40 tw:whitespace-normal">
                  {article.petType ? (
                    <bdi dir="ltr" className="tw:block tw:truncate">
                      {article.petType}
                    </bdi>
                  ) : (
                    <span className="tw:text-muted-foreground">بدون نوع حیوان</span>
                  )}
                </TableCell>
                <TableCell className="tw:max-w-64">
                  <div className="tw:flex tw:flex-wrap tw:gap-1">
                    {article.tags.length ? (
                      article.tags.map((tag) => (
                        <Badge key={tag} color="neutral" size="sm" variant="tonal">
                          {displayValue(tag)}
                        </Badge>
                      ))
                    ) : (
                      <span className="tw:text-muted-foreground">_</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="tw:max-w-80 tw:whitespace-normal">
                  <div className="tw:line-clamp-2">{displayValue(article.summary)}</div>
                </TableCell>
                <TableCell>
                  <ArticlesRowActions articleTitle={article.title} disabled={isLoading} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
