import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type PreviewImageOverlayPosition =
  'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

type PreviewImageOverlayProps = Readonly<{
  children: ReactNode;
  position: PreviewImageOverlayPosition;
}>;

const positionClasses: Record<PreviewImageOverlayPosition, string> = {
  'top-left': 'tw:start-3 tw:top-3 tw:sm:start-4 tw:sm:top-4',
  'top-right': 'tw:end-3 tw:top-3 tw:sm:end-4 tw:sm:top-4',
  'bottom-left': 'tw:bottom-3 tw:start-3 tw:sm:bottom-4 tw:sm:start-4',
  'bottom-right': 'tw:bottom-3 tw:end-3 tw:sm:bottom-4 tw:sm:end-4',
  center: 'tw:start-1/2 tw:top-1/2 tw:-translate-x-1/2 tw:-translate-y-1/2',
};

export function PreviewImageOverlay({ children, position }: PreviewImageOverlayProps) {
  return (
    <div
      data-position={position}
      data-slot="preview-image-overlay"
      className={cn('tw:absolute tw:p-3 tw:sm:p-4', positionClasses[position])}
    >
      {children}
    </div>
  );
}
