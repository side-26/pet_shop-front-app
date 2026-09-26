import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from '@/components/common/confirm-dialog/main';
import { deleteProfileAddressAction } from '@/entities/profile/profile.actions';
import { useCommonStore } from '@/stores/common.store';

import { ProfileAddressCardActions } from './profile-address-card-actions';

vi.mock('@/entities/profile/profile.actions', () => ({ deleteProfileAddressAction: vi.fn() }));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const deleteProfileAddressActionMock = vi.mocked(deleteProfileAddressAction);

afterEach(() => {
  cleanup();
  act(() => useCommonStore.getState().hideConfirmDialog());
  vi.clearAllMocks();
});

describe('ProfileAddressCardActions', () => {
  it('confirms and deletes the related address through the profile action', async () => {
    deleteProfileAddressActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: undefined,
    } as never);

    render(
      <>
        <ProfileAddressCardActions
          addressId="507f1f77bcf86cd799439011"
          addressTitle="تهران، تهران"
        />
        <ConfirmDialog />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'حذف نشانی' }));

    expect(
      (await screen.findByRole('alertdialog', { name: 'نشانی حذف شود؟' })).getAttribute(
        'data-size',
      ),
    ).toBe('sm');
    fireEvent.click(screen.getByRole('button', { name: 'تأیید' }));

    await waitFor(() =>
      expect(deleteProfileAddressActionMock).toHaveBeenCalledWith({
        addressId: '507f1f77bcf86cd799439011',
      }),
    );
  });
});
