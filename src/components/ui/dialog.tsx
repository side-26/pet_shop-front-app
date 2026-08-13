'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';
import { tv, type VariantProps } from 'tailwind-variants';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const dialogContentVariants = tv({
  base: 'tw:fixed tw:top-1/2 tw:left-1/2 tw:z-50 tw:grid tw:w-[calc(100%-2rem)] tw:-translate-y-1/2 tw:-translate-x-1/2 tw:gap-6 tw:rounded-3xl tw:border tw:border-border/60 tw:bg-popover/92 tw:p-6 tw:text-popover-foreground tw:shadow-2xl tw:outline-none tw:supports-backdrop-filter:backdrop-blur-2xl tw:duration-150 tw:data-open:animate-in tw:data-open:fade-in-0 tw:data-open:zoom-in-95 tw:data-closed:animate-out tw:data-closed:fade-out-0 tw:data-closed:zoom-out-95 tw:motion-reduce:animate-none',
  variants: {
    size: {
      sm: 'tw:max-w-sm tw:p-5',
      md: 'tw:max-w-md',
      lg: 'tw:max-w-lg tw:p-8',
      xl: 'tw:max-w-2xl tw:p-8',
    },
  },
  defaultVariants: { size: 'md' },
});

type DialogContentProps = DialogPrimitive.Popup.Props &
  VariantProps<typeof dialogContentVariants> & { showCloseButton?: boolean };
function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}
function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}
function DialogCancel({
  className,
  size = 'md',
  ...props
}: DialogPrimitive.Close.Props & Pick<ButtonProps, 'size'>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-cancel"
      render={<Button variant="outlined" color="error" size={size} />}
      className={className}
      {...props}
    />
  );
}
function DialogAction({
  className,
  size = 'md',
  ...props
}: DialogPrimitive.Close.Props & Pick<ButtonProps, 'size'>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-action"
      render={<Button variant="fill" color="primary" size={size} />}
      className={className}
      {...props}
    />
  );
}
function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        'tw:fixed tw:inset-0 tw:isolate tw:z-50 tw:bg-overlay tw:supports-backdrop-filter:backdrop-blur-md tw:duration-150 tw:data-open:animate-in tw:data-open:fade-in-0 tw:data-closed:animate-out tw:data-closed:fade-out-0 tw:motion-reduce:animate-none',
        className,
      )}
      {...props}
    />
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = 'md',
  finalFocus = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-size={size}
        finalFocus={finalFocus}
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            aria-label="بستن گفتگو"
            render={
              <Button
                iconOnly
                size="sm"
                variant="flat"
                color="secondary"
                className="tw:absolute tw:top-4 tw:end-4"
              />
            }
          >
            <XIcon />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}
function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('tw:flex tw:flex-col tw:gap-2 tw:text-start', className)}
      {...props}
    />
  );
}
function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'tw:flex tw:flex-col-reverse tw:gap-2 tw:sm:flex-row tw:sm:justify-start',
        className,
      )}
      {...props}
    />
  );
}
function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('tw:text-title-m tw:font-medium', className)}
      {...props}
    />
  );
}
function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('tw:text-body-s tw:text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  dialogContentVariants,
  type DialogContentProps,
};
