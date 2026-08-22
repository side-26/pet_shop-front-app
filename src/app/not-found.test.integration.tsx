import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import NotFound from './not-found';

afterEach(cleanup);

describe('Not found page', () => {
  it('explains the missing page and offers canonical recovery routes', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'انگار رد پنجه‌ها را گم کرده‌ایم!' })).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByRole('link', { name: /بازگشت به خانه/ }).getAttribute('href')).toBe(
      routePaths.home,
    );
    expect(screen.getByRole('link', { name: /دیدن حیوانات/ }).getAttribute('href')).toBe(
      routePaths.petsLanding,
    );
  });
});
