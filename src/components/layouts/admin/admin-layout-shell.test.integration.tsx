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
      <AdminLayoutShellView pathname={routePaths.adminProducts}>
        محتوای محصولات
      </AdminLayoutShellView>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'محصولات' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'محصولات' }).getAttribute('aria-current')).toBe('page');
  });

  it('renders configured header actions by order and moves later actions into overflow', async () => {
    const addNewItem = vi.fn();
    const filter = vi.fn();
    const reload = vi.fn();
    const exportItems = vi.fn();

    render(
      <AdminLayoutShellView
        pathname={routePaths.adminProducts}
        entityName="محصول"
        headerActions={{
          lastVisibleOrder: 2,
          filter: { order: 3, action: filter },
          reload: { order: 2, action: reload },
          'add-new-item': { order: 1, action: addNewItem },
          export: {
            order: 4,
            name: 'Export products',
            icon: <span aria-hidden="true">E</span>,
            action: exportItems,
          },
        }}
      >
        Products
      </AdminLayoutShellView>,
    );

    const addButton = screen.getByRole('button', { name: 'افزودن محصول' });
    const reloadButton = screen.getByRole('button', { name: 'بارگذاری مجدد' });
    expect(document.querySelector('[data-slot="admin-header-actions"]')?.className).toContain(
      'tw:flex-row-reverse',
    );
    expect(addButton.compareDocumentPosition(reloadButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.queryByRole('button', { name: 'Filter' })).toBeNull();

    fireEvent.click(addButton);
    fireEvent.click(screen.getByRole('button', { name: 'More header actions' }));

    const filterMenuItem = await screen.findByRole('menuitem', { name: 'Filter' });
    const exportMenuItem = screen.getByRole('menuitem', { name: 'Export products' });
    expect(
      filterMenuItem.compareDocumentPosition(exportMenuItem) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    fireEvent.click(filterMenuItem);
    expect(addNewItem).toHaveBeenCalledOnce();
    expect(filter).toHaveBeenCalledOnce();
    expect(reload).not.toHaveBeenCalled();
    expect(exportItems).not.toHaveBeenCalled();
  });

  it('does not render header controls when no related actions exist', () => {
    const { container } = render(
      <AdminLayoutShellView pathname={routePaths.admin} headerActions={{ lastVisibleOrder: 2 }}>
        Dashboard
      </AdminLayoutShellView>,
    );

    expect(container.querySelector('[data-slot="admin-header-actions"]')).toBeNull();
  });

  it('renders a visible filter as an icon-only tooltip trigger', () => {
    const filter = vi.fn();

    render(
      <AdminLayoutShellView
        pathname={routePaths.admin}
        headerActions={{ lastVisibleOrder: 1, filter: { order: 1, action: filter } }}
      >
        Dashboard
      </AdminLayoutShellView>,
    );

    const filterButton = screen.getByRole('button', { name: 'Filter' });
    expect(filterButton.getAttribute('data-icon-only')).toBe('true');
    expect(filterButton.getAttribute('data-slot')).toBe('tooltip-trigger');

    fireEvent.click(filterButton);
    expect(filter).toHaveBeenCalledOnce();
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
    expect(adminNavigationItems.find(({ label }) => label === 'نوع حیوان')?.href).toBe(
      routePaths.adminPetTypes,
    );
    expect(adminNavigationItems.find(({ label }) => label === 'نژاد')?.href).toBe(
      routePaths.adminBreeds,
    );
    expect(adminNavigationItems.find(({ label }) => label === 'دسته‌بندی')?.href).toBe(
      routePaths.adminCategories,
    );
    expect(adminNavigationItems.find(({ label }) => label === 'زیردسته‌بندی')?.href).toBe(
      routePaths.adminSubCategories,
    );
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
