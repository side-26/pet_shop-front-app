import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const dataGridVariants = tv({
  slots: {
    root: 'tw:group/data-grid tw:w-full tw:text-body-m',
    item: 'tw:grid tw:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] tw:items-start tw:gap-x-6 tw:gap-y-2',
    label: 'tw:font-medium tw:text-muted-foreground',
    value: 'tw:font-semibold tw:text-foreground',
  },
  variants: {
    borderColor: {
      neutral: {
        root: 'tw:border-gray-200 tw:[&>[data-slot=data-grid-item]]:border-gray-200',
      },
      primary: {
        root: 'tw:border-primary/35 tw:[&>[data-slot=data-grid-item]]:border-primary/35',
      },
      secondary: {
        root: 'tw:border-secondary/40 tw:[&>[data-slot=data-grid-item]]:border-secondary/40',
      },
    },
    variant: {
      line: {
        root: 'tw:[&>[data-slot=data-grid-item]]:border-b tw:[&>[data-slot=data-grid-item]:last-child]:border-b-0',
      },
      outlined: {
        root: 'tw:overflow-hidden tw:rounded-2xl tw:border tw:[&>[data-slot=data-grid-item]]:border-b tw:[&>[data-slot=data-grid-item]:last-child]:border-b-0',
      },
      filled: {
        root: 'tw:overflow-hidden tw:rounded-2xl tw:bg-muted/50 tw:[&>[data-slot=data-grid-item]]:border-b tw:[&>[data-slot=data-grid-item]:last-child]:border-b-0',
      },
    },
    size: {
      xs: {
        root: 'tw:[&>[data-slot=data-grid-item]]:px-3 tw:[&>[data-slot=data-grid-item]]:py-2 tw:[&>[data-slot=data-grid-item]]:text-label-s',
      },
      sm: {
        root: 'tw:[&>[data-slot=data-grid-item]]:px-4 tw:[&>[data-slot=data-grid-item]]:py-3 tw:[&>[data-slot=data-grid-item]]:text-label-m',
      },
      md: {
        root: 'tw:[&>[data-slot=data-grid-item]]:px-5 tw:[&>[data-slot=data-grid-item]]:py-5 tw:[&>[data-slot=data-grid-item]]:text-body-m',
      },
      lg: {
        root: 'tw:[&>[data-slot=data-grid-item]]:px-6 tw:[&>[data-slot=data-grid-item]]:py-6 tw:[&>[data-slot=data-grid-item]]:text-body-l',
      },
      xl: {
        root: 'tw:[&>[data-slot=data-grid-item]]:px-8 tw:[&>[data-slot=data-grid-item]]:py-8 tw:[&>[data-slot=data-grid-item]]:text-title-s',
      },
    },
  },
  defaultVariants: { borderColor: 'neutral', variant: 'line', size: 'md' },
});

type DataGridStyleProps = VariantProps<typeof dataGridVariants>;
export type DataGridRootProps = ComponentProps<'dl'> & DataGridStyleProps;
export type DataGridItemProps = ComponentProps<'div'>;
export type DataGridLabelProps = ComponentProps<'dt'>;
export type DataGridValueProps = ComponentProps<'dd'>;

function Root({
  borderColor = 'neutral',
  className,
  size = 'md',
  variant = 'line',
  ...props
}: DataGridRootProps) {
  const styles = dataGridVariants({ borderColor, size, variant });

  return (
    <dl
      data-slot="data-grid"
      data-border-color={borderColor}
      data-size={size}
      data-variant={variant}
      className={cn(styles.root(), className)}
      {...props}
    />
  );
}

function Item({ className, ...props }: DataGridItemProps) {
  const styles = dataGridVariants();
  return <div data-slot="data-grid-item" className={cn(styles.item(), className)} {...props} />;
}

function Label({ className, ...props }: DataGridLabelProps) {
  const styles = dataGridVariants();
  return <dt data-slot="data-grid-label" className={cn(styles.label(), className)} {...props} />;
}

function Value({ className, ...props }: DataGridValueProps) {
  const styles = dataGridVariants();
  return <dd data-slot="data-grid-value" className={cn(styles.value(), className)} {...props} />;
}

const DataGrid = { Root, Item, Label, Value };

export {
  DataGrid,
  Root as DataGridRoot,
  Item as DataGridItem,
  Label as DataGridLabel,
  Value as DataGridValue,
  dataGridVariants,
};
