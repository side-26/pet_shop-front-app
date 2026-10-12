import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { ArticlePreviewBackButton } from './article-preview-back-button';

describe('ArticlePreviewBackButton', () => {
  it('links accessibly to the centralized article-list route', () => {
    render(<ArticlePreviewBackButton />);

    const link = screen.getByRole('link', { name: 'بازگشت به فهرست مقاله‌ها' });
    expect(link.getAttribute('href')).toBe(routePaths.adminArticles);
    expect(link.getAttribute('title')).toBe('بازگشت به فهرست مقاله‌ها');
  });
});
