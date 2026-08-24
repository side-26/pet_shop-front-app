import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import ProductDetailPage, { generateMetadata, generateStaticParams } from './page';

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  CarouselContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(cleanup);

describe(routePaths.productDetail('adult-dog-food'), () => {
  it('renders the product detail journey and reusable interactive controls', async () => {
    render(
      await ProductDetailPage({
        params: Promise.resolve({ slug: 'adult-dog-food' }),
      }),
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'غذای خشک سگ مدل رویال کنین Maxi Adult',
      }),
    ).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeTruthy();
    expect(screen.getByText('غذای خشک').getAttribute('aria-current')).toBe('page');
    expect(screen.getAllByText('۲٬۹۷۵٬۰۰۰').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'افزودن به سبد خرید' })).toHaveLength(2);
    expect(screen.getByRole('group', { name: 'انتخاب وزن' })).toBeTruthy();

    const expandTrigger = screen.getByRole('button', { name: 'مشاهده بیشتر' });
    expect(expandTrigger.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(expandTrigger);
    expect(screen.getByRole('button', { name: 'مشاهده کمتر' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  it('defines static route params, metadata, and canonical route construction', async () => {
    expect(generateStaticParams()).toContainEqual({ slug: 'adult-dog-food' });
    expect(routePaths.productDetail('adult dog food')).toBe('/products/adult%20dog%20food');

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'adult-dog-food' }),
    });
    expect(metadata.title).toBe('غذای خشک سگ مدل رویال کنین Maxi Adult | پناهگاه پرشین');
  });
});
