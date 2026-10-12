import { DirectionProvider } from '@base-ui/react/direction-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from '@/components/common/confirm-dialog/main';
import { routePaths } from '@/configs/route.path';
import { deleteArticleAction } from '@/entities/articles/articles.actions';
import { useCommonStore } from '@/stores/common.store';
import { ArticlesTableDialogProvider } from './articles-table-dialog-provider';
import { ArticlesTable } from './articles-table';

const mocks = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

vi.mock('nextjs-toploader/app', () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
}));
vi.mock('@/entities/articles/articles.actions', () => ({ deleteArticleAction: vi.fn() }));

afterEach(() => {
  cleanup();
  act(() => useCommonStore.getState().hideConfirmDialog());
  queryClient.clear();
  vi.clearAllMocks();
});

const article = {
  id: 'article-id',
  title: 'راهنمای مراقبت از سگ',
  petType: { title: 'سگ' },
  tags: [{ title: 'سگ' }, { title: 'سلامت' }, { title: 'تغذیه' }],
  summary: 'راهنمای کوتاه برای نگهداری بهتر از سگ.',
  mainImage: 'https://cdn.example.test/articles/dog.webp',
  mainThumbnailImage: 'data:image/webp;base64,AAAA',
};

describe('ArticlesTable', () => {
  it('renders the requested columns, thumbnail-backed image, and action controls', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DirectionProvider direction="rtl">
          <ArticlesTableDialogProvider petTypes={[]}>
            <ArticlesTable articles={[article]} />
          </ArticlesTableDialogProvider>
        </DirectionProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('columnheader', { name: 'عنوان' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'نوع حیوان' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'برچسب‌ها' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'خلاصه' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'تصویر' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'عملیات' })).toBeTruthy();
    expect(
      within(screen.getByRole('cell', { name: 'سگ' })).getByText(article.petType.title),
    ).toBeTruthy();
    expect(screen.getByLabelText('تصویر راهنمای مراقبت از سگ').style.backgroundImage).toContain(
      article.mainThumbnailImage,
    );
    expect(screen.getByRole('button', { name: 'پیش‌نمایش راهنمای مراقبت از سگ' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'پیش‌نمایش راهنمای مراقبت از سگ' }));
    expect(mocks.push).toHaveBeenCalledWith(routePaths.adminArticlePreview(article.id));

    fireEvent.click(screen.getByRole('button', { name: 'عملیات راهنمای مراقبت از سگ' }));
    expect(
      screen.getByRole('menuitem', { name: 'ویرایش اطلاعات اصلی' }).getAttribute('data-disabled'),
    ).toBeNull();
    expect(screen.getByRole('menuitem', { name: 'ویرایش متن مقاله' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'ویرایش برچسب‌ها' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'حذف مقاله' })).toBeTruthy();
  });

  it('marks skeleton rows busy and disables their interaction controls', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DirectionProvider direction="rtl">
          <ArticlesTableDialogProvider petTypes={[]}>
            <ArticlesTable articles={[article]} isLoading />
          </ArticlesTableDialogProvider>
        </DirectionProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('region', { name: 'فهرست مقاله‌ها' }).getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(
      (screen.getByRole('button', { name: 'پیش‌نمایش راهنمای مراقبت از سگ' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(
      (screen.getByRole('button', { name: 'عملیات راهنمای مراقبت از سگ' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it('confirms deletion through the shared pending dialog and refreshes the article list', async () => {
    vi.mocked(deleteArticleAction).mockResolvedValue({
      isSuccess: true,
      message: 'مقاله حذف شد.',
      data: {} as never,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DirectionProvider direction="rtl">
          <ArticlesTableDialogProvider petTypes={[]}>
            <ArticlesTable articles={[article]} />
          </ArticlesTableDialogProvider>
          <ConfirmDialog />
        </DirectionProvider>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'عملیات راهنمای مراقبت از سگ' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'حذف مقاله' }));
    expect(await screen.findByRole('heading', { name: 'مقاله حذف شود؟' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'تأیید' }));
    expect(await screen.findByRole('button', { name: 'در حال انجام…' })).toBeTruthy();
    expect(deleteArticleAction).toHaveBeenCalledWith({ id: article.id });

    await screen.findByRole('button', { name: 'عملیات راهنمای مراقبت از سگ' });
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });
});
