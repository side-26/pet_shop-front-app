import { DirectionProvider } from '@base-ui/react/direction-provider';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DashboardContentRenderer } from './_components/dashboard-content-renderer';
import { dashboardSkeletonData } from './_components/dashboard-skeleton-data';

describe('/admin dashboard', () => {
  it('renders the shared dashboard layout in a busy, non-interactive skeleton state', () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <DashboardContentRenderer dashboard={dashboardSkeletonData} isSkeleton />
      </DirectionProvider>,
    );

    expect(screen.getByRole('heading', { name: 'داشبورد مدیریت' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'روند سفارش‌ها' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'سفارش‌های اخیر' })).toBeNull();
    const region = container.querySelector('section');
    expect(region?.getAttribute('aria-busy')).toBe('true');
    expect(region?.className).toContain('skeleton');
    expect(region?.className).toContain('tw:pointer-events-none');
  });
});
