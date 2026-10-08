import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminLayoutShellView } from '@/components/layouts/admin/admin-layout-shell';
import { routePaths } from '@/configs/route.path';

import { ArticlesHeaderActions } from './articles-header-actions';

const refresh = vi.fn();

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh }) }));

afterEach(() => {
  cleanup();
  refresh.mockClear();
});

describe('ArticlesHeaderActions', () => {
  it('registers visible add and reload controls', async () => {
    render(
      <DirectionProvider direction="rtl">
        <AdminLayoutShellView pathname={routePaths.adminArticles} entityName="مقاله">
          <ArticlesHeaderActions />
        </AdminLayoutShellView>
      </DirectionProvider>,
    );

    const addButton = await screen.findByRole('button', { name: 'افزودن مقاله' });
    expect(addButton).toBeTruthy();
    fireEvent.click(addButton);
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByText('ایجاد مقاله جدید')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    fireEvent.click(screen.getByRole('button', { name: 'بارگذاری مجدد' }));
    expect(refresh).toHaveBeenCalledOnce();
  });
});
