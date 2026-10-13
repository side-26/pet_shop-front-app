import { describe, expect, it } from 'vitest';

import {
  ArticleDTO,
  ArticleListDTO,
  ArticlePetTypeDTO,
  ArticleTagDTO,
  toArticleDTO,
  toArticleResponse,
  toArticleDetailsDTO,
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
    expect(dto.author.image).toBe('');
    expect(dto.author.thumbnailImage).toBe('');
    expect(dto.author.fullName).toBe('سارا احمدی');
    expect(dto).not.toHaveProperty('createdBy');
    expect(dto.tags[0]).not.toHaveProperty('internalValue');
    expect(dto.author).not.toHaveProperty('internalValue');
  });

  it('serializes only the author presentation contract for server-to-client responses', () => {
    const article = toArticleResponse({
      id: 'article-id',
      author: {
        avatar: 'https://cdn.example.test/authors/sara.webp',
        placeholderImage: 'data:image/webp;base64,AAAA',
        firstName: 'سارا',
        lastName: 'احمدی',
      },
    });

    expect(article.author).toEqual({
      image: 'https://cdn.example.test/authors/sara.webp',
      thumbnailImage: 'data:image/webp;base64,AAAA',
      fullName: 'سارا احمدی',
    });
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
    expect(articles[0]).not.toHaveProperty('mainText');
    expect(articles[0]).not.toHaveProperty('unexpected');
    expect(() => toArticleListDTOs({})).toThrow('Expected an article array');
  });

  it('converts article-list creation dates to a Jalali ISO date', () => {
    const [article] = toArticleListDTOs([
      {
        id: 'article-id',
        author: {},
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ]);

    expect(article?.createdAt).toBe('۱۴۰۴/۱۰/۱۱');
  });

  it('exposes only the article-details fields needed by the main-info editor', () => {
    const details = toArticleDetailsDTO({
      id: 'article-id',
      title: 'راهنمای مراقبت از سگ',
      subtitle: 'آنچه برای شروع باید بدانید',
      mainImage: 'https://cdn.example.test/articles/dog.webp',
      mainThumbnailImage: 'data:image/webp;base64,AAAA',
      petType: 'pet-type-id',
      summary: 'خلاصه مقاله',
      tags: [{ title: 'سگ', internalValue: 'removed' }],
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
    });

    expect(details).toMatchObject({
      id: 'article-id',
      title: 'راهنمای مراقبت از سگ',
      subtitle: 'آنچه برای شروع باید بدانید',
      mainImage: 'https://cdn.example.test/articles/dog.webp',
      mainThumbnailImage: 'data:image/webp;base64,AAAA',
      petType: 'pet-type-id',
      summary: 'خلاصه مقاله',
      tags: [{ title: 'سگ' }],
      author: { fullName: 'سارا احمدی' },
      slug: 'dog-care',
    });
    expect(details.tags[0]).not.toHaveProperty('internalValue');
    expect(details.author).not.toHaveProperty('internalValue');
  });
});
