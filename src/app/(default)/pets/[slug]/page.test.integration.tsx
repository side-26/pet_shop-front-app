import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { LandingPetDetailDTO } from '@/entities/landing/landing.dto';
import { routePaths } from '@/configs/route.path';
import { getLandingPetBySlugAction } from '@/entities/landing/landing.actions';

import { PetDetailContainer } from './_components/pet-detail-container';
import PetDetailPage, { generateMetadata } from './page';

vi.mock('@/entities/landing/landing.actions', () => ({ getLandingPetBySlugAction: vi.fn() }));
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  CarouselContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const pet = {
  id: 'pet-1',
  slug: 'max',
  title: 'مکس',
  mainImage: 'https://example.test/max.webp',
  mainImageThumbnail: 'data:image/webp;base64,AAAA',
  images: [],
  summary: 'سگی مهربان و اجتماعی',
  description: {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'شرح مکس' }] }],
  },
  quantity: 1,
  userRate: 4.8,
  userRateCount: 12,
  price: 15_000_000,
  discountPercentage: 10,
  inEnable: true,
  petType: { id: 'type-1', title: 'سگ', propertyDefinitions: [{ label: 'اندازه', value: 'بزرگ' }] },
  breed: {
    id: 'breed-1',
    title: 'گلدن رتریور',
    propertyDefinitions: [{ label: 'کشور', value: 'انگلستان' }],
  },
} satisfies LandingPetDetailDTO;

afterEach(cleanup);

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe(routePaths.petDetail('max'), () => {
  it('renders API-backed pet details, sticky request pricing, summary, and specification tabs', async () => {
    render(
      await PetDetailContainer({
        petPromise: Promise.resolve({ isSuccess: true, message: null, data: pet }),
        slugPromise: Promise.resolve(pet.slug),
      }),
    );
    expect(screen.getByRole('heading', { level: 1, name: pet.title })).toBeTruthy();
    expect(screen.getByRole('article').hasAttribute('data-pet-detail-content')).toBe(true);
    expect(screen.getByLabelText(`گالری تصاویر ${pet.title}`)).toBeTruthy();
    expect(screen.getByRole('link', { name: pet.petType.title }).getAttribute('href')).toBe(
      routePaths.petsListByPetType(pet.petType.id),
    );
    expect(screen.getByRole('link', { name: pet.breed.title }).getAttribute('href')).toBe(
      routePaths.petsListByBreedAndPetType(pet.breed.id, pet.petType.id),
    );
    expect(screen.getByText('گلدن رتریور')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: `درخواست واگذاری ${pet.title}` })).toHaveLength(2);
    // Both responsive presentations stay mounted and are selected with CSS:
    // the expandable drawer for mobile/tablet and the expandable card for desktop.
    expect(screen.getAllByText('خلاصه حیوان')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'نمایش خلاصه حیوان' })).toHaveLength(2);
    expect(screen.getByRole('tab', { name: 'مشخصات' })).toBeTruthy();
  });

  it('uses the renderer-backed skeleton while route params are pending', () => {
    render(<PetDetailPage params={new Promise(() => undefined)} />);
    expect(screen.getByRole('article').getAttribute('aria-busy')).toBe('true');
  });

  it('builds metadata from the landing pet response', async () => {
    vi.mocked(getLandingPetBySlugAction).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: pet,
    });
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: pet.slug }) });
    expect(metadata.title).toBe(`${pet.title} | پت شاپ پرشین`);
  });
});
