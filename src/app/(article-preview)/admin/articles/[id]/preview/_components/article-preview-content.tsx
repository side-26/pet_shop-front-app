import { FileQuestionIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { getArticlePreviewByIdAction } from '@/entities/articles/articles.actions';

import { ArticlePreviewRenderer } from './article-preview-renderer';

type Props = Readonly<{ articlePromise: ReturnType<typeof getArticlePreviewByIdAction> }>;

export async function ArticlePreviewContent({ articlePromise }: Props) {
  const result = await articlePromise;

  if ('isSuccess' in result) {
    throw new Error(result.message ?? 'دریافت پیش‌نمایش مقاله انجام نشد.');
  }
  if (!result.id) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestionIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>مقاله‌ای برای پیش‌نمایش یافت نشد</EmptyTitle>
          <EmptyDescription>
            ممکن است مقاله حذف شده باشد یا دیگر در دسترس شما نباشد.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <ArticlePreviewRenderer article={result} />;
}
