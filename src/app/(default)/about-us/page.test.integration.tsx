import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import AboutUsPage, { instant } from './page';

describe('/about-us', () => {
  it('requires an instant static shell', () => {
    expect(instant).toBe(true);
  });

  it('renders the brand story, pet image, and product route action', () => {
    render(<AboutUsPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /انتخاب برای دوست پشمالویتان/i }),
    ).toBeTruthy();
    expect(
      screen.getByRole('img', { name: 'سگ گلدن رتریور و گربه پرشین در خانه‌ای روشن' }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'دیدن محصولات' }).getAttribute('href')).toBe(
      routePaths.products,
    );
    expect(screen.getByRole('heading', { level: 2, name: /مراقبت خوب/i })).toBeTruthy();
  });
});
