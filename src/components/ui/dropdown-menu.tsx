'use client';

import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';

import { cn } from '@/lib/utils';
import { ChevronRightIcon, CheckIcon } from 'lucide-react';

function DropdownMenu({
  modal = false,
  actionsRef,
  onOpenChange,
  onOpenChangeComplete,
  ...props
}: MenuPrimitive.Root.Props) {
  const fallbackActionsRef = React.useRef<MenuPrimitive.Root.Actions>(null);
  const menuActionsRef = actionsRef ?? fallbackActionsRef;
  const [scrollDismissArmed, setScrollDismissArmed] = React.useState(false);
  const armFrameRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (armFrameRef.current !== null) cancelAnimationFrame(armFrameRef.current);
    },
    [],
  );

  React.useEffect(() => {
    if (!scrollDismissArmed) return;
    const closeOnScroll = () => menuActionsRef.current?.close();
    document.addEventListener('scroll', closeOnScroll, { capture: true, passive: true });
    return () => document.removeEventListener('scroll', closeOnScroll, { capture: true });
  }, [menuActionsRef, scrollDismissArmed]);

  return (
    <MenuPrimitive.Root
      data-slot="dropdown-menu"
      modal={modal}
      actionsRef={menuActionsRef}
      onOpenChange={(open, details) => {
        if (armFrameRef.current !== null) cancelAnimationFrame(armFrameRef.current);
        if (open) {
          armFrameRef.current = requestAnimationFrame(() => setScrollDismissArmed(true));
        } else {
          setScrollDismissArmed(false);
        }
        onOpenChange?.(open, details);
      }}
      onOpenChangeComplete={(open) => {
        onOpenChangeComplete?.(open);
      }}
      {...props}
    />
  );
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="tw:isolate tw:z-50 tw:outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'tw:z-50 tw:max-h-(--available-height) tw:w-(--anchor-width) tw:min-w-48 tw:origin-(--transform-origin) tw:overflow-x-hidden tw:overflow-y-auto tw:rounded-3xl tw:border tw:border-border/60 tw:bg-popover/92 tw:p-1.5 tw:text-popover-foreground tw:shadow-lg tw:supports-backdrop-filter:backdrop-blur-2xl tw:duration-100 tw:outline-none tw:data-[side=bottom]:slide-in-from-top-2 tw:data-[side=inline-end]:slide-in-from-start-2 tw:data-[side=inline-start]:slide-in-from-end-2 tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 tw:data-[side=top]:slide-in-from-bottom-2 tw:data-open:animate-in tw:data-open:fade-in-0 tw:data-open:zoom-in-95 tw:data-closed:animate-out tw:data-closed:overflow-hidden tw:data-closed:fade-out-0 tw:data-closed:zoom-out-95 tw:motion-reduce:animate-none',
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'tw:px-3 tw:py-2.5 tw:text-xs tw:text-muted-foreground tw:data-inset:ps-9.5',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'tw:group/dropdown-menu-item tw:relative tw:flex tw:cursor-default tw:items-center tw:gap-2.5 tw:rounded-2xl tw:px-3 tw:py-2 tw:text-sm tw:font-medium tw:outline-hidden tw:select-none tw:focus:bg-primary-muted tw:focus:text-primary-muted-foreground tw:data-inset:ps-9.5 tw:data-[variant=destructive]:text-error tw:data-[variant=destructive]:focus:bg-error-muted tw:data-[variant=destructive]:focus:text-error-muted-foreground tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'tw:flex tw:cursor-default tw:items-center tw:gap-2 tw:rounded-2xl tw:px-3 tw:py-2 tw:text-sm tw:font-medium tw:outline-hidden tw:select-none tw:focus:bg-accent tw:focus:text-accent-foreground tw:not-data-[variant=destructive]:focus:**:text-accent-foreground tw:data-inset:ps-9.5 tw:data-popup-open:bg-accent tw:data-popup-open:text-accent-foreground tw:data-open:bg-accent tw:data-open:text-accent-foreground tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="tw:ms-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'inline-end',
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn('tw:w-auto tw:min-w-36', className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        'tw:relative tw:flex tw:cursor-default tw:items-center tw:gap-2.5 tw:rounded-2xl tw:py-2 tw:pe-8 tw:ps-3 tw:text-sm tw:font-medium tw:outline-hidden tw:select-none tw:focus:bg-accent tw:focus:text-accent-foreground tw:focus:**:text-accent-foreground tw:data-inset:ps-9.5 tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4',
        className,
      )}
      checked={checked}
      {...props}
    >
      <span
        className="tw:pointer-events-none tw:absolute tw:end-2 tw:flex tw:items-center tw:justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        'tw:relative tw:flex tw:cursor-default tw:items-center tw:gap-2.5 tw:rounded-2xl tw:py-2 tw:pe-8 tw:ps-3 tw:text-sm tw:font-medium tw:outline-hidden tw:select-none tw:focus:bg-accent tw:focus:text-accent-foreground tw:focus:**:text-accent-foreground tw:data-inset:ps-9.5 tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4',
        className,
      )}
      {...props}
    >
      <span
        className="tw:pointer-events-none tw:absolute tw:end-2 tw:flex tw:items-center tw:justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('tw:-mx-1.5 tw:my-1.5 tw:h-px tw:bg-border/50', className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'tw:ms-auto tw:text-xs tw:tracking-widest tw:text-muted-foreground tw:group-focus/dropdown-menu-item:text-accent-foreground',
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
