import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { USER_ROLES } from '@/configs/user-role';
import { submitCurrentUserProfile } from '@/entities/users/users.client';

vi.mock('@/hooks/use-router', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/users/users.client', () => ({ submitCurrentUserProfile: vi.fn() }));

import { AdminProfilePageContentRenderer } from './_components/admin-profile-page-content-renderer';
import { adminProfileSkeletonData } from './_components/admin-profile-skeleton-data';

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

describe('/admin/profile content renderer', () => {
  it('renders both account-management cards in a non-interactive accessible skeleton state', () => {
    const { container } = render(
      <AdminProfilePageContentRenderer user={adminProfileSkeletonData} isSkeleton />,
    );

    expect(screen.getByRole('heading', { name: 'پروفایل' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'اطلاعات شخصی' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'تغییر کلمه عبور' })).toBeTruthy();
    const region = container.querySelector('section');
    expect(region?.getAttribute('aria-busy')).toBe('true');
    expect(region?.className).toContain('skeleton');
    expect(screen.getByRole('button', { name: 'ذخیره اطلاعات' }).hasAttribute('disabled')).toBe(
      true,
    );
    expect(screen.getByRole('button', { name: 'تغییر کلمه عبور' }).hasAttribute('disabled')).toBe(
      true,
    );
  });

  it.each([USER_ROLES.ADMIN, USER_ROLES.SELLER])(
    'prefills every validated main-information field for a %s profile',
    (role) => {
      render(<AdminProfilePageContentRenderer user={{ ...adminProfileSkeletonData, role }} />);

      expect(screen.getByRole('textbox', { name: 'نام' })).toHaveProperty('value', 'کاربر');
      expect(screen.getByRole('textbox', { name: 'نام خانوادگی' })).toHaveProperty(
        'value',
        'مدیریت',
      );
      expect(screen.getByRole('textbox', { name: 'ایمیل' })).toHaveProperty('value', '');
      expect(screen.getByRole('textbox', { name: 'کد ملی' })).toHaveProperty('value', '');
      expect(screen.getByRole('spinbutton', { name: 'سن' })).toHaveProperty('value', '');
      expect(screen.getByRole('button', { name: 'تاریخ تولد' })).toBeTruthy();
      expect(screen.getByLabelText('کلمه عبور فعلی')).toBeTruthy();
      expect(screen.getByLabelText('کلمه عبور جدید')).toBeTruthy();
      expect(screen.getByLabelText('تکرار کلمه عبور جدید')).toBeTruthy();
    },
  );

  it('blocks submission with schema errors, then submits the validated main-information payload', async () => {
    vi.mocked(submitCurrentUserProfile).mockResolvedValue(true);
    render(<AdminProfilePageContentRenderer user={adminProfileSkeletonData} />);

    fireEvent.change(screen.getByRole('textbox', { name: 'ایمیل' }), {
      target: { value: 'not-an-email' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'کد ملی' }), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'سن' }), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'ذخیره اطلاعات' }));

    expect(await screen.findByText('ایمیل معتبر نیست.')).toBeTruthy();
    expect(screen.getByText('کد ملی قالب معتبری ندارد.')).toBeTruthy();
    expect(screen.getByRole('spinbutton', { name: 'سن' }).getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(screen.getAllByRole('alert')).toHaveLength(3);
    expect(submitCurrentUserProfile).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole('textbox', { name: 'ایمیل' }), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'کد ملی' }), {
      target: { value: '0012345678' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'سن' }), { target: { value: '29' } });
    fireEvent.click(screen.getByRole('button', { name: 'ذخیره اطلاعات' }));

    await waitFor(() =>
      expect(submitCurrentUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'کاربر',
          lastName: 'مدیریت',
          email: 'admin@example.com',
          nationalCode: '0012345678',
          age: 29,
        }),
        expect.any(Function),
      ),
    );
  });
});
