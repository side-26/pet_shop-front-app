import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ArticleDetailPage from './page';

vi.mock('./_components/article-detail-section', () => ({
  ArticleDetailSection: () => <main data-testid="article-detail-section" />,
}));

describe('/articles/[slug]', () => {
  it('composes the streamed public article section', () => {
    render(<ArticleDetailPage params={Promise.resolve({ slug: 'dog-care' })} />);

    expect(screen.getByTestId('article-detail-section')).toBeTruthy();
  });
});
