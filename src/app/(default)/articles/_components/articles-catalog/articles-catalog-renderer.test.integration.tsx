import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { ArticlePaginatedResponse } from '@/entities/articles/articles.dto';

import { ArticlesCatalogRenderer } from './articles-catalog-renderer';

const { routerPushMock } = vi.hoisted(() => ({ routerPushMock: vi.fn() }));

vi.mock('react-infinite-scroll-component', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ push: routerPushMock }) }));

afterEach(cleanup);

function renderCatalog(children: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(createElement(QueryClientProvider, { client: queryClient }, children));
}

const data: ArticlePaginatedResponse = {
  result: [
    {
      id: 'article-1',
      title: 'راهنمای کامل مراقبت از سگ در خانه',
      subtitle: 'نکته‌های ضروری برای شروع',
      mainImage: 'https://s3.ir-thr-at1.arvanstorage.ir/pet-shop/articles/dog.webp',
      mainThumbnailImage: 'data:image/webp;base64,AAAA',
      summary: 'هر آنچه برای مراقبت روزانه، تغذیه و آرامش سگ خود نیاز دارید.',
      tags: [{ title: 'سگ' }],
      petType: { title: 'سگ' },
      author: { image: '', thumbnailImage: '', fullName: 'سارا احمدی' },
      slug: 'dog-care',
      createdAt: '2026-10-01T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    },
    {
      id: 'article-2',
      title: 'آموزش گربه برای زندگی آرام در خانه',
      subtitle: 'راهنمای کوتاه برای نگهداری گربه',
      mainImage: 'https://s3.ir-thr-at1.arvanstorage.ir/pet-shop/articles/cat.webp',
      mainThumbnailImage: 'data:image/webp;base64,AAAA',
      summary: 'راهکارهای ساده برای ساختن محیطی امن و آرام برای گربه‌ها.',
      tags: [{ title: 'گربه' }],
      petType: { title: 'گربه' },
      author: { image: '', thumbnailImage: '', fullName: 'مریم رضایی' },
      slug: 'cat-care',
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 2,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  },
  metadata: {
    tags: [{ title: 'سگ' }, { title: 'گربه' }, { title: 'تغذیه' }],
    petTypes: [
      {
        _id: '507f1f77bcf86cd799439011',
        title: 'سگ',
      },
    ],
    sort: {
      current: 'newest',
      options: [
        { value: 'newest', label: 'جدیدترین‌ها' },
        { value: 'oldest', label: 'قدیمی‌ترین‌ها' },
      ],
    },
  },
};

describe('ArticlesCatalogRenderer', () => {
  it('renders selectable API filters, all sort options, and accessible article cards', () => {
    renderCatalog(<ArticlesCatalogRenderer data={data} query={{}} />);

    expect(screen.getByRole('complementary', { name: 'موضوعات مقاله‌ها' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'فیلتر موضوعی' })).toBeTruthy();
    expect(screen.getByRole('radiogroup', { name: 'فیلتر نوع حیوان' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'همه نوع‌ها' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'سگ' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'مرتب‌سازی مقاله‌ها' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'جدیدترین‌ها' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByRole('button', { name: 'جدیدترین‌ها' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('button', { name: 'قدیمی‌ترین‌ها' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'تغذیه' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: data.result[0].title })).toBeTruthy();
    expect(
      screen.getByRole('link', { name: new RegExp(data.result[0].title) }).getAttribute('href'),
    ).toBe(routePaths.articleDetail(data.result[0].slug));
    expect(screen.getByText('سارا احمدی')).toBeTruthy();
    expect(screen.getByAltText(`تصویر مقاله ${data.result[0].title}`)).toBeTruthy();
  });

  it('updates the route query when a tag or sort is selected', () => {
    renderCatalog(<ArticlesCatalogRenderer data={data} query={{}} />);

    fireEvent.click(screen.getByRole('button', { name: 'گربه' }));

    expect(routerPushMock).toHaveBeenLastCalledWith(
      '/articles?page=1&tags=%DA%AF%D8%B1%D8%A8%D9%87',
      {
        scroll: false,
      },
    );
    fireEvent.click(screen.getByRole('button', { name: 'قدیمی‌ترین‌ها' }));

    expect(routerPushMock).toHaveBeenLastCalledWith('/articles?page=1&sort=oldest', {
      scroll: false,
    });

    fireEvent.click(screen.getByRole('radio', { name: 'سگ' }));

    expect(routerPushMock).toHaveBeenLastCalledWith(
      '/articles?page=1&petType=507f1f77bcf86cd799439011',
      { scroll: false },
    );
  });

  it('provides a compact sort select and filter dialog for mobile and tablet', () => {
    const { container } = renderCatalog(<ArticlesCatalogRenderer data={data} query={{}} />);

    expect(screen.getByRole('combobox', { name: 'مرتب‌سازی مقاله‌ها' }).textContent).toContain(
      'جدیدترین‌ها',
    );
    expect(container.querySelector('.tw\\:sticky.tw\\:lg\\:hidden')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'فیلتر مقاله‌ها' }));

    expect(screen.getByRole('dialog', { name: 'فیلتر مقاله‌ها' })).toBeTruthy();
    expect(screen.getByText('موضوع یا نوع حیوان موردنظر را انتخاب کنید.')).toBeTruthy();
  });

  it('keeps each filter group independently collapsible', () => {
    renderCatalog(<ArticlesCatalogRenderer data={data} query={{}} />);

    const tagsTrigger = screen.getByRole('button', { name: 'برچسب‌ها' });
    const petTypesTrigger = screen.getByRole('button', { name: 'نوع حیوان' });

    expect(tagsTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(petTypesTrigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(tagsTrigger);

    expect(tagsTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(petTypesTrigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('uses the same layout as a non-interactive skeleton fallback', () => {
    const { container } = renderCatalog(
      <ArticlesCatalogRenderer data={data} isSkeleton query={{}} />,
    );

    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.queryByRole('img', { name: /تصویر مقاله/i })).toBeNull();
  });
});
