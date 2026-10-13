import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArticlesCatalogEmptyFetch } from './articles-catalog-empty-fetch';

describe('ArticlesCatalogEmptyFetch', () => {
  it('explains the semantic empty article collection', () => {
    render(<ArticlesCatalogEmptyFetch />);

    expect(screen.getByText('هنوز مقاله‌ای برای نمایش نیست')).toBeTruthy();
  });
});
