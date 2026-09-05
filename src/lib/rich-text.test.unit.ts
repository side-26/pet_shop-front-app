import { describe, expect, it } from 'vitest';

import { getRichTextImageUrls } from './rich-text';

describe('getRichTextImageUrls', () => {
  it('returns unique persisted URLs from nested image nodes only', () => {
    const imageUrl = 'https://cdn.example.test/rich-text/image.webp';

    expect(
      getRichTextImageUrls({
        type: 'doc',
        content: [
          { type: 'image', attrs: { src: imageUrl } },
          {
            type: 'paragraph',
            content: [
              { type: 'image', attrs: { src: imageUrl } },
              { type: 'image', attrs: { src: 'data:image/webp;base64,local' } },
            ],
          },
        ],
      }),
    ).toEqual([imageUrl]);
  });
});
