import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminLayoutShellView } from '@/components/layouts/admin/admin-layout-shell';
import { routePaths } from '@/configs/route.path';

import { SubCategoriesHeaderActions } from './sub-categories-header-actions';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));

afterEach(() => {
  cleanup();
  refresh.mockClear();
});

describe('SubCategoriesHeaderActions', () => {
  it('keeps add-new and reload visible through the inclusive order limit', async () => {
    render(
      <DirectionProvider direction="rtl">
        <AdminLayoutShellView pathname={routePaths.adminSubCategories}>
          <SubCategoriesHeaderActions categories={[]} />
        </AdminLayoutShellView>
      </DirectionProvider>,
    );

    expect(await screen.findByRole('button', { name: 'افزودن زیر دسته‌بندی' })).toBeTruthy();
    const reload = screen.getByRole('button', { name: 'بارگذاری مجدد' });
    expect(screen.queryByRole('button', { name: 'More header actions' })).toBeNull();
    fireEvent.click(reload);
    expect(refresh).toHaveBeenCalledOnce();
  });
});
