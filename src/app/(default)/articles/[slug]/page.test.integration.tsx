import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getArticlePreviewBySlugAction } from '@/entities/articles/articles.actions';

import ArticleDetailPage, { generateMetadata } from './page';

vi.mock('@/entities/articles/articles.actions', () => ({ getArticlePreviewBySlugAction: vi.fn() }));

vi.mock('./_components/article-detail-section', () => ({
  ArticleDetailSection: () => <main data-testid="article-detail-section" />,
}));

describe('/articles/[slug]', () => {
  it('composes the streamed public article section', () => {
    render(<ArticleDetailPage params={Promise.resolve({ slug: 'dog-care' })} />);

    expect(screen.getByTestId('article-detail-section')).toBeTruthy();
  });

  it('sets metadata from the article title and summary', async () => {
    vi.mocked(getArticlePreviewBySlugAction).mockResolvedValue({
      id: 'article-1',
      title: 'مراقبت از سگ',
      subtitle: '',
      mainImage: '',
      mainThumbnailImage: '',
      summary: 'راهنمای ساده برای مراقبت روزانه از سگ',
      tags: [],
      petType: null,
      mainText: { type: 'doc', content: [] },
      author: { image: '', thumbnailImage: '', fullName: '' },
      slug: 'dog-care',
      createdAt: '',
      updatedAt: '',
    });

    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'dog-care' }) });

    expect(metadata).toMatchObject({
      title: 'مراقبت از سگ',
      description: 'راهنمای ساده برای مراقبت روزانه از سگ',
    });
  });
});
