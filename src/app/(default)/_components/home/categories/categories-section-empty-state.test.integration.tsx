import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CategoriesSectionEmptyState } from './categories-section-empty-state';

afterEach(cleanup);

describe('CategoriesSectionEmptyState', () => {
  it('explains that no pet categories are currently available', () => {
    render(<CategoriesSectionEmptyState />);

    expect(screen.getByText('دسته‌بندی برای نمایش وجود ندارد')).toBeTruthy();
  });
});
