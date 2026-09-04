import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { USER_ROLES } from '@/configs/user-role';

import { AdminCurrentUserContainer } from './admin-current-user-container';
import { AdminCurrentUserIdentity } from './admin-current-user-identity';

const currentUser = {
  userId: 'user-1',
  firstName: 'علی',
  lastName: 'رضایی',
  phoneNumber: '09123456789',
  role: USER_ROLES.ADMIN,
  avatar: '',
};

afterEach(cleanup);

describe('AdminCurrentUserIdentity', () => {
  it('renders the current user identity and Persian role label', () => {
    render(<AdminCurrentUserIdentity user={currentUser} />);

    expect(screen.getByText('علی رضایی')).toBeTruthy();
    expect(screen.getByText('مدیر')).toBeTruthy();
    expect(
      document
        .querySelector('[data-slot="admin-current-user-identity"]')
        ?.getAttribute('aria-busy'),
    ).toBeNull();
  });

  it('uses the same identity renderer as the non-interactive skeleton fallback', () => {
    render(<AdminCurrentUserIdentity user={currentUser} isSkeleton />);

    const identity = document.querySelector('[data-slot="admin-current-user-identity"]');
    expect(identity?.getAttribute('aria-busy')).toBe('true');
    expect(identity?.className).toContain('skeleton');
    expect(identity?.className).toContain('tw:pointer-events-none');
  });

  it('keeps the navigation dimensions stable with an identity fallback after a request error', async () => {
    const content = await AdminCurrentUserContainer({
      currentUserPromise: Promise.resolve({
        isSuccess: false as const,
        message: 'خطا',
        data: { messages: {}, details: {} },
      }),
    });

    render(content);

    expect(screen.getByText('کاربر مدیریت')).toBeTruthy();
    expect(screen.getByText('مدیر')).toBeTruthy();
  });
});
