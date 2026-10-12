'use client';

import { ArrowRightIcon } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { routePaths } from '@/configs/route.path';

const label = 'بازگشت به فهرست مقاله‌ها';

export function ArticlePreviewBackButton() {
  const router = useRouter();
  const button = (
    <Button
      aria-label={label}
      color="primary"
      iconOnly
      size="lg"
      type="button"
      variant="transparent"
      className="tw:shadow-lg tw:ring-1 tw:ring-primary/15"
      onClick={() => router.push(routePaths.adminArticles)}
    >
      <ArrowRightIcon aria-hidden="true" />
    </Button>
  );

  return (
    <div className="tw:fixed tw:top-4 tw:end-4 tw:z-40 tw:sm:top-6 tw:sm:end-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={button} />
          <TooltipContent align="end" side="bottom">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
