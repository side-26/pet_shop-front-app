import type { ComponentPropsWithoutRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const pointerIconVariants = tv({
  base: 'tw:shrink-0 tw:text-primary',
  variants: {
    size: {
      xs: 'tw:size-5',
      sm: 'tw:size-6',
      md: 'tw:size-8',
      lg: 'tw:size-10',
      xl: 'tw:size-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type NeshanMapPointerIconRootProps = ComponentPropsWithoutRef<'svg'> &
  VariantProps<typeof pointerIconVariants>;

function Root({ className, children, size, ...props }: NeshanMapPointerIconRootProps) {
  const isDecorative = !props['aria-label'];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={isDecorative || undefined}
      role={isDecorative ? undefined : 'img'}
      className={cn(pointerIconVariants({ size }), className)}
      {...props}
    >
      {children ?? (
        <>
          <Pin />
          <Center />
        </>
      )}
    </svg>
  );
}

function Pin(props: ComponentPropsWithoutRef<'path'>) {
  return (
    <path
      d="M12 1.5a8.25 8.25 0 0 0-8.25 8.25c0 6.188 8.25 12.75 8.25 12.75s8.25-6.562 8.25-12.75A8.25 8.25 0 0 0 12 1.5Z"
      fill="currentColor"
      {...props}
    />
  );
}

function Center(props: ComponentPropsWithoutRef<'circle'>) {
  return <circle cx="12" cy="9.75" r="3" className="tw:fill-primary-foreground" {...props} />;
}

export const NeshanMapPointerIcon = { Root, Pin, Center } as const;

export type { NeshanMapPointerIconRootProps };
