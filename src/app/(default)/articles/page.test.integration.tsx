import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ArticlesPage, { instant } from './page';

vi.mock('./_components/articles-catalog/articles-catalog-section', () => ({
  ArticlesCatalogSection: () => <div data-testid="articles-catalog" />,
}));

describe('/articles', () => {
  it('renders the request-rendered articles shell and its streamed catalogue section', () => {
    render(<ArticlesPage />);

    expect(instant).toBe(false);
    expect(
      screen.getByRole('heading', { level: 1, name: /برای زندگی بهتر کنار دوست پشمالوی شما/i }),
    ).toBeTruthy();
    expect(screen.getByTestId('articles-catalog')).toBeTruthy();
  });
});
