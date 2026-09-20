'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ExpandableDrawerSectionProps extends ComponentProps<'section'> {
  children: ReactNode;
  collapsedHeight?: number;
  showMoreLabel?: ReactNode;
  disabled?: boolean;
  onShowMore: () => void;
}

/**
 * A compact content preview that delegates the complete content to a drawer.
 * It intentionally never changes its own height.
 */
export function ExpandableDrawerSection({
  children,
  collapsedHeight = 112,
  showMoreLabel = 'نمایش بیشتر',
  disabled = false,
  onShowMore,
  className,
  ...props
}: ExpandableDrawerSectionProps) {
  const contentId = useId();

  return (
    <section
      className={cn('tw:relative tw:overflow-hidden tw:px-4 tw:pt-4 tw:pb-2', className)}
      {...props}
    >
      <div
        id={contentId}
        className="tw:relative tw:overflow-hidden"
        style={{ maxHeight: collapsedHeight }}
      >
        {children}
        <div
          aria-hidden="true"
          className="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:bottom-0 tw:h-12 tw:bg-linear-to-t tw:from-background tw:to-transparent"
        />
      </div>
      <div className="tw:relative tw:z-10 tw:flex tw:justify-center tw:pt-2">
        <Button
          type="button"
          variant="flat"
          color="primary"
          onClick={onShowMore}
          disabled={disabled}
          aria-controls={contentId}
          aria-haspopup="dialog"
        >
          {showMoreLabel}
        </Button>
      </div>
    </section>
  );
}
