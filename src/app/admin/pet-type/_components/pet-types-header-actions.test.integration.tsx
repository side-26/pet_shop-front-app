import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminLayoutShellView } from '@/components/layouts/admin/admin-layout-shell';
import { routePaths } from '@/configs/route.path';

import { PetTypesHeaderActions } from './pet-types-header-actions';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));

afterEach(() => {
  cleanup();
  refresh.mockClear();
});

describe('PetTypesHeaderActions', () => {
  it('registers only add and reload actions without a filter control', async () => {
    render(
      <DirectionProvider direction="rtl">
        <AdminLayoutShellView pathname={routePaths.adminPetTypes}>
          <PetTypesHeaderActions />
        </AdminLayoutShellView>
      </DirectionProvider>,
    );

    expect(await screen.findByRole('button', { name: 'افزودن نوع حیوان' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Filter' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'More header actions' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'بارگذاری مجدد' }));

    expect(refresh).toHaveBeenCalledOnce();
  });
});
