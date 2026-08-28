import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { TablePagination } from './table-pagination';

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

afterEach(() => {
  cleanup();
  push.mockClear();
});

describe('TablePagination', () => {
  it('combines the count, limit selector, and small left-aligned pagination controls', async () => {
    render(
      <DirectionProvider direction="rtl">
        <TablePagination
          basePath={routePaths.adminUsers}
          query={{ fullName: 'مریم', page: '3', limit: '20' }}
          page={3}
          pageCount={4}
          total={72}
          itemCount={20}
          itemLabel="کاربر"
          limitOptions={[20, 40, 60, 100]}
        />
      </DirectionProvider>,
    );

    expect(screen.getByText('نمایش 20 کاربر از 72')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'رفتن به صفحه قبلی' }).getAttribute('data-size')).toBe(
      'sm',
    );
    expect(screen.getByRole('navigation', { name: 'صفحه‌بندی' }).className).toContain('tw:ms-auto');

    fireEvent.click(screen.getByRole('combobox', { name: 'تعداد در هر صفحه' }));
    const option = await screen.findByRole('option', { name: '60' });
    fireEvent.pointerDown(option, { button: 0 });
    fireEvent.pointerUp(option, { button: 0 });
    fireEvent.click(option);

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        routePaths.adminUsersPage(
          1,
          new URLSearchParams('fullName=%D9%85%D8%B1%DB%8C%D9%85&page=3&limit=60'),
        ),
        { scroll: false },
      ),
    );
  });
});
