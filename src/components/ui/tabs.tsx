'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const tabsListVariants = tv({
  base: [
    'tw:group/tabs-list tw:inline-flex tw:w-fit tw:items-center tw:justify-center tw:rounded-full tw:bg-muted tw:p-1',
    'tw:group-data-[orientation=vertical]/tabs:h-fit tw:group-data-[orientation=vertical]/tabs:flex-col tw:group-data-[orientation=vertical]/tabs:rounded-2xl',
  ],
  variants: {
    size: { xs: 'tw:gap-0.5', sm: 'tw:gap-0.5', md: 'tw:gap-1', lg: 'tw:gap-1', xl: 'tw:gap-1' },
    variant: {
      default: '',
      line: 'tw:gap-1 tw:rounded-none tw:border-b tw:border-border tw:bg-transparent tw:p-0',
    },
  },
  defaultVariants: { size: 'md', variant: 'default' },
});

const tabsTriggerVariants = tv({
  base: [
    'tw:relative tw:inline-flex tw:flex-1 tw:items-center tw:justify-center tw:gap-2 tw:rounded-full tw:border tw:border-transparent tw:font-medium tw:whitespace-nowrap',
    'tw:text-muted-foreground tw:transition-[background-color,color,box-shadow] tw:duration-150 tw:ease-out',
    'tw:hover:bg-background/70 tw:hover:text-foreground tw:focus-visible:z-10 tw:focus-visible:outline-none tw:focus-visible:ring-3',
    'tw:data-active:shadow-sm tw:disabled:pointer-events-none tw:disabled:cursor-not-allowed tw:disabled:opacity-50',
    'tw:aria-disabled:pointer-events-none tw:aria-disabled:cursor-not-allowed tw:aria-disabled:opacity-50 tw:motion-reduce:transition-none',
    'tw:group-data-[orientation=vertical]/tabs:w-full tw:group-data-[orientation=vertical]/tabs:justify-start tw:group-data-[orientation=vertical]/tabs:rounded-xl',
    'tw:group-data-[variant=line]/tabs-list:rounded-none tw:group-data-[variant=line]/tabs-list:data-active:bg-transparent tw:group-data-[variant=line]/tabs-list:data-active:shadow-none',
    'tw:group-data-[variant=line]/tabs-list:after:absolute tw:group-data-[variant=line]/tabs-list:after:inset-x-2 tw:group-data-[variant=line]/tabs-list:after:bottom-0 tw:group-data-[variant=line]/tabs-list:after:h-0.5 tw:group-data-[variant=line]/tabs-list:after:scale-x-0 tw:group-data-[variant=line]/tabs-list:after:transition-transform tw:group-data-[variant=line]/tabs-list:data-active:after:scale-x-100',
    'tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0',
  ],
  variants: {
    size: {
      xs: 'tw:h-7 tw:px-2.5 tw:text-label-s tw:[&_svg:not([class*=size-])]:size-3',
      sm: 'tw:h-8 tw:px-3 tw:text-label-m tw:[&_svg:not([class*=size-])]:size-3.5',
      md: 'tw:h-9 tw:px-3.5 tw:text-label-m tw:[&_svg:not([class*=size-])]:size-4',
      lg: 'tw:h-10 tw:px-4 tw:text-label-l tw:[&_svg:not([class*=size-])]:size-4.5',
      xl: 'tw:h-11 tw:px-5 tw:text-label-l tw:[&_svg:not([class*=size-])]:size-5',
    },
    color: {
      primary:
        'tw:focus-visible:ring-primary/25 tw:data-active:bg-primary tw:data-active:text-primary-foreground tw:group-data-[variant=line]/tabs-list:data-active:text-primary tw:group-data-[variant=line]/tabs-list:after:bg-primary',
      secondary:
        'tw:focus-visible:ring-secondary/25 tw:data-active:bg-secondary tw:data-active:text-secondary-foreground tw:group-data-[variant=line]/tabs-list:data-active:text-secondary-active tw:group-data-[variant=line]/tabs-list:after:bg-secondary',
      info: 'tw:focus-visible:ring-info/25 tw:data-active:bg-info tw:data-active:text-info-foreground tw:group-data-[variant=line]/tabs-list:data-active:text-info tw:group-data-[variant=line]/tabs-list:after:bg-info',
      success:
        'tw:focus-visible:ring-success/25 tw:data-active:bg-success tw:data-active:text-success-foreground tw:group-data-[variant=line]/tabs-list:data-active:text-success tw:group-data-[variant=line]/tabs-list:after:bg-success',
      warning:
        'tw:focus-visible:ring-warning/25 tw:data-active:bg-warning tw:data-active:text-warning-foreground tw:group-data-[variant=line]/tabs-list:data-active:text-warning-active tw:group-data-[variant=line]/tabs-list:after:bg-warning',
      error:
        'tw:focus-visible:ring-error/25 tw:data-active:bg-error tw:data-active:text-error-foreground tw:group-data-[variant=line]/tabs-list:data-active:text-error tw:group-data-[variant=line]/tabs-list:after:bg-error',
    },
  },
  defaultVariants: { color: 'primary', size: 'md' },
});

type TabsStyleProps = {
  color?: NonNullable<VariantProps<typeof tabsTriggerVariants>['color']>;
  size?: NonNullable<VariantProps<typeof tabsTriggerVariants>['size']>;
};

const TabsContext = React.createContext<Required<TabsStyleProps>>({ color: 'primary', size: 'md' });

type TabsProps = TabsPrimitive.Root.Props & TabsStyleProps;

function Tabs({
  className,
  orientation = 'horizontal',
  color = 'primary',
  size = 'md',
  children,
  ...props
}: TabsProps) {
  return (
    <TabsPrimitive.Root
      {...props}
      data-slot="tabs"
      data-orientation={orientation}
      data-color={color}
      data-size={size}
      orientation={orientation}
      className={cn(
        'tw:group/tabs tw:grid tw:grid-cols-1 tw:grid-rows-[auto_minmax(0,1fr)] tw:gap-2',
        'tw:data-[orientation=vertical]:grid-cols-[auto_minmax(0,1fr)] tw:data-[orientation=vertical]:grid-rows-1',
        className,
      )}
    >
      <TabsContext.Provider value={{ color, size }}>{children}</TabsContext.Provider>
    </TabsPrimitive.Root>
  );
}

type TabsListProps = TabsPrimitive.List.Props &
  Pick<VariantProps<typeof tabsListVariants>, 'variant'>;
function TabsList({ className, variant = 'default', ...props }: TabsListProps) {
  const { size } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.List
      {...props}
      data-slot="tabs-list"
      data-size={size}
      data-variant={variant}
      className={cn(
        'tw:col-start-1 tw:row-start-1',
        tabsListVariants({ size, variant }),
        className,
      )}
    />
  );
}

type TabsTriggerProps = TabsPrimitive.Tab.Props;
function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  const { color, size } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.Tab
      {...props}
      data-slot="tabs-trigger"
      data-color={color}
      data-size={size}
      className={cn(tabsTriggerVariants({ color, size }), className)}
    />
  );
}

type TabsContentProps = TabsPrimitive.Panel.Props;
function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Panel
      {...props}
      data-slot="tabs-content"
      className={cn(
        'tw:col-start-1 tw:row-start-2 tw:flex-1 tw:outline-none',
        'tw:transition-[transform,opacity] tw:duration-200 tw:ease-out',
        'tw:group-data-[orientation=vertical]/tabs:col-start-2 tw:group-data-[orientation=vertical]/tabs:row-start-1',
        'tw:data-[starting-style]:opacity-0 tw:data-[activation-direction=left]:data-[starting-style]:-translate-x-2',
        'tw:data-[activation-direction=right]:data-[starting-style]:translate-x-2',
        'tw:data-[activation-direction=up]:data-[starting-style]:-translate-y-2',
        'tw:data-[activation-direction=down]:data-[starting-style]:translate-y-2',
        'tw:data-[ending-style]:opacity-0 tw:data-[activation-direction=left]:data-[ending-style]:translate-x-2',
        'tw:data-[activation-direction=right]:data-[ending-style]:-translate-x-2',
        'tw:data-[activation-direction=up]:data-[ending-style]:translate-y-2',
        'tw:data-[activation-direction=down]:data-[ending-style]:-translate-y-2',
        'tw:motion-reduce:transition-none',
        className,
      )}
    />
  );
}

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabsListVariants,
  tabsTriggerVariants,
  type TabsContentProps,
  type TabsListProps,
  type TabsProps,
  type TabsTriggerProps,
};
