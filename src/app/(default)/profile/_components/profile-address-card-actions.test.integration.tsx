import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from '@/components/common/confirm-dialog/main';
import { deleteProfileAddressAction } from '@/entities/profile/profile.actions';
import { useCommonStore } from '@/stores/common.store';

import { ProfileAddressCardActions } from './profile-address-card-actions';
import { ProfileAddressDialogsProvider } from './profile-address-dialogs-provider';

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

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileAddressDialogsProvider>
          <ProfileAddressCardActions
            addressId="507f1f77bcf86cd799439011"
            addressTitle="تهران، تهران"
          />
        </ProfileAddressDialogsProvider>
        <ConfirmDialog />
      </QueryClientProvider>,
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
