import { describe, expect, it, vi } from 'vitest';

import { getCurrentUserForSessionSync } from '@/entities/users/users.service';

import { GET } from './route';

vi.mock('@/entities/users/users.service', () => ({ getCurrentUserForSessionSync: vi.fn() }));

describe('GET /api/users/current', () => {
  it('returns the server-fetched current-user identity without exposing tokens', async () => {
    vi.mocked(getCurrentUserForSessionSync).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: {
        userId: 'user-1',
        firstName: 'نیلوفر',
        lastName: 'احمدی',
        phoneNumber: '09121234567',
        role: 'customer',
        avatar: '',
        email: 'niloofar@example.com',
        nationalCode: '0012345678',
        age: 31,
        birthDate: null,
      },
    });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      isSuccess: true,
      data: { userId: 'user-1' },
    });
  });
});
