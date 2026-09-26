import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { ProfileHeaderRenderer } from './profile-header-renderer';

afterEach(cleanup);

const user = {
  userId: 'user-1',
  firstName: 'نیلوفر',
  lastName: 'احمدی',
  phoneNumber: '09121234567',
  email: 'niloofar@example.com',
  avatar: '',
  nationalCode: '0012345678',
  age: 31,
  birthDate: '1995-09-09T00:00:00.000Z',
};

describe('ProfileHeaderRenderer', () => {
  it('renders the customer identity independently from order summary data', () => {
    render(<ProfileHeaderRenderer user={user} />);

    expect(screen.getByRole('heading', { level: 1, name: 'نیلوفر احمدی' })).toBeTruthy();
    expect(screen.getByText('niloofar@example.com')).toBeTruthy();
    expect(screen.queryByText('سفارش‌ها')).toBeNull();
  });
});
