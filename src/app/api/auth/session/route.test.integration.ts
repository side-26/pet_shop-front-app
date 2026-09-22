import { describe, expect, it, vi } from 'vitest';

import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import { GET } from './route';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));

describe('GET /api/auth/session', () => {
  it('returns only the user id from the encrypted server session', async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: 'user-1',
      role: USER_ROLES.CUSTOMER,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      accessExp: 1,
      sessionExp: 2,
    });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ userId: 'user-1' });
  });

  it('returns null when no encrypted session exists', async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ userId: null });
  });
});
