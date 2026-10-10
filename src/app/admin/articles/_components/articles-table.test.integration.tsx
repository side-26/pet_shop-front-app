import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ArticlesTable } from './articles-table';

afterEach(cleanup);

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
      <DirectionProvider direction="rtl">
        <ArticlesTable articles={[article]} />
      </DirectionProvider>,
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

    fireEvent.click(screen.getByRole('button', { name: 'عملیات راهنمای مراقبت از سگ' }));
    expect(
      screen.getByRole('menuitem', { name: 'ویرایش اطلاعات اصلی' }).getAttribute('data-disabled'),
    ).toBe('');
    expect(screen.getByRole('menuitem', { name: 'ویرایش متن مقاله' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'حذف مقاله' })).toBeTruthy();
  });

  it('marks skeleton rows busy and disables their interaction controls', () => {
    render(
      <DirectionProvider direction="rtl">
        <ArticlesTable articles={[article]} isLoading />
      </DirectionProvider>,
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
});
