import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArticlePreviewRenderer } from './article-preview-renderer';

describe('ArticlePreviewRenderer', () => {
  it('uses the rich-text previewer in its renderer-shaped skeleton', () => {
    render(<ArticlePreviewRenderer isSkeleton />);

    expect(screen.getByRole('article').getAttribute('aria-busy')).toBe('true');
    expect(screen.getByLabelText('متن مقاله').textContent).toContain('عنوان مقاله');
  });
});
