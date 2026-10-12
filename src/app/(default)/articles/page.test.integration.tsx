import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ArticlesPage, { instant } from './page';

describe('/articles', () => {
  it('renders the static articles landing page', () => {
    render(<ArticlesPage />);

    expect(instant).toBe(true);
    expect(
      screen.getByRole('heading', { level: 1, name: /راهنمایی برای زندگی بهتر/i }),
    ).toBeTruthy();
    expect(screen.getByText('اولین مقاله‌ها در راه‌اند')).toBeTruthy();
  });
});
