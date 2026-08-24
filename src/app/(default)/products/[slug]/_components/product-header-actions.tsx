'use client';

import { Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

type ProductHeaderActionsProps = Readonly<{ title: string }>;

export function ProductHeaderActions({ title }: ProductHeaderActionsProps) {
  const [shareStatus, setShareStatus] = useState('');

  const shareProduct = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: window.location.href });
        return;
      }

      await navigator.clipboard?.writeText(window.location.href);
      setShareStatus('پیوند محصول کپی شد');
    } catch {
      setShareStatus('اشتراک‌گذاری لغو شد');
    }
  };

  return (
    <div className="tw:flex tw:items-center tw:gap-1">
      <Toggle iconOnly size="md" variant="flat" color="error" aria-label="افزودن به علاقه‌مندی‌ها">
        <Heart aria-hidden="true" />
      </Toggle>
      <Button
        iconOnly
        size="md"
        variant="flat"
        color="secondary"
        aria-label="اشتراک‌گذاری محصول"
        onClick={() => void shareProduct()}
      >
        <Share2 aria-hidden="true" />
      </Button>
      <span className="tw:sr-only" aria-live="polite">
        {shareStatus}
      </span>
    </div>
  );
}
