import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { LandingPetDetailDTO } from '@/entities/landing/landing.dto';
import { ReactQueryProvider } from '@/app/react-query-provider';
import { routePaths } from '@/configs/route.path';
import {
  getLandingPetBySlugAction,
  getPublicLandingPetBySlugAction,
} from '@/entities/landing/landing.actions';
import { useCartStore } from '@/stores/cart.store';

import PetDetailPage, { generateMetadata } from './page';

const { toggleWishlistItem } = vi.hoisted(() => ({ toggleWishlistItem: vi.fn() }));

vi.mock('@/entities/landing/landing.actions', () => ({
  getLandingPetBySlugAction: vi.fn(),
  getPublicLandingPetBySlugAction: vi.fn(),
}));
vi.mock('@/entities/users/users.client', () => ({
  useWishlist: () => ({ data: [] }),
  useWishlistToggle: () => ({ isPending: false, toggleWishlistItem }),
  wishlistItemId: (entry: { item: string }) => entry.item,
}));
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  CarouselContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CarouselPrevious: () => <button type="button">اسلاید قبلی</button>,
  CarouselNext: () => <button type="button">اسلاید بعدی</button>,
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

afterEach(() => {
  cleanup();
  useCartStore.setState({
    items: [],
    serverCart: null,
    needsServerSync: false,
    pendingAddOperations: [],
    isSyncing: false,
    lastError: null,
  });
  useCartStore.persist.clearStorage();
});

beforeEach(() => {
  toggleWishlistItem.mockReset();
  vi.mocked(getLandingPetBySlugAction).mockResolvedValue(pet);
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
      <ReactQueryProvider>
        <PetDetailPage params={Promise.resolve({ slug: pet.slug })} />
      </ReactQueryProvider>,
    );
    expect(await screen.findByRole('heading', { level: 1, name: pet.title })).toBeTruthy();
    expect(screen.getByRole('article').hasAttribute('data-pet-detail-content')).toBe(true);
    expect(screen.getAllByLabelText(`گالری تصاویر ${pet.title}`)).toHaveLength(2);
    expect(screen.getByRole('link', { name: pet.petType.title }).getAttribute('href')).toBe(
      routePaths.petsListByPetType(pet.petType.id),
    );
    expect(screen.getByRole('link', { name: pet.breed.title }).getAttribute('href')).toBe(
      routePaths.petsListByBreedAndPetType(pet.breed.id, pet.petType.id),
    );
    expect(screen.getByText('گلدن رتریور')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: `پیش‌سفارش ${pet.title}` })).toHaveLength(2);
    // Both responsive presentations stay mounted and are selected with CSS:
    // the expandable drawer for mobile/tablet and the expandable card for desktop.
    expect(screen.getAllByText('خلاصه حیوان')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'نمایش خلاصه حیوان' })).toHaveLength(2);
    expect(screen.getByRole('tab', { name: 'مشخصات' })).toBeTruthy();
  });

  it('adds and removes the exact pet through the cart store', async () => {
    render(
      <ReactQueryProvider>
        <PetDetailPage params={Promise.resolve({ slug: pet.slug })} />
      </ReactQueryProvider>,
    );

    await screen.findByRole('heading', { level: 1, name: pet.title });

    fireEvent.click(screen.getAllByRole('button', { name: `پیش‌سفارش ${pet.title}` })[0]!);

    expect(useCartStore.getState().hasPet(pet.id)).toBe(true);
    expect(screen.getAllByRole('button', { name: `حذف ${pet.title} از سبد خرید` })).toHaveLength(2);

    fireEvent.click(screen.getAllByRole('button', { name: `حذف ${pet.title} از سبد خرید` })[0]!);

    expect(useCartStore.getState().hasPet(pet.id)).toBe(false);
    expect(screen.getAllByRole('button', { name: `پیش‌سفارش ${pet.title}` })).toHaveLength(2);
  });

  it('toggles this pet through the shared wishlist mutation', async () => {
    render(
      <ReactQueryProvider>
        <PetDetailPage params={Promise.resolve({ slug: pet.slug })} />
      </ReactQueryProvider>,
    );

    fireEvent.click(
      await screen.findByRole('button', { name: `افزودن حیوان ${pet.title} به علاقه‌مندی‌ها` }),
    );

    expect(toggleWishlistItem).toHaveBeenCalledWith({ itemId: pet.id, itemType: 'pet' });
  });

  it('uses the renderer-backed skeleton while route params are pending', () => {
    render(
      <ReactQueryProvider>
        <PetDetailPage params={new Promise(() => undefined)} />
      </ReactQueryProvider>,
    );
    expect(screen.getByRole('article').getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('article').hasAttribute('inert')).toBe(true);
    expect(
      screen
        .getAllByRole('button', { name: 'پیش‌سفارش عنوان حیوان خانگی' })
        .every((button) => button.hasAttribute('disabled')),
    ).toBe(true);
    expect(screen.getByRole('tab', { name: 'معرفی حیوان' })).toBeTruthy();
  });

  it('shows the semantic empty state for detail data without an id', async () => {
    vi.mocked(getLandingPetBySlugAction).mockResolvedValue({ ...pet, id: '' });

    render(
      <ReactQueryProvider>
        <PetDetailPage params={Promise.resolve({ slug: pet.slug })} />
      </ReactQueryProvider>,
    );

    expect(await screen.findByText('حیوانی برای نمایش یافت نشد')).toBeTruthy();
    expect(screen.queryByRole('article')).toBeNull();
  });

  it('does not render an empty overview tab or its mobile/desktop drawers', async () => {
    vi.mocked(getLandingPetBySlugAction).mockResolvedValue({
      ...pet,
      description: '',
    });

    render(
      <ReactQueryProvider>
        <PetDetailPage params={Promise.resolve({ slug: pet.slug })} />
      </ReactQueryProvider>,
    );

    await screen.findByRole('heading', { level: 1, name: pet.title });

    expect(screen.queryByRole('tab', { name: 'معرفی حیوان' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'نمایش معرفی حیوان' })).toBeNull();
    expect(screen.getByRole('tab', { name: 'مشخصات' })).toBeTruthy();
  });

  it('shows a scoped recovery message when the action rejects', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(getLandingPetBySlugAction).mockRejectedValue(
      new Error('دریافت حیوان در دسترس نیست.'),
    );

    render(
      <ReactQueryProvider>
        <PetDetailPage params={Promise.resolve({ slug: pet.slug })} />
      </ReactQueryProvider>,
    );

    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain('دریافت حیوان در دسترس نیست.'),
    );
    consoleError.mockRestore();
  });

  it('uses the pet-specific fallback when the error has no message', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(getLandingPetBySlugAction).mockRejectedValue(new Error(' '));

    render(
      <ReactQueryProvider>
        <PetDetailPage params={Promise.resolve({ slug: pet.slug })} />
      </ReactQueryProvider>,
    );

    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain(
        'نمایش حیوان انجام نشد. دوباره تلاش کنید.',
      ),
    );
    consoleError.mockRestore();
  });

  it('builds metadata from the landing pet response', async () => {
    vi.mocked(getPublicLandingPetBySlugAction).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: pet,
    });
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: pet.slug }) });
    expect(metadata.title).toBe(`${pet.title} | پت شاپ پرشین`);
  });
});
