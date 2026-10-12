import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DashboardEmptyFetch } from './dashboard-empty-fetch';

describe('DashboardEmptyFetch', () => {
  it('explains the absence of dashboard metrics', () => {
    render(<DashboardEmptyFetch />);

    expect(screen.getByText('آماری برای نمایش وجود ندارد')).toBeTruthy();
    expect(screen.getByText('با ثبت فعالیت فروشگاه، آمار این بخش نمایش داده می‌شود.')).toBeTruthy();
  });
});
