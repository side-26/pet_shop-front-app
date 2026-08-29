import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useUserEnabledUpdate } from '@/entities/users/users.client';

import { UserEnabledSwitch } from './user-enabled-switch';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/users/users.client', () => ({ useUserEnabledUpdate: vi.fn() }));

const useUserEnabledUpdateMock = vi.mocked(useUserEnabledUpdate);

afterEach(cleanup);

describe('UserEnabledSwitch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the client mutation hook with the next enabled state', () => {
    const updateUserEnabled = vi.fn();
    useUserEnabledUpdateMock.mockReturnValue({ isPending: false, updateUserEnabled });

    render(
      <DirectionProvider direction="rtl">
        <UserEnabledSwitch userId="user-1" userName="مریم احمدی" isEnable />
      </DirectionProvider>,
    );

    fireEvent.click(screen.getByRole('switch', { name: 'مریم احمدی: فعال' }));
    expect(updateUserEnabled).toHaveBeenCalledWith('user-1', false);
  });

  it('uses the shared Switch loading contract while the mutation is pending', () => {
    useUserEnabledUpdateMock.mockReturnValue({ isPending: true, updateUserEnabled: vi.fn() });

    render(
      <DirectionProvider direction="rtl">
        <UserEnabledSwitch userId="user-1" userName="مریم احمدی" isEnable={false} />
      </DirectionProvider>,
    );

    const control = screen.getByRole('switch', { name: 'مریم احمدی: غیرفعال' });
    expect(control.getAttribute('aria-busy')).toBe('true');
    expect(control.getAttribute('aria-disabled')).toBe('true');
    expect(control.querySelector('[data-slot="spinner"]')).toBeTruthy();
  });
});
