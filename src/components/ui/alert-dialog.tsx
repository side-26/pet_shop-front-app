'use client';

import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import { tv, type VariantProps } from 'tailwind-variants';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const alertDialogContentVariants = tv({
  base: [
    'tw:group/alert-dialog-content tw:fixed tw:top-1/2 tw:left-1/2 tw:z-50 tw:grid tw:w-[calc(100%-2rem)]',
    'tw:-translate-x-1/2 tw:-translate-y-1/2 tw:gap-6 tw:rounded-3xl',
    'tw:border tw:border-border/60 tw:bg-popover/88 tw:p-6 tw:text-popover-foreground',
    'tw:shadow-2xl tw:shadow-foreground/15 tw:outline-none tw:supports-backdrop-filter:backdrop-blur-2xl',
    'tw:duration-150 tw:data-open:animate-in tw:data-open:fade-in-0 tw:data-open:zoom-in-95',
    'tw:data-closed:animate-out tw:data-closed:fade-out-0 tw:data-closed:zoom-out-95',
    'tw:motion-reduce:animate-none tw:motion-reduce:transition-none',
  ],
  variants: {
    size: {
      sm: 'tw:max-w-xs tw:gap-4 tw:p-5',
      md: 'tw:max-w-md',
      lg: 'tw:max-w-lg tw:gap-7 tw:p-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

function AlertDialog(props: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal(props: AlertDialogPrimitive.Portal.Props) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({ className, ...props }: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        'tw:fixed tw:inset-0 tw:isolate tw:z-50 tw:bg-overlay tw:duration-150',
        'tw:supports-backdrop-filter:backdrop-blur-md tw:data-open:animate-in tw:data-open:fade-in-0',
        'tw:data-closed:animate-out tw:data-closed:fade-out-0 tw:motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
}

type AlertDialogContentProps = AlertDialogPrimitive.Popup.Props &
  VariantProps<typeof alertDialogContentVariants>;

function AlertDialogContent({ className, size = 'md', ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(alertDialogContentVariants({ size }), className)}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        'tw:grid tw:grid-rows-[auto_1fr] tw:place-items-center tw:gap-2 tw:text-center',
        'tw:has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr]',
        'tw:sm:group-data-[size=md]/alert-dialog-content:place-items-start tw:sm:group-data-[size=lg]/alert-dialog-content:place-items-start',
        'tw:sm:group-data-[size=md]/alert-dialog-content:text-start tw:sm:group-data-[size=lg]/alert-dialog-content:text-start',
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'tw:flex tw:flex-col-reverse tw:gap-2 tw:group-data-[size=sm]/alert-dialog-content:grid tw:group-data-[size=sm]/alert-dialog-content:grid-cols-2',
        'tw:sm:flex-row tw:sm:justify-start',
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-media"
      aria-hidden="true"
      className={cn(
        'tw:mb-1 tw:inline-flex tw:size-14 tw:items-center tw:justify-center tw:rounded-2xl',
        'tw:border tw:border-border/60 tw:bg-muted/75 tw:text-muted-foreground tw:shadow-sm',
        'tw:*:[svg:not([class*=size-])]:size-7',
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('tw:text-title-m tw:text-popover-foreground', className)}
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        'tw:text-body-s tw:text-pretty tw:text-muted-foreground tw:*:[a]:underline tw:*:[a]:underline-offset-4 tw:*:[a]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  variant = 'fill',
  color = 'primary',
  ...props
}: ButtonProps) {
  return (
    <Button
      data-slot="alert-dialog-action"
      variant={variant}
      color={color}
      className={cn('tw:max-sm:w-full', className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  variant = 'outlined',
  color = 'error',
  size = 'md',
  ...props
}: AlertDialogPrimitive.Close.Props & Pick<ButtonProps, 'variant' | 'color' | 'size'>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn('tw:max-sm:w-full', className)}
      render={<Button variant={variant} color={color} size={size} />}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  alertDialogContentVariants,
  type AlertDialogContentProps,
};
