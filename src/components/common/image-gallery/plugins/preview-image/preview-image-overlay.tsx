import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type PreviewImageOverlayPosition =
  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

type PreviewImageOverlayProps = Readonly<{
  children: ReactNode;
  position: PreviewImageOverlayPosition;
}>;

const positionClasses: Record<PreviewImageOverlayPosition, string> = {
  'top-left': 'tw:left-2 tw:top-2',
  'top-right': 'tw:right-2 tw:top-2',
  'bottom-left': 'tw:bottom-2 tw:left-2',
  'bottom-right': 'tw:bottom-2 tw:right-2',
  center: 'tw:left-1/2 tw:top-1/2 tw:-translate-x-1/2 tw:-translate-y-1/2',
};

export function PreviewImageOverlay({ children, position }: PreviewImageOverlayProps) {
  return (
    <div
      data-position={position}
      data-slot="preview-image-overlay"
      className={cn('tw:absolute tw:p-2', positionClasses[position])}
    >
      {children}
    </div>
  );
}
