import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { tv, type VariantProps } from 'tailwind-variants';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const buttonGroupVariants = tv({
  base: 'tw:flex tw:w-fit tw:items-stretch tw:*:focus-visible:relative tw:*:focus-visible:z-10',
  variants: {
    orientation: {
      horizontal:
        'tw:*:data-slot:rounded-e-none tw:[&>[data-slot]:not(:has(~[data-slot]))]:rounded-e-xl! tw:[&>[data-slot]~[data-slot]]:rounded-s-none tw:[&>[data-slot]~[data-slot]]:border-s-0',
      vertical:
        'tw:flex-col tw:*:data-slot:rounded-b-none tw:[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-xl! tw:[&>[data-slot]~[data-slot]]:rounded-t-none tw:[&>[data-slot]~[data-slot]]:border-t-0',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

type ButtonGroupProps = React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>;
function ButtonGroup({ className, orientation = 'horizontal', ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}
function ButtonGroupText({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          'tw:flex tw:items-center tw:gap-2 tw:rounded-xl tw:border tw:border-border tw:bg-muted tw:px-2.5 tw:text-sm tw:font-medium',
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: 'button-group-text' },
  });
}
function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn('tw:relative tw:self-stretch tw:bg-border', className)}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
  type ButtonGroupProps,
};
