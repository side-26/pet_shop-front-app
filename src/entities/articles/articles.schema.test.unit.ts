import { describe, expect, it } from 'vitest';

import {
  articleSlugSchema,
  createArticleSchema,
  replaceArticleTagsSchema,
  updateArticleMainTextSchema,
  updateArticleSchema,
} from './articles.schema';

const article = {
  title: 'راهنمای مراقبت از سگ',
  subtitle: 'آنچه برای شروع باید بدانید',
  mainImage: 'https://cdn.example.test/articles/dog.webp',
  mainThumbnailImage: 'data:image/webp;base64,AAAA',
  mainText: { type: 'doc' as const, content: [] },
};

describe('article schemas', () => {
  it('strips tags from the create body because they have a dedicated endpoint', async () => {
    await expect(
      createArticleSchema.validate({ ...article, tags: [{ title: 'سگ' }] }, { stripUnknown: true }),
    ).resolves.toEqual(article);
  });

  it('rejects missing required create fields and non-structured main text', async () => {
    await expect(createArticleSchema.validate({ title: article.title })).rejects.toThrow();
    await expect(
      createArticleSchema.validate({ ...article, mainText: '<p>متن</p>' }),
    ).rejects.toThrow('JSON ساخت‌یافته');
  });

  it('validates article tag replacement separately from article details', async () => {
    await expect(replaceArticleTagsSchema.validate({ tags: [{ title: 'سگ' }] })).resolves.toEqual({
      tags: [{ title: 'سگ' }],
    });
    await expect(replaceArticleTagsSchema.validate({ tags: [{ title: '' }] })).rejects.toThrow();
  });

  it('permits a partial detail update but requires at least one field', async () => {
    await expect(updateArticleSchema.validate({ summary: 'خلاصه تازه' })).resolves.toEqual({
      summary: 'خلاصه تازه',
    });
    await expect(updateArticleSchema.validate({})).rejects.toThrow('حداقل یک فیلد');
  });

  it('uses the distinct constraints for public slugs and dedicated main-text updates', async () => {
    await expect(articleSlugSchema.validate({ slug: '  dog-care  ' })).resolves.toEqual({
      slug: 'dog-care',
    });
    await expect(
      updateArticleMainTextSchema.validate({ mainText: article.mainText }),
    ).resolves.toEqual({
      mainText: article.mainText,
    });
  });
});
