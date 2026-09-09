'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore } from 'react';

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
import { THEME_STORAGE_KEY, type ThemePreference } from '@/components/ui/theme.helpers';

const themeOptions = [
  { value: 'light', label: 'روشن', icon: Sun },
  { value: 'dark', label: 'تیره', icon: Moon },
  { value: 'system', label: 'سیستم', icon: Monitor },
] as const;
const themeChangeEvent = 'petshop-theme-change';

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function applyTheme(theme: ThemePreference, prefersDark: boolean) {
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  const root = document.documentElement;

  root.classList.toggle('dark', isDark);
  root.dataset.theme = theme;
  root.style.colorScheme = isDark ? 'dark' : 'light';
}

function getThemeSnapshot(): ThemePreference {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemePreference(storedTheme) ? storedTheme : 'system';
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(themeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(themeChangeEvent, onStoreChange);
  };
}

function setThemePreference(theme: ThemePreference) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new Event(themeChangeEvent));
}

type ThemeToggleProps = Readonly<{
  variant?: 'dropdown' | 'icon';
}>;

function ThemeToggle({ variant = 'dropdown' }: ThemeToggleProps) {
  const theme = useSyncExternalStore<ThemePreference>(
    subscribeToTheme,
    getThemeSnapshot,
    () => 'system',
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const colorScheme = window.matchMedia?.('(prefers-color-scheme: dark)');
    const syncTheme = () => {
      const prefersDark = colorScheme?.matches ?? false;
      applyTheme(theme, prefersDark);
    };

    syncTheme();

    if (theme === 'system') colorScheme?.addEventListener('change', syncTheme);
    return () => colorScheme?.removeEventListener('change', syncTheme);
  }, [theme]);

  const activeTheme = themeOptions.find(({ value }) => value === theme) ?? themeOptions[2];
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
            value={theme}
            onValueChange={(value) => {
              setThemePreference(value as ThemePreference);
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
