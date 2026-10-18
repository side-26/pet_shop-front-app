'use client';

import { Share2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useShare } from '@/hooks/use-share';

export function ArticlePreviewShareButton({
  disabled = false,
  title,
}: Readonly<{ disabled?: boolean; title: string }>) {
  const { share, status } = useShare({ copiedMessage: 'پیوند مقاله کپی شد', title });

  return (
    <>
      <Button
        type="button"
        iconOnly
        size="md"
        variant="flat"
        color="secondary"
        disabled={disabled}
        aria-label="اشتراک‌گذاری مقاله"
        onClick={() => void share()}
      >
        <Share2Icon aria-hidden="true" />
      </Button>
      <span className="tw:sr-only" aria-live="polite">
        {status}
      </span>
    </>
  );
}
