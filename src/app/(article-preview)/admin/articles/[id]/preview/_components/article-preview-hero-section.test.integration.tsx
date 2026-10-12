import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ArticleDTO } from '@/entities/articles/articles.dto';

import { ArticlePreviewHeroSection } from './article-preview-hero-section';

const article = {
  title: 'راهنمای انتخاب غذای گربه',
  subtitle: 'آنچه برای انتخاب آگاهانه باید بدانید',
} as ArticleDTO;

describe('ArticlePreviewHeroSection', () => {
  it('keeps the title semantic and scales title and subtitle down by breakpoint', () => {
    render(<ArticlePreviewHeroSection article={article} />);

    const title = screen.getByRole('heading', { level: 1, name: article.title });
    const subtitle = screen.getByText(article.subtitle);

    expect(title.className).toContain('tw:text-heading-3');
    expect(title.className).toContain('tw:md:text-heading-2');
    expect(title.className).toContain('tw:lg:text-heading-1');
    expect(subtitle.className).toContain('tw:text-body-s');
    expect(subtitle.className).toContain('tw:md:text-body-m');
    expect(subtitle.className).toContain('tw:lg:text-body-l');
  });
});
