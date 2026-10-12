import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ArticleDTO } from '@/entities/articles/articles.dto';

import { ArticlePreviewRenderer } from './article-preview-renderer';

describe('ArticlePreviewRenderer', () => {
  it('uses the rich-text previewer in its renderer-shaped skeleton', () => {
    render(<ArticlePreviewRenderer isSkeleton />);

    expect(screen.getByRole('article').getAttribute('aria-busy')).toBe('true');
    expect(screen.getByLabelText('متن مقاله').textContent).toContain('عنوان مقاله');
  });

  it('uses the article title and summary as the fallback alt for rich-text images', () => {
    const article = {
      mainText: {
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: { height: 800, src: '/article-body.webp', width: 1200 },
          },
        ],
      },
      summary: 'راهنمای کامل برای انتخاب غذای مناسب',
      title: 'راهنمای انتخاب غذای گربه',
    } as unknown as ArticleDTO;

    render(<ArticlePreviewRenderer article={article} />);

    expect(
      screen.getByRole('img', {
        name: 'راهنمای انتخاب غذای گربه راهنمای کامل برای انتخاب غذای مناسب',
      }),
    ).toBeTruthy();
  });
});
