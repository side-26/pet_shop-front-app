import { tv } from 'tailwind-variants';

export const selectionFieldVariants = tv({
  slots: {
    field: 'tw:relative',
    controlRow: 'tw:flex tw:items-center tw:gap-3',
    label: '',
    description: 'tw:block tw:min-h-[1lh]',
    options: 'tw:grid tw:gap-3',
  },
  variants: {
    size: {
      xs: {
        field: 'tw:gap-1',
        label: 'tw:text-label-s',
        description: 'tw:-mt-0.5 tw:text-xs',
        options: 'tw:gap-2',
      },
      sm: {
        field: 'tw:gap-1.5',
        label: 'tw:text-label-s',
        description: 'tw:-mt-0.5 tw:text-xs',
        options: 'tw:gap-2.5',
      },
      md: {
        field: 'tw:gap-2',
        label: 'tw:text-label-m',
        description: 'tw:-mt-1 tw:text-xs',
      },
      lg: {
        field: 'tw:gap-2',
        label: 'tw:text-label-l',
        description: 'tw:-mt-1 tw:text-[13px]/[1.6]',
      },
      xl: {
        field: 'tw:gap-2.5',
        label: 'tw:text-label-l',
        description: 'tw:-mt-1.5 tw:text-[13px]/[1.6]',
        options: 'tw:gap-4',
      },
    },
  },
  defaultVariants: { size: 'md' },
});
