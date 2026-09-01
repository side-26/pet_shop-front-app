import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import { updatePetTypeAction } from './pet-types.actions';
import * as service from './pet-types.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./pet-types.service', () => ({ updatePetType: vi.fn() }));

const id = '507f1f77bcf86cd799439011';

function adminSession(): AuthSessionModel {
  return {
    accessExp: 1,
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    role: USER_ROLES.ADMIN,
    sessionExp: 2,
    userId: 'user-1',
  };
}

describe('updatePetTypeAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(adminSession());
  });

  it('strips an existing API image URL before validating and updating', async () => {
    const success = { isSuccess: true as const, message: 'updated', data: {} as never };
    vi.mocked(service.updatePetType).mockResolvedValue(success);

    await expect(
      updatePetTypeAction({
        id,
        title: 'سگ',
        description: 'حیوان خانگی',
        mainImage: 'https://cdn.example.test/pet-types/dog.webp',
      }),
    ).resolves.toBe(success);

    expect(service.updatePetType).toHaveBeenCalledWith(id, {
      title: 'سگ',
      description: 'حیوان خانگی',
    });
  });
});
