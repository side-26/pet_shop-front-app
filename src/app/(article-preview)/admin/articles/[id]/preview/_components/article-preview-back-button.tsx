import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

const label = 'بازگشت به فهرست مقاله‌ها';

export function ArticlePreviewBackButton() {
  return (
    <div className="tw:fixed tw:bottom-4 tw:h-fit tw:left-4 tw:z-60 tw:sm:left-6">
      <Link
        aria-label={label}
        className={cn(
          buttonVariants({ color: 'primary', size: 'lg', variant: 'transparent' }),
          'tw:aspect-square tw:px-0 tw:shadow-lg tw:ring-1 tw:ring-primary/15',
        )}
        href={routePaths.adminArticles}
        title={label}
      >
        <ArrowRightIcon aria-hidden="true" />
      </Link>
    </div>
  );
}
