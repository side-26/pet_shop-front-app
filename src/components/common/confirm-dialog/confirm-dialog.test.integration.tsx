import { AlertTriangle } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

import { useCommonStore } from '@/stores/common.store';

import { ConfirmDialog } from './main';

afterEach(() => {
  cleanup();
  act(() => {
    useCommonStore.getState().hideConfirmDialog();
  });
  vi.restoreAllMocks();
});

describe('ConfirmDialog', () => {
  it('renders the shared dialog content when the store opens it', async () => {
    render(<ConfirmDialog />);

    act(() => {
      useCommonStore.getState().showConfirmDialog({
        title: 'سفارش لغو شود؟',
        message: 'این عملیات قابل بازگشت نیست.',
        icon: AlertTriangle,
        onSuccess: vi.fn(async () => undefined),
      });
    });

    expect(await screen.findByRole('alertdialog')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'سفارش لغو شود؟' })).toBeTruthy();
    expect(screen.getByText('این عملیات قابل بازگشت نیست.')).toBeTruthy();
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'تأیید',
      'انصراف',
    ]);
  });

  it('disables ignore while the accept action is pending and closes after it completes', async () => {
    let resolveSuccess: (() => void) | undefined;
    const onSuccess = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSuccess = resolve;
        }),
    );
    render(<ConfirmDialog />);

    act(() => {
      useCommonStore.getState().showConfirmDialog({
        title: 'تغییر ذخیره شود؟',
        message: 'تغییرات برای همهٔ کاربران اعمال می‌شود.',
        icon: AlertTriangle,
        onSuccess,
      });
    });

    const acceptButton = await screen.findByRole('button', { name: 'تأیید' });
    fireEvent.click(acceptButton);

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'انصراف' })).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'در حال انجام…' }).getAttribute('aria-busy')).toBe(
      'true',
    );

    await act(async () => {
      resolveSuccess?.();
    });

    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('keeps the dialog open when Escape is pressed', async () => {
    render(<ConfirmDialog />);

    act(() => {
      useCommonStore.getState().showConfirmDialog({
        title: 'تأیید حذف',
        message: 'آیا ادامه می‌دهید؟',
        icon: AlertTriangle,
        onSuccess: vi.fn(async () => undefined),
      });
    });

    const dialog = await screen.findByRole('alertdialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });

    expect(useCommonStore.getState().confirmDialog.open).toBe(true);
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });
});
