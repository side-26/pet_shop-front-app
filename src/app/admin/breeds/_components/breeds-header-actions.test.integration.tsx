import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminLayoutShellView } from '@/components/layouts/admin/admin-layout-shell';
import { routePaths } from '@/configs/route.path';

import { BreedsHeaderActions } from './breeds-header-actions';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh }) }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('BreedsHeaderActions', () => {
  it('registers add and filter visibly and places reload after lastVisibleOrder 2', async () => {
    render(
      <DirectionProvider direction="rtl">
        <AdminLayoutShellView pathname={routePaths.adminBreeds}>
          <BreedsHeaderActions
            initialValues={{ search: 'گلدن', includeDisabled: false }}
            petTypes={[{ value: '507f1f77bcf86cd799439011', label: 'سگ' }]}
          />
        </AdminLayoutShellView>
      </DirectionProvider>,
    );

    expect(await screen.findByRole('button', { name: 'افزودن نژاد' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Filter' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'بارگذاری مجدد' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'More header actions' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'بارگذاری مجدد' }));
    expect(refresh).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
    expect(await screen.findByRole('dialog', { name: 'فیلتر نژادها' })).toBeTruthy();
    expect(screen.getByLabelText('جست‌وجو').getAttribute('value')).toBe('گلدن');
    expect(screen.getByRole('combobox', { name: 'وضعیت' }).textContent).toContain('فقط فعال');
  });
});
