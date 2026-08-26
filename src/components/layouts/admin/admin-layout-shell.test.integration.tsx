import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { adminNavigationItems } from './admin-navigation-items';
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
    expect(screen.getByRole('link', { name: 'سفارش‌ها' }).getAttribute('href')).toBe(
      routePaths.adminPage('orders'),
    );
    expect(screen.getByRole('link', { name: 'سفارش‌ها' }).className).toContain(
      'tw:text-foreground',
    );
    const activeLink = screen.getByRole('link', { name: 'داشبورد' });
    expect(activeLink.getAttribute('aria-current')).toBe('page');
    expect(activeLink.className).toContain('tw:text-primary-foreground');
    expect(activeLink.className).toContain('tw:h-10');
    expect(screen.getByRole('link', { name: 'سفارش‌ها' }).className).toContain('tw:h-10');
    expect(
      screen.getByText('تنظیمات').closest('[aria-disabled]')?.getAttribute('aria-disabled'),
    ).toBe('true');
    expect(screen.queryByRole('link', { name: 'تنظیمات' })).toBeNull();
    const header = screen.getByRole('banner');
    expect(header.className).toContain('tw:px-4');
    expect(document.querySelector('[data-slot="admin-header-card"]')?.className).toContain(
      'tw:h-16',
    );
    const main = screen.getByRole('main');
    expect(main.className).toContain('tw:px-4');
    expect(main.className).toContain('tw:pt-3');
    expect(main.className).toContain('tw:md:pt-[11px]');
    const contentCard = document.querySelector('[data-slot="admin-content-card"]');
    expect(contentCard?.className).toContain('tw:w-full');
    expect(contentCard?.className).toContain('tw:flex-1');
    expect(contentCard?.className).toContain('tw:rounded-b-none');
    expect(contentCard?.className).toContain('tw:p-[6px]');
    expect(screen.getByRole('heading', { level: 1, name: 'داشبورد' })).toBeTruthy();
    expect(document.querySelector('[data-slot="admin-page-title-icon"]')).toBeTruthy();
    expect(screen.queryByText('خوش آمدید، مدیر ارشد')).toBeNull();
    expect(screen.getByRole('button', { name: 'خروج' })).toBeTruthy();
    const navigationToggle = screen.getByRole('button', { name: 'جمع کردن نوار مدیریت' });
    expect(navigationToggle.getAttribute('data-variant')).toBe('flat');
    expect(navigationToggle.getAttribute('data-size')).toBe('sm');
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('derives the current page header from the canonical navigation item', () => {
    render(
      <AdminLayoutShellView pathname={routePaths.adminPage('products')}>
        محتوای محصولات
      </AdminLayoutShellView>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'محصولات' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'محصولات' }).getAttribute('aria-current')).toBe('page');
  });

  it('defines the requested admin navigation in one canonical list', () => {
    expect(adminNavigationItems.map(({ label }) => label)).toEqual([
      'داشبورد',
      'سفارش‌ها',
      'محصولات',
      'حیوانات',
      'دسته‌بندی',
      'زیردسته‌بندی',
      'نژاد',
      'نوع حیوان',
      'کاربران',
      'تنظیمات',
    ]);
    expect(adminNavigationItems.at(-1)).toMatchObject({ disabled: true });
  });

  it('toggles the persistent navigation between full and mini modes', () => {
    const { container } = render(
      <AdminLayoutShellView pathname={routePaths.admin}>داشبورد</AdminLayoutShellView>,
    );

    const aside = container.querySelector('aside');
    expect(aside?.getAttribute('data-collapsed')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'جمع کردن نوار مدیریت' }));

    expect(aside?.getAttribute('data-collapsed')).toBe('true');
    expect(screen.getByRole('link', { name: 'سفارش‌ها' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'باز کردن نوار مدیریت' })).toBeTruthy();
  });

  it('asks for confirmation before logging out', async () => {
    render(<AdminLayoutShellView pathname={routePaths.admin}>داشبورد</AdminLayoutShellView>);

    fireEvent.click(screen.getByRole('button', { name: 'خروج' }));

    expect(await screen.findByRole('alertdialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'از پنل خارج می‌شوید؟' })).toBeTruthy();
  });
});
