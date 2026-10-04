import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCommonStore } from '@/stores/common.store';

import { usePreventPageLeave } from './use-prevent-page-leave';

afterEach(() => {
  cleanup();
  act(() => {
    useCommonStore.getState().hideConfirmDialog();
  });
});

describe('usePreventPageLeave', () => {
  it('does not block native or controlled navigation while force is disabled', async () => {
    const leave = vi.fn();
    const { result } = renderHook(() =>
      usePreventPageLeave({ force: false, message: 'تغییرات ذخیره نشده‌اند.' }),
    );
    const unload = new Event('beforeunload', { cancelable: true });

    window.dispatchEvent(unload);
    act(() => result.current.requestLeave(leave));

    expect(unload.defaultPrevented).toBe(false);
    expect(leave).toHaveBeenCalledOnce();
    expect(useCommonStore.getState().confirmDialog.open).toBe(false);
  });

  it('prevents browser unload and shows the supplied message before controlled navigation', async () => {
    const leave = vi.fn(async () => undefined);
    const { result } = renderHook(() =>
      usePreventPageLeave({
        force: true,
        title: 'تغییرات را رها می‌کنید؟',
        message: 'اطلاعات واردشده ذخیره نشده‌اند.',
      }),
    );
    const unload = new Event('beforeunload', { cancelable: true });

    window.dispatchEvent(unload);
    act(() => result.current.requestLeave(leave));

    const dialog = useCommonStore.getState().confirmDialog;
    expect(unload.defaultPrevented).toBe(true);
    expect(result.current.isPreventingLeave).toBe(true);
    expect(leave).not.toHaveBeenCalled();
    expect(dialog).toMatchObject({
      open: true,
      title: 'تغییرات را رها می‌کنید؟',
      message: 'اطلاعات واردشده ذخیره نشده‌اند.',
    });

    await act(async () => {
      await dialog.onSuccess();
    });
    expect(leave).toHaveBeenCalledOnce();
  });

  it('allows one intentional native unload while the guard is active', () => {
    const { result } = renderHook(() =>
      usePreventPageLeave({ force: true, message: 'پرداخت در حال انجام است.' }),
    );

    act(() => result.current.allowNextUnload());
    const gatewayUnload = new Event('beforeunload', { cancelable: true });
    const laterUnload = new Event('beforeunload', { cancelable: true });

    window.dispatchEvent(gatewayUnload);
    window.dispatchEvent(laterUnload);

    expect(gatewayUnload.defaultPrevented).toBe(false);
    expect(laterUnload.defaultPrevented).toBe(true);
  });
});
