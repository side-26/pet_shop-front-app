import { describe, expect, it } from 'vitest';

import {
  ArticleAuthorDTO,
  ArticleDTO,
  ArticleListDTO,
  ArticlePetTypeDTO,
  ArticleTagDTO,
  toArticleDTO,
  toArticleListDTOs,
} from './articles.dto';

describe('article DTO transformation', () => {
  it('exposes only the public article contract and transforms nested DTOs', () => {
    const dto = toArticleDTO({
      id: 'article-id',
      title: 'راهنمای مراقبت از سگ',
      subtitle: 'آنچه برای شروع باید بدانید',
      mainImage: 'https://cdn.example.test/articles/dog.webp',
      mainThumbnailImage: 'data:image/webp;base64,AAAA',
      summary: '',
      tags: [{ title: 'سگ', internalValue: 'removed' }],
      petType: 'pet-type-id',
      mainText: { type: 'doc', content: [] },
      author: {
        avatar: '',
        placeholderImage: '',
        firstName: 'سارا',
        lastName: 'احمدی',
        internalValue: 'removed',
      },
      slug: 'dog-care',
      createdAt: '2026-10-07T00:00:00.000Z',
      updatedAt: '2026-10-07T00:00:00.000Z',
      createdBy: 'private-user-id',
    });

    expect(dto).toBeInstanceOf(ArticleDTO);
    expect(dto.tags[0]).toBeInstanceOf(ArticleTagDTO);
    expect(dto.author).toBeInstanceOf(ArticleAuthorDTO);
    expect(dto).not.toHaveProperty('createdBy');
    expect(dto.tags[0]).not.toHaveProperty('internalValue');
    expect(dto.author).not.toHaveProperty('internalValue');
  });

  it('transforms populated list pet types and rejects a non-list response', () => {
    const articles = toArticleListDTOs([
      {
        id: 'article-id',
        title: 'راهنمای مراقبت از سگ',
        tags: [],
        petType: { title: 'سگ', internalValue: 'removed' },
        author: {},
        unexpected: true,
      },
    ]);

    expect(articles[0]).toBeInstanceOf(ArticleListDTO);
    expect(articles[0]?.petType).toBeInstanceOf(ArticlePetTypeDTO);
    expect(articles[0]?.petType?.title).toBe('سگ');
    expect(articles[0]?.petType).not.toHaveProperty('internalValue');
    expect(articles[0]).not.toHaveProperty('unexpected');
    expect(() => toArticleListDTOs({})).toThrow('Expected an article array');
  });
});
