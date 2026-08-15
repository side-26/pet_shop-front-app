export const THEME_STORAGE_KEY = 'petshop-theme';

export const themeInitScript = `
(() => {
  const storageKey = '${THEME_STORAGE_KEY}';
  const storedTheme = localStorage.getItem(storageKey);
  const theme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system';
  const isDark = theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const root = document.documentElement;

  root.classList.toggle('dark', isDark);
  root.dataset.theme = theme;
  root.style.colorScheme = isDark ? 'dark' : 'light';
})();
`;

export type ThemePreference = 'light' | 'dark' | 'system';
