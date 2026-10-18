import { Suspense } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { LandingPopularBrandDTO } from '@/entities/landing/landing.dto';

import { PopularBrandsSectionContent } from './popular-brands-section-content';

const brand: LandingPopularBrandDTO = {
  id: 'brand-1',
  title: 'Royal Canin',
  title_fa: 'رویال کنین',
  logo: 'https://cdn.example.com/royal-canin.webp',
  thumbnailLogo: 'data:image/webp;base64,AAAA',
  productCount: 12,
};

afterEach(cleanup);

describe('PopularBrandsSectionContent', () => {
  it('renders brand links for populated data', async () => {
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <PopularBrandsSectionContent popularBrandsPromise={Promise.resolve([brand])} />
        </Suspense>,
      );
    });

    expect(screen.getByRole('link', { name: 'محصولات برند رویال کنین' })).toBeTruthy();
  });

  it('renders a dedicated empty state for an empty brand collection', async () => {
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <PopularBrandsSectionContent popularBrandsPromise={Promise.resolve([])} />
        </Suspense>,
      );
    });

    expect(screen.getByText('برند محبوبی برای نمایش وجود ندارد')).toBeTruthy();
    expect(screen.getByText('به‌زودی برندهای محبوب جدیدی اضافه می‌شود.')).toBeTruthy();
  });
});
