import { DirectionProvider } from '@base-ui/react/direction-provider';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DashboardContentContainer } from './_components/dashboard-content-container';
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
    expect(screen.getByRole('heading', { name: 'سفارش‌های اخیر' })).toBeTruthy();
    const region = container.querySelector('section');
    expect(region?.getAttribute('aria-busy')).toBe('true');
    expect(region?.className).toContain('skeleton');
    expect(region?.className).toContain('tw:pointer-events-none');
  });

  it('normalizes a failed dashboard request into an accessible error state', async () => {
    const content = await DashboardContentContainer({
      dashboardMetricsPromise: Promise.resolve({
        isSuccess: false,
        message: 'دسترسی به آمار امکان‌پذیر نیست.',
        data: { messages: {}, details: {} },
      }) as ReturnType<
        typeof import('@/entities/dashboard/dashboard.actions').getDashboardMetricsAction
      >,
    });
    render(<DirectionProvider direction="rtl">{content}</DirectionProvider>);

    expect(screen.getByText('دریافت آمار داشبورد انجام نشد')).toBeTruthy();
    expect(screen.getByText('دسترسی به آمار امکان‌پذیر نیست.')).toBeTruthy();
  });
});
