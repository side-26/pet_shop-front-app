import { AlertTriangle } from 'lucide-react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCommonStore } from './common.store';

function resetStore() {
  useCommonStore.getState().hideConfirmDialog();
}

afterEach(() => {
  resetStore();
  vi.restoreAllMocks();
});

describe('useCommonStore', () => {
  it('shows a dialog with the default size, variant, and ignore behavior', () => {
    useCommonStore.getState().showConfirmDialog({
      title: 'حذف سفارش',
      message: 'آیا از حذف این سفارش مطمئن هستید؟',
      icon: AlertTriangle,
      onSuccess: vi.fn(async () => undefined),
    });

    const state = useCommonStore.getState();
    expect(state.confirmDialog).toMatchObject({
      open: true,
      isPending: false,
      title: 'حذف سفارش',
      message: 'آیا از حذف این سفارش مطمئن هستید؟',
      icon: AlertTriangle,
      size: 'sm',
      variant: 'warning',
    });

    state.confirmDialog?.onIgnore();

    expect(useCommonStore.getState()).toMatchObject({
      confirmDialog: {
        open: false,
        isPending: false,
      },
    });
  });

  it('shows loading while success runs and hides after it settles', async () => {
    let finishSuccess: (() => void) | undefined;
    const onSuccess = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishSuccess = resolve;
        }),
    );
    useCommonStore.getState().showConfirmDialog({
      title: 'تأیید تغییر',
      message: 'تغییرات ذخیره شوند؟',
      icon: AlertTriangle,
      onSuccess,
    });

    const successPromise = useCommonStore.getState().confirmDialog.onSuccess();

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(useCommonStore.getState().confirmDialog.isPending).toBe(true);

    finishSuccess?.();
    await successPromise;

    expect(useCommonStore.getState()).toMatchObject({
      confirmDialog: {
        open: false,
        isPending: false,
      },
    });
  });

  it('updates pending state only while the dialog is open', () => {
    useCommonStore.getState().setPending(true);
    expect(useCommonStore.getState().confirmDialog.isPending).toBe(false);

    useCommonStore.getState().showConfirmDialog({
      title: 'تأیید',
      message: 'ادامه داده شود؟',
      icon: AlertTriangle,
      onSuccess: vi.fn(async () => undefined),
    });
    useCommonStore.getState().setPending(true);

    expect(useCommonStore.getState().confirmDialog.isPending).toBe(true);
  });
});
