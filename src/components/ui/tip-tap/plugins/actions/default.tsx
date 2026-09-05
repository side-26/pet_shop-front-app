'use client';

import type { ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

import { useTipTapActionsContext } from './context';

const tipTapHeaderActionsVariants = tv({
  base: 'tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:border-b tw:border-current/20 tw:p-2',
  variants: {
    variant: {
      fill: 'tw:bg-background/92 tw:text-foreground',
      tonal: 'tw:bg-background/75 tw:text-foreground',
      outlined: 'tw:bg-muted/35 tw:text-foreground',
    },
  },
  defaultVariants: { variant: 'outlined' },
});

type TipTapHeaderActionsProps = VariantProps<typeof tipTapHeaderActionsVariants> & {
  children: ReactNode;
  className?: string;
};

function TipTapHeaderActions({ children, className, variant }: TipTapHeaderActionsProps) {
  const context = useTipTapActionsContext();
  const resolvedVariant = variant ?? context.variant;

  return (
    <div
      aria-label="ابزارهای ویرایش متن"
      className={cn(tipTapHeaderActionsVariants({ variant: resolvedVariant }), className)}
      data-color={context.color}
      data-slot="tip-tap-header-actions"
      data-variant={resolvedVariant}
      role="toolbar"
    >
      {children}
    </div>
  );
}

export { TipTapHeaderActions, tipTapHeaderActionsVariants, type TipTapHeaderActionsProps };
