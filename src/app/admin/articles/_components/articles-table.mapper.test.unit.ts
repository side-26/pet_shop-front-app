import { describe, expect, it } from 'vitest';

import { mapArticlesTableRows } from './articles-table.mapper';

describe('mapArticlesTableRows', () => {
  it('maps only table fields and limits tags to five', () => {
    const rows = mapArticlesTableRows([
      {
        id: 'article-id',
        title: 'مقاله',
        subtitle: 'زیرعنوان',
        mainImage: 'https://cdn.example.test/article.webp',
        mainThumbnailImage: 'data:image/webp;base64,AAAA',
        summary: 'خلاصه',
        tags: Array.from({ length: 6 }, (_, index) => ({ title: `برچسب ${index + 1}` })),
        petType: '507f1f77bcf86cd799439011',
        mainText: { type: 'doc', content: [] },
        author: { avatar: '', placeholderImage: '', firstName: 'سارا', lastName: 'احمدی' },
        slug: 'article',
        createdAt: '2026-10-07T00:00:00.000Z',
        updatedAt: '2026-10-07T00:00:00.000Z',
      },
    ]);

    expect(rows).toEqual([
      expect.objectContaining({
        id: 'article-id',
        mainThumbnailImage: 'data:image/webp;base64,AAAA',
        tags: ['برچسب 1', 'برچسب 2', 'برچسب 3', 'برچسب 4', 'برچسب 5'],
      }),
    ]);
  });
});
