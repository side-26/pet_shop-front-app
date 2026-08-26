import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { LogoutSuccessMessage } from './logout-success-message';

vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));

const toastAddMock = vi.mocked(toast.add);

describe('LogoutSuccessMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState(null, '', '/login?logout=success');
  });

  it('shows the logout success message once and removes the query marker', async () => {
    await act(async () => {
      render(<LogoutSuccessMessage />);
    });

    expect(toastAddMock).toHaveBeenCalledWith({
      type: 'success',
      title: 'با موفقیت از حساب کاربری خارج شدید.',
    });
    expect(window.location.pathname).toBe('/login');
    expect(window.location.search).toBe('');
  });
});
