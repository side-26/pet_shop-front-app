import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { PetDetailContainer } from './_components/pet-detail-container';
import PetDetailPage, { generateMetadata, generateStaticParams } from './page';

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  CarouselContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

afterEach(cleanup);

describe(routePaths.petDetail('max'), () => {
  it('renders the responsive pet detail content and adoption action', async () => {
    render(
      await PetDetailContainer({
        paramsPromise: Promise.resolve({ slug: 'max' }),
      }),
    );
    expect(screen.getByRole('heading', { level: 1, name: 'مکس' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeTruthy();
    expect(screen.getByText('گلدن رتریور')).toBeTruthy();
    expect(screen.getByTestId('breed-info').className).toContain('tw:md:grid-cols-4');
    expect(screen.getAllByRole('button', { name: 'درخواست واگذاری' })).toHaveLength(2);
    expect(screen.getByText('واکسیناسیون کامل')).toBeTruthy();
  });

  it('uses the real detail renderer for the runtime-param loading state', () => {
    render(<PetDetailPage params={new Promise(() => undefined)} />);

    const loadingRegion = screen.getByRole('article');
    expect(loadingRegion.getAttribute('aria-busy')).toBe('true');
    expect(loadingRegion.className).toContain('skeleton');
    expect(screen.getByTestId('breed-info').className).toContain('tw:md:grid-cols-4');
  });

  it('defines static params, metadata, and the canonical path builder', async () => {
    expect(generateStaticParams()).toContainEqual({ slug: 'max' });
    expect(routePaths.petDetail('golden dog')).toBe('/pets/golden%20dog');
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'max' }) });
    expect(metadata.title).toBe('مکس، گلدن رتریور | پناهگاه پرشین');
  });
});
