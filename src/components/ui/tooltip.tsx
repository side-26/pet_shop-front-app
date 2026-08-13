'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const tooltipVariants = tv({
  slots: {
    content:
      'tw:isolate tw:z-50 tw:inline-flex tw:w-fit tw:max-w-xs tw:origin-(--transform-origin) tw:items-center tw:gap-1.5 tw:rounded-xl tw:border tw:px-3 tw:py-1.5 tw:text-xs tw:shadow-md tw:data-open:animate-in tw:data-open:fade-in-0 tw:data-open:zoom-in-95 tw:data-closed:animate-out tw:data-closed:fade-out-0 tw:data-closed:zoom-out-95',
    arrow:
      'tw:z-50 tw:h-2 tw:w-4 tw:overflow-visible tw:data-[side=bottom]:top-px tw:data-[side=bottom]:rotate-180 tw:data-[side=inline-end]:top-1/2! tw:data-[side=inline-end]:-start-2 tw:data-[side=inline-end]:-translate-y-1/2 tw:data-[side=inline-end]:rotate-90 tw:data-[side=inline-start]:top-1/2! tw:data-[side=inline-start]:-end-2 tw:data-[side=inline-start]:-translate-y-1/2 tw:data-[side=inline-start]:-rotate-90 tw:data-[side=left]:top-1/2! tw:data-[side=left]:-right-2 tw:data-[side=left]:-translate-y-1/2 tw:data-[side=left]:-rotate-90 tw:data-[side=right]:top-1/2! tw:data-[side=right]:-left-2 tw:data-[side=right]:-translate-y-1/2 tw:data-[side=right]:rotate-90 tw:data-[side=top]:-bottom-2',
  },
  variants: {
    variant: { fill: {}, outlined: {}, tonal: {} },
    color: { primary: {}, secondary: {}, info: {}, success: {}, warning: {}, error: {} },
  },
  compoundSlots: [
    {
      slots: ['content', 'arrow'],
      color: 'primary',
      variant: 'fill',
      class: 'tw:border-primary tw:bg-primary tw:text-primary-foreground tw:fill-primary',
    },
    {
      slots: ['content', 'arrow'],
      color: 'secondary',
      variant: 'fill',
      class: 'tw:border-secondary tw:bg-secondary tw:text-secondary-foreground tw:fill-secondary',
    },
    {
      slots: ['content', 'arrow'],
      color: 'info',
      variant: 'fill',
      class: 'tw:border-info tw:bg-info tw:text-info-foreground tw:fill-info',
    },
    {
      slots: ['content', 'arrow'],
      color: 'success',
      variant: 'fill',
      class: 'tw:border-success tw:bg-success tw:text-success-foreground tw:fill-success',
    },
    {
      slots: ['content', 'arrow'],
      color: 'warning',
      variant: 'fill',
      class: 'tw:border-warning tw:bg-warning tw:text-warning-foreground tw:fill-warning',
    },
    {
      slots: ['content', 'arrow'],
      color: 'error',
      variant: 'fill',
      class: 'tw:border-error tw:bg-error tw:text-error-foreground tw:fill-error',
    },
    {
      slots: ['content', 'arrow'],
      color: 'primary',
      variant: 'outlined',
      class: 'tw:border-primary tw:bg-background tw:text-primary tw:fill-background',
    },
    {
      slots: ['content', 'arrow'],
      color: 'secondary',
      variant: 'outlined',
      class: 'tw:border-secondary tw:bg-background tw:text-secondary-active tw:fill-background',
    },
    {
      slots: ['content', 'arrow'],
      color: 'info',
      variant: 'outlined',
      class: 'tw:border-info tw:bg-background tw:text-info tw:fill-background',
    },
    {
      slots: ['content', 'arrow'],
      color: 'success',
      variant: 'outlined',
      class: 'tw:border-success tw:bg-background tw:text-success tw:fill-background',
    },
    {
      slots: ['content', 'arrow'],
      color: 'warning',
      variant: 'outlined',
      class: 'tw:border-warning tw:bg-background tw:text-warning-active tw:fill-background',
    },
    {
      slots: ['content', 'arrow'],
      color: 'error',
      variant: 'outlined',
      class: 'tw:border-error tw:bg-background tw:text-error tw:fill-background',
    },
    {
      slots: ['content', 'arrow'],
      color: 'primary',
      variant: 'tonal',
      class:
        'tw:border-primary-muted tw:bg-primary-muted tw:text-primary-muted-foreground tw:fill-primary-muted',
    },
    {
      slots: ['content', 'arrow'],
      color: 'secondary',
      variant: 'tonal',
      class:
        'tw:border-secondary-muted tw:bg-secondary-muted tw:text-secondary-muted-foreground tw:fill-secondary-muted',
    },
    {
      slots: ['content', 'arrow'],
      color: 'info',
      variant: 'tonal',
      class:
        'tw:border-info-muted tw:bg-info-muted tw:text-info-muted-foreground tw:fill-info-muted',
    },
    {
      slots: ['content', 'arrow'],
      color: 'success',
      variant: 'tonal',
      class:
        'tw:border-success-muted tw:bg-success-muted tw:text-success-muted-foreground tw:fill-success-muted',
    },
    {
      slots: ['content', 'arrow'],
      color: 'warning',
      variant: 'tonal',
      class:
        'tw:border-warning-muted tw:bg-warning-muted tw:text-warning-muted-foreground tw:fill-warning-muted',
    },
    {
      slots: ['content', 'arrow'],
      color: 'error',
      variant: 'tonal',
      class:
        'tw:border-error-muted tw:bg-error-muted tw:text-error-muted-foreground tw:fill-error-muted',
    },
  ],
  defaultVariants: { variant: 'fill', color: 'primary' },
});

type TooltipContentProps = TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> &
  VariantProps<typeof tooltipVariants>;

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />;
}
function Tooltip(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}
function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  side = 'top',
  sideOffset = 8,
  align = 'center',
  alignOffset = 0,
  children,
  variant = 'fill',
  color = 'primary',
  ...props
}: TooltipContentProps) {
  const styles = tooltipVariants({ variant, color });
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="tw:isolate tw:z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          data-variant={variant}
          data-color={color}
          className={cn(styles.content(), className)}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            data-slot="tooltip-arrow"
            className={cn(styles.arrow(), variant !== 'outlined' && 'tw:!bg-transparent')}
            render={
              <svg viewBox="0 0 20 10" preserveAspectRatio="none" aria-hidden="true">
                {variant === 'outlined' ? (
                  <rect data-slot="tooltip-arrow-mask" x="-1" y="-1" width="22" height="3" />
                ) : null}
                <path d="M0 0 L10 10 L20 0 Z" />
                {variant === 'outlined' ? (
                  <path
                    d="M0 0 L10 10 L20 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
              </svg>
            }
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  tooltipVariants,
  type TooltipContentProps,
};
