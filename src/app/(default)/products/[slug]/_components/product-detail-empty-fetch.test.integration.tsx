import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProductDetailEmptyFetch } from './product-detail-empty-fetch';

describe('ProductDetailEmptyFetch', () => {
  it('explains when a product has no semantic detail data', () => {
    render(<ProductDetailEmptyFetch />);

    expect(screen.getByText('محصولی برای نمایش یافت نشد')).toBeTruthy();
  });
});
