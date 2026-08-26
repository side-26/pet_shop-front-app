import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { AdminLayoutShellView } from './admin-layout-shell';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('AdminLayoutShell', () => {
  it('renders the RTL admin landmarks, canonical navigation, and page slot', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <AdminLayoutShellView pathname={routePaths.admin}>
        <h1>گزارش امروز</h1>
      </AdminLayoutShellView>,
    );

    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('main').textContent).toContain('گزارش امروز');
    expect(screen.getByRole('navigation', { name: 'ناوبری مدیریت' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'داشبورد' }).getAttribute('href')).toBe(
      routePaths.admin,
    );
    expect(screen.getByRole('link', { name: 'محصولات' }).getAttribute('href')).toBe(
      routePaths.adminPage('products'),
    );
    expect(screen.getByRole('link', { name: 'محصولات' }).className).toContain('tw:text-foreground');
    const activeLink = screen.getByRole('link', { name: 'داشبورد' });
    expect(activeLink.getAttribute('aria-current')).toBe('page');
    expect(activeLink.className).toContain('tw:text-primary-foreground');
    expect(activeLink.className).toContain('tw:h-10');
    expect(screen.getByRole('link', { name: 'محصولات' }).className).toContain('tw:h-10');
    expect(document.querySelector('[data-slot="admin-header-card"]')?.className).toContain(
      'tw:h-16',
    );
    expect(screen.getByRole('heading', { level: 1, name: 'داشبورد' })).toBeTruthy();
    expect(screen.queryByText('خوش آمدید، مدیر ارشد')).toBeNull();
    const navigationToggle = screen.getByRole('button', { name: 'جمع کردن نوار مدیریت' });
    expect(navigationToggle.getAttribute('data-variant')).toBe('flat');
    expect(navigationToggle.getAttribute('data-size')).toBe('sm');
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('toggles the persistent navigation between full and mini modes', () => {
    const { container } = render(
      <AdminLayoutShellView pathname={routePaths.admin}>داشبورد</AdminLayoutShellView>,
    );

    const aside = container.querySelector('aside');
    expect(aside?.getAttribute('data-collapsed')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'جمع کردن نوار مدیریت' }));

    expect(aside?.getAttribute('data-collapsed')).toBe('true');
    expect(screen.getByRole('link', { name: 'محصولات' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'باز کردن نوار مدیریت' })).toBeTruthy();
  });
});
