import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const usedPromiseValues = vi.hoisted(() => new WeakMap<Promise<unknown>, unknown>());

vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof import('react')>();

  return {
    ...react,
    use: <T,>(promise: Promise<T>) => usedPromiseValues.get(promise) as T,
  };
});

import { ArticlesTableContainer } from './articles-table-container';

afterEach(cleanup);

const article = {
  id: 'article-id',
  title: 'راهنمای مراقبت از سگ',
  subtitle: 'زیرعنوان',
  mainImage: 'https://cdn.example.test/articles/dog.webp',
  mainThumbnailImage: 'data:image/webp;base64,AAAA',
  summary: 'خلاصه',
  tags: [],
  petType: null,
  petTypeTitle: null,
  mainText: { type: 'doc' as const, content: [] },
  author: { avatar: '', placeholderImage: '', firstName: 'سارا', lastName: 'احمدی' },
  slug: 'dog-care',
  createdAt: '2026-10-07T00:00:00.000Z',
  updatedAt: '2026-10-07T00:00:00.000Z',
};

describe('ArticlesTableContainer', () => {
  it('maps successful article reads into the shared table renderer', async () => {
    const articlesPromise = Promise.resolve([article]);
    usedPromiseValues.set(articlesPromise, [article]);
    const view = ArticlesTableContainer({ articlesPromise });

    render(<DirectionProvider direction="rtl">{view}</DirectionProvider>);
    expect(screen.getByText(article.title)).toBeTruthy();
  });

  it('renders a distinct empty state', async () => {
    const articlesPromise = Promise.resolve([]);
    usedPromiseValues.set(articlesPromise, []);
    const view = ArticlesTableContainer({ articlesPromise });

    render(<DirectionProvider direction="rtl">{view}</DirectionProvider>);
    expect(screen.getByText('مقاله‌ای برای نمایش وجود ندارد')).toBeTruthy();
  });
});
