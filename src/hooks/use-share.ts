'use client';

import { useCallback, useState } from 'react';

type UseShareOptions = Readonly<{
  cancelledMessage?: string;
  copiedMessage: string;
  title: string;
}>;

/**
 * Shares the current page through the platform share sheet, falling back to the clipboard.
 */
export function useShare({
  cancelledMessage = 'اشتراک‌گذاری لغو شد',
  copiedMessage,
  title,
}: UseShareOptions) {
  const [status, setStatus] = useState('');

  const share = useCallback(async () => {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      await navigator.clipboard?.writeText(url);
      setStatus(copiedMessage);
    } catch {
      setStatus(cancelledMessage);
    }
  }, [cancelledMessage, copiedMessage, title]);

  return { share, status };
}
