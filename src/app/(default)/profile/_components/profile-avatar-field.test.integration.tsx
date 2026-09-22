import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';

import { ProfileAvatarField } from './profile-avatar-field';

const createObjectUrl = vi.fn(() => 'blob:profile-avatar');
const revokeObjectUrl = vi.fn();

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
    const addToast = vi.spyOn(toast, 'add');
    render(<ProfileAvatarField />);

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
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'تصویر پروفایل ذخیره شد', type: 'success' }),
      ),
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
