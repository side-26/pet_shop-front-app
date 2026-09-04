import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AdminProfilePageContentRenderer } from './_components/admin-profile-page-content-renderer';
import { adminProfileSkeletonData } from './_components/admin-profile-skeleton-data';

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
});
