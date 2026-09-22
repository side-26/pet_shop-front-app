import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { submitCurrentUserProfile } from '@/entities/users/users.client';

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/profile/profile.actions', () => ({ deleteProfileAvatarAction: vi.fn() }));
vi.mock('@/entities/users/users.client', () => ({ submitCurrentUserProfile: vi.fn() }));

import { ProfileAvatarField } from './profile-avatar-field';

const createObjectUrl = vi.fn(() => 'blob:profile-avatar');
const revokeObjectUrl = vi.fn();
const user = {
  userId: 'user-1',
  firstName: 'نیلوفر',
  lastName: 'احمدی',
  phoneNumber: '09123456789',
  email: 'niloofar@example.com',
  avatar: '',
  nationalCode: '0012345678',
  age: 31,
  birthDate: '1995-09-09T00:00:00.000Z',
};

beforeEach(() => {
  vi.stubGlobal('URL', { createObjectURL: createObjectUrl, revokeObjectURL: revokeObjectUrl });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('ProfileAvatarField', () => {
  it('lets the user select, replace, and remove an avatar image', async () => {
    vi.mocked(submitCurrentUserProfile).mockResolvedValue(true);
    render(<ProfileAvatarField user={user} />);

    const fileInput = screen.getByLabelText('انتخاب تصویر پروفایل');
    expect(fileInput.getAttribute('accept')).toBe('image/jpeg,image/png,image/webp');
    expect(screen.getByRole('button', { name: 'ویرایش تصویر پروفایل' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'حذف تصویر پروفایل' }).hasAttribute('disabled')).toBe(
      true,
    );
    expect(screen.getByRole('button', { name: 'ذخیره تصویر' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('JPEG, PNG, WebP')).toBeTruthy();

    fireEvent.change(fileInput, {
      target: { files: [new File(['avatar'], 'avatar.png', { type: 'image/png' })] },
    });

    expect(screen.getByRole('button', { name: 'حذف تصویر پروفایل' }).hasAttribute('disabled')).toBe(
      false,
    );
    expect(screen.getByRole('button', { name: 'ذخیره تصویر' }).hasAttribute('disabled')).toBe(
      false,
    );
    await waitFor(() => expect(createObjectUrl).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: 'ذخیره تصویر' }));

    await waitFor(() =>
      expect(submitCurrentUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          nationalCode: user.nationalCode,
          age: user.age,
        }),
        expect.any(Function),
      ),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'حذف تصویر پروفایل' }).hasAttribute('disabled'),
      ).toBe(false),
    );

    fireEvent.click(screen.getByRole('button', { name: 'حذف تصویر پروفایل' }));

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'حذف تصویر پروفایل' }).hasAttribute('disabled'),
      ).toBe(true),
    );
    expect(screen.getByRole('button', { name: 'ذخیره تصویر' }).hasAttribute('disabled')).toBe(true);
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:profile-avatar');
  });
});
