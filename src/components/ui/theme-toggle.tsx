'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const themeOptions = [
  { value: 'light', label: 'روشن', icon: Sun },
  { value: 'dark', label: 'تیره', icon: Moon },
  { value: 'system', label: 'سیستم', icon: Monitor },
] as const;

function subscribeToHydration() {
  return () => undefined;
}

type ThemeToggleProps = Readonly<{
  variant?: 'dropdown' | 'icon';
}>;

function ThemeToggle({ variant = 'dropdown' }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [isOpen, setIsOpen] = useState(false);

  const selectedTheme = isHydrated ? theme : 'system';
  const activeTheme = themeOptions.find(({ value }) => value === selectedTheme) ?? themeOptions[2];
  const ActiveThemeIcon = activeTheme.icon;
  const isIconOnly = variant === 'icon';
  const triggerLabel = `تغییر حالت نمایش: ${activeTheme.label}`;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            size="sm"
            variant="flat"
            color="secondary"
            block={!isIconOnly}
            iconOnly={isIconOnly}
            aria-label={isIconOnly ? triggerLabel : undefined}
            title={isIconOnly ? triggerLabel : undefined}
            className={isIconOnly ? 'tw:shrink-0' : undefined}
          />
        }
      >
        <ActiveThemeIcon data-icon="inline-start" aria-hidden="true" />
        {isIconOnly ? null : <>حالت نمایش: {activeTheme.label}</>}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side={isIconOnly ? 'bottom' : 'top'}
        className="tw:min-w-36"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>حالت نمایش</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selectedTheme}
            onValueChange={(value) => {
              setTheme(value);
              setIsOpen(false);
            }}
          >
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem key={value} value={value}>
                <Icon aria-hidden="true" />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ThemeToggle, type ThemeToggleProps };
