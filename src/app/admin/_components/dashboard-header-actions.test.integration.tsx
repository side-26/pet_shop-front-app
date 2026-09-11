import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminLayoutShellView } from '@/components/layouts/admin/admin-layout-shell';
import { routePaths } from '@/configs/route.path';

import { DashboardHeaderActions } from './dashboard-header-actions';

const push = vi.fn();
const refresh = vi.fn();

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ push, refresh }) }));

afterEach(() => {
  cleanup();
  push.mockClear();
  refresh.mockClear();
});

describe('DashboardHeaderActions', () => {
  it('registers the dashboard date-range filter and reload action', async () => {
    render(
      <DirectionProvider direction="rtl">
        <AdminLayoutShellView pathname={routePaths.admin}>
          <DashboardHeaderActions
            initialValues={{
              fromDate: '2026-09-01T00:00:00.000Z',
              toDate: '2026-09-07T23:59:59.000Z',
            }}
          />
        </AdminLayoutShellView>
      </DirectionProvider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Filter' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'بازه زمانی' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    fireEvent.click(screen.getByRole('button', { name: 'More header actions' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'بارگذاری مجدد' }));
    expect(refresh).toHaveBeenCalledOnce();
  });
});
