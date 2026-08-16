'use client';

import { MinusIcon } from 'lucide-react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { useContext, type ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

function InputOTP({
  className,
  containerClassName,
  ...props
}: ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        'tw:flex tw:max-w-full tw:items-center tw:has-disabled:opacity-60',
        containerClassName,
      )}
      spellCheck={false}
      className={cn('tw:disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

const inputOtpGroupVariants = tv({
  base: 'tw:flex tw:max-w-full tw:items-center',
  variants: {
    size: {
      xs: 'tw:gap-1',
      sm: 'tw:gap-1.5',
      md: 'tw:gap-2',
      lg: 'tw:gap-2',
      xl: 'tw:gap-2',
    },
  },
  defaultVariants: { size: 'md' },
});

type InputOTPGroupProps = ComponentProps<'div'> & VariantProps<typeof inputOtpGroupVariants>;

function InputOTPGroup({ className, size = 'md', ...props }: InputOTPGroupProps) {
  return (
    <div
      data-slot="input-otp-group"
      data-size={size}
      className={cn(inputOtpGroupVariants({ size }), className)}
      {...props}
    />
  );
}

const inputOtpSlotVariants = tv({
  base: [
    'tw:relative tw:flex tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:border tw:bg-background',
    'tw:font-medium tw:tabular-nums tw:text-foreground tw:shadow-xs tw:outline-none tw:select-none',
    'tw:transition-[border-color,box-shadow,background-color,color] tw:duration-150 tw:ease-out',
    'tw:data-[active=true]:ring-3 tw:aria-invalid:border-error tw:aria-invalid:text-error',
    'tw:data-[active=true]:aria-invalid:border-error tw:data-[active=true]:aria-invalid:ring-error/20',
    'tw:data-[disabled=true]:border-disabled-border tw:data-[disabled=true]:bg-disabled tw:data-[disabled=true]:text-disabled-foreground',
    'tw:motion-reduce:transition-none',
  ],
  variants: {
    color: {
      primary:
        'tw:border-primary/55 tw:data-[active=true]:border-primary tw:data-[active=true]:ring-primary/20',
      secondary:
        'tw:border-secondary/60 tw:data-[active=true]:border-secondary tw:data-[active=true]:ring-secondary/20',
      info: 'tw:border-info/55 tw:data-[active=true]:border-info tw:data-[active=true]:ring-info/20',
      success:
        'tw:border-success/55 tw:data-[active=true]:border-success tw:data-[active=true]:ring-success/20',
      warning:
        'tw:border-warning/60 tw:data-[active=true]:border-warning tw:data-[active=true]:ring-warning/20',
      error:
        'tw:border-error/55 tw:data-[active=true]:border-error tw:data-[active=true]:ring-error/20',
    },
    size: {
      xs: 'tw:size-7 tw:rounded-lg tw:text-xs',
      sm: 'tw:size-8 tw:rounded-lg tw:text-xs',
      md: 'tw:size-10 tw:text-sm',
      lg: 'tw:size-11 tw:text-sm',
      xl: 'tw:size-12 tw:text-base',
    },
  },
  defaultVariants: { color: 'primary', size: 'md' },
});

type InputOTPSlotProps = Omit<ComponentProps<'div'>, 'color'> &
  VariantProps<typeof inputOtpSlotVariants> & {
    index: number;
  };

function InputOTPSlot({
  index,
  className,
  color = 'primary',
  size = 'md',
  ...props
}: InputOTPSlotProps) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-color={color}
      data-size={size}
      className={cn(inputOtpSlotVariants({ color, size }), className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="tw:pointer-events-none tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center">
          <div className="tw:h-4 tw:w-px tw:animate-caret-blink tw:bg-current tw:duration-1000 tw:motion-reduce:animate-none" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-separator"
      className={cn(
        'tw:flex tw:items-center tw:text-muted-foreground tw:[&_svg:not([class*=size-])]:size-4',
        className,
      )}
      role="separator"
      {...props}
    >
      <MinusIcon aria-hidden="true" />
    </div>
  );
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  inputOtpGroupVariants,
  inputOtpSlotVariants,
  type InputOTPGroupProps,
  type InputOTPSlotProps,
};
