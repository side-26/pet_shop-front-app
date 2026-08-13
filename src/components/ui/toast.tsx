'use client';

import * as React from 'react';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  XIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react';

const toast = ToastPrimitive.createToastManager();

const toastVariants = tv({
  base: 'tw:group/toast tw:pointer-events-auto tw:absolute tw:top-0 tw:end-0 tw:z-[calc(1000-var(--toast-index))] tw:w-full tw:origin-top tw:rounded-2xl tw:border tw:shadow-lg tw:will-change-transform tw:outline-none tw:select-none tw:focus-visible:ring-3',
  variants: {
    variant: {
      fill: 'tw:border-transparent',
      outlined: 'tw:bg-background',
      tonal: 'tw:border-transparent',
    },
    color: { primary: '', secondary: '', info: '', success: '', warning: '', error: '' },
  },
  compoundVariants: [
    { color: 'primary', variant: 'fill', class: 'tw:bg-primary tw:text-primary-foreground' },
    { color: 'secondary', variant: 'fill', class: 'tw:bg-secondary tw:text-secondary-foreground' },
    { color: 'info', variant: 'fill', class: 'tw:bg-info tw:text-info-foreground' },
    { color: 'success', variant: 'fill', class: 'tw:bg-success tw:text-success-foreground' },
    { color: 'warning', variant: 'fill', class: 'tw:bg-warning tw:text-warning-foreground' },
    { color: 'error', variant: 'fill', class: 'tw:bg-error tw:text-error-foreground' },
    { color: 'primary', variant: 'outlined', class: 'tw:border-primary tw:text-primary' },
    {
      color: 'secondary',
      variant: 'outlined',
      class: 'tw:border-secondary tw:text-secondary-active',
    },
    { color: 'info', variant: 'outlined', class: 'tw:border-info tw:text-info' },
    { color: 'success', variant: 'outlined', class: 'tw:border-success tw:text-success' },
    { color: 'warning', variant: 'outlined', class: 'tw:border-warning tw:text-warning-active' },
    { color: 'error', variant: 'outlined', class: 'tw:border-error tw:text-error' },
    {
      color: 'primary',
      variant: 'tonal',
      class: 'tw:bg-primary-muted tw:text-primary-muted-foreground',
    },
    {
      color: 'secondary',
      variant: 'tonal',
      class: 'tw:bg-secondary-muted tw:text-secondary-muted-foreground',
    },
    { color: 'info', variant: 'tonal', class: 'tw:bg-info-muted tw:text-info-muted-foreground' },
    {
      color: 'success',
      variant: 'tonal',
      class: 'tw:bg-success-muted tw:text-success-muted-foreground',
    },
    {
      color: 'warning',
      variant: 'tonal',
      class: 'tw:bg-warning-muted tw:text-warning-muted-foreground',
    },
    { color: 'error', variant: 'tonal', class: 'tw:bg-error-muted tw:text-error-muted-foreground' },
  ],
  defaultVariants: { variant: 'tonal', color: 'primary' },
});

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        'tw:pointer-events-none tw:fixed tw:top-4 tw:left-1/2 tw:z-50 tw:w-[calc(100%-2rem)] tw:max-w-sm tw:-translate-x-1/2 tw:outline-none',
        className,
      )}
      {...props}
    />
  );
}

type ToastProps = ToastPrimitive.Root.Props & VariantProps<typeof toastVariants>;

function Toast({ className, variant = 'tonal', color = 'primary', ...props }: ToastProps) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        toastVariants({ variant, color }),
        'tw:[--gap:0.75rem] tw:[--height:var(--toast-frontmost-height,var(--toast-height))] tw:[--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))] tw:[--peek:0.75rem] tw:[--scale:calc(max(0,1-(var(--toast-index)*0.1)))] tw:[--shrink:calc(1-var(--scale))]',
        'tw:h-(--height) tw:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))] tw:[transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]',
        'tw:after:absolute tw:after:top-full tw:after:start-0 tw:after:h-[calc(var(--gap)+1px)] tw:after:w-full tw:after:content-[]',
        'tw:data-expanded:h-(--toast-height) tw:data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
        'tw:data-limited:opacity-0 tw:data-starting-style:[transform:translateY(-150%)]',
        'tw:[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]',
        'tw:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
        'tw:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
        'tw:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
        'tw:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
        'tw:data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
        'tw:data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
        'tw:data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
        'tw:data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
        className,
      )}
      {...props}
    />
  );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        'tw:flex tw:h-full tw:items-center tw:gap-3 tw:overflow-hidden tw:p-4 tw:transition-opacity tw:duration-250 tw:ease-[cubic-bezier(0.22,1,0.36,1)] tw:data-behind:opacity-0 tw:data-expanded:opacity-100',
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn('tw:text-sm tw:font-medium', className)}
      {...props}
    />
  );
}

function ToastDescription({ className, ...props }: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn('tw:text-sm tw:text-current tw:opacity-75', className)}
      {...props}
    />
  );
}

function ToastAction({
  className,
  render = <Button variant="outlined" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn('tw:shrink-0', className)}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  render = <Button variant="flat" iconOnly size="sm" color="primary" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="بستن اعلان"
      render={render}
      className={cn(
        'tw:relative tw:shrink-0 tw:!border-current tw:!bg-transparent tw:!text-current tw:after:absolute tw:after:-inset-2 tw:after:content-[] tw:hover:!bg-current/10 tw:hover:!text-current',
        className,
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}

function ToastIcon({ type }: { type: string | undefined }) {
  let icon: React.ReactNode = null;

  if (type === 'success') {
    icon = <CircleCheckIcon aria-hidden="true" />;
  }

  if (type === 'info') {
    icon = <InfoIcon aria-hidden="true" />;
  }

  if (type === 'warning') {
    icon = <TriangleAlertIcon aria-hidden="true" />;
  }

  if (type === 'error') {
    icon = <OctagonXIcon className="tw:text-destructive" aria-hidden="true" />;
  }

  if (type === 'loading') {
    icon = <Loader2Icon className="tw:animate-spin" aria-hidden="true" />;
  }

  if (!icon) {
    return null;
  }

  return (
    <span
      data-slot="toast-icon"
      className="tw:shrink-0 tw:[&_svg]:pointer-events-none tw:[&_svg:not([class*=size-])]:size-4"
    >
      {icon}
    </span>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem} color={toastColor(toastItem.type)}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

function toastColor(type: string | undefined): NonNullable<ToastProps['color']> {
  if (type === 'success' || type === 'info' || type === 'warning' || type === 'error') return type;
  return 'primary';
}

function Toaster({ children, toastManager = toast, ...props }: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
  toastVariants,
  type ToastProps,
};
