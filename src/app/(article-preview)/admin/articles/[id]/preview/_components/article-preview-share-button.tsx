'use client';

import { Share2Icon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function ArticlePreviewShareButton({
  disabled = false,
  title,
}: Readonly<{ disabled?: boolean; title: string }>) {
  const [status, setStatus] = useState('');

  async function shareArticle() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
        return;
      }

      await navigator.clipboard?.writeText(window.location.href);
      setStatus('پیوند مقاله کپی شد');
    } catch {
      setStatus('اشتراک‌گذاری لغو شد');
    }
  }

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
        onClick={() => void shareArticle()}
      >
        <Share2Icon aria-hidden="true" />
      </Button>
      <span className="tw:sr-only" aria-live="polite">
        {status}
      </span>
    </>
  );
}
