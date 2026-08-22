'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
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
  variant?: 'segmented' | 'icon';
}>;

function ThemeToggle({ variant = 'segmented' }: ThemeToggleProps) {
  const theme = useSyncExternalStore<ThemePreference>(
    subscribeToTheme,
    getThemeSnapshot,
    () => 'system',
  );
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const syncTheme = () => {
      const nextIsDark = theme === 'dark' || (theme === 'system' && colorScheme.matches);
      applyTheme(theme, colorScheme.matches);
      setIsDark(nextIsDark);
    };

    syncTheme();

    if (theme === 'system') colorScheme.addEventListener('change', syncTheme);
    return () => colorScheme.removeEventListener('change', syncTheme);
  }, [theme]);

  if (variant === 'icon') {
    const Icon = isDark ? Sun : Moon;
    const label = isDark ? 'فعال‌سازی حالت روشن' : 'فعال‌سازی حالت تیره';

    return (
      <Button
        type="button"
        size="lg"
        variant="flat"
        color="primary"
        iconOnly
        aria-label={label}
        title={label}
        onClick={() => setThemePreference(isDark ? 'light' : 'dark')}
      >
        <Icon aria-hidden="true" />
      </Button>
    );
  }

  return (
    <div className="tw:flex tw:flex-col tw:gap-2" aria-label="انتخاب حالت نمایش">
      <span className="tw:text-label-s tw:text-muted-foreground">حالت نمایش</span>
      <ButtonGroup aria-label="حالت نمایش">
        {themeOptions.map(({ value, label, icon: Icon }) => {
          const isActive = theme === value;

          return (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={isActive ? 'fill' : 'outlined'}
              color="primary"
              aria-pressed={isActive}
              onClick={() => setThemePreference(value)}
            >
              <Icon aria-hidden="true" />
              {label}
            </Button>
          );
        })}
      </ButtonGroup>
    </div>
  );
}

export { ThemeToggle, type ThemeToggleProps };
