import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import { deleteImageAction } from './images.actions';
import { deleteImage } from './images.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('./images.service', () => ({ deleteImage: vi.fn() }));

const imageUrl = 'https://cdn.example.test/management/images/main.webp';
const session = (role: AuthSessionModel['role']): AuthSessionModel => ({
  accessExp: 1,
  accessToken: 'token',
  refreshToken: 'refresh',
  role,
  sessionExp: 2,
  userId: 'user-1',
});

describe('image actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(session(USER_ROLES.ADMIN));
  });

  it('authorizes management users and validates deletion input', async () => {
    vi.mocked(deleteImage).mockResolvedValue({
      isSuccess: true,
      message: 'deleted',
      data: undefined,
    });

    await expect(deleteImageAction({ imageUrl, ignored: true })).resolves.toMatchObject({
      isSuccess: true,
    });
    expect(deleteImage).toHaveBeenCalledWith({ imageUrl });
  });

  it('rejects non-management users and invalid URLs before calling the service', async () => {
    vi.mocked(getSession).mockResolvedValue(session(USER_ROLES.CUSTOMER));
    await expect(deleteImageAction({ imageUrl })).resolves.toMatchObject({ isSuccess: false });

    vi.mocked(getSession).mockResolvedValue(session(USER_ROLES.SELLER));
    await expect(deleteImageAction({ imageUrl: 'not-a-url' })).resolves.toMatchObject({
      isSuccess: false,
    });
    expect(deleteImage).not.toHaveBeenCalled();
  });
});
