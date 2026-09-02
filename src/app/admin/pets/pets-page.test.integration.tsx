import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { PetsPaginateTable } from './_components/pets-paginate-table';
import { petsTableSkeletonData } from './_components/pets-table-skeleton-data';
import { PetsTableContainer } from './_components/pets-table-container';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock('@/entities/pets/pets.client', () => ({
  usePetRowActions: () => ({
    isPending: false,
    enable: vi.fn(),
    disable: vi.fn(),
    remove: vi.fn(),
  }),
  submitDeletePet: vi.fn(),
}));

afterEach(cleanup);

const pet = {
  id: 'pet-1',
  mainImage: 'https://cdn.example.com/pet.webp',
  mainImageThumbnail: 'data:image/webp;base64,AAAA',
  title: 'بچه گربه پرشین',
  petType: 'گربه',
  breed: 'پرشین',
  summary: 'آرام و اجتماعی',
  quantity: 2,
  isEnable: true,
};

describe(routePaths.adminPets, () => {
  it('renders every requested column, avatar placeholder, switch, actions, and pagination', () => {
    render(
      <DirectionProvider direction="rtl">
        <PetsPaginateTable pets={[pet]} page={1} pageCount={2} total={12} query={{}} />
      </DirectionProvider>,
    );
    for (const heading of ['تصویر', 'عنوان', 'نوع حیوان', 'نژاد', 'خلاصه', 'موجودی', 'وضعیت']) {
      expect(screen.getByRole('columnheader', { name: heading })).toBeTruthy();
    }
    const rowCells = screen.getAllByRole('cell');
    expect(rowCells[4].firstElementChild?.className).toContain('tw:line-clamp-2');
    expect(rowCells[5].textContent).toContain(String(pet.quantity));
    expect(document.querySelector('[data-slot="avatar"]')?.getAttribute('style')).toContain(
      pet.mainImageThumbnail,
    );
    expect(document.querySelector('[data-slot="avatar-fallback"]')?.className).toContain(
      'tw:bg-transparent',
    );
    expect(screen.getByRole('switch', { name: `${pet.title}: فعال` })).toBeTruthy();
    expect(screen.getByRole('button', { name: `عملیات ${pet.title}` })).toBeTruthy();
    expect(screen.getByText('نمایش 1 حیوان از 12')).toBeTruthy();
  });

  it('reuses the renderer for a busy non-interactive fallback table', () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <PetsPaginateTable
          pets={petsTableSkeletonData}
          page={1}
          pageCount={1}
          total={5}
          query={{}}
          isLoading
        />
      </DirectionProvider>,
    );
    const region = container.querySelector('section')!;
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.className).toContain('skeleton');
    expect(
      screen
        .getAllByRole('switch')
        .every(
          (item) => item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true',
        ),
    ).toBe(true);
    expect(
      screen
        .getAllByRole('button', { name: /عملیات/ })
        .every((item) => item.hasAttribute('disabled')),
    ).toBe(true);
  });

  it('maps loaded backend data and normalizes errors', async () => {
    const loaded = await PetsTableContainer({
      petsPromise: Promise.resolve({
        isSuccess: true,
        message: null,
        data: {
          result: [
            {
              ...pet,
              images: [],
              description: 'توضیحات',
              quantity: 2,
              price: 100,
              discountPercentage: 0,
              inEnable: true,
              slug: 'persian',
              createdAt: '',
              updatedAt: '',
            },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
          },
        },
      }),
      query: {},
    });
    const error = await PetsTableContainer({
      petsPromise: Promise.resolve({
        isSuccess: false,
        message: 'خطای سرور',
        data: { messages: {}, details: {} },
      }),
      query: {},
    });
    const { rerender } = render(<DirectionProvider direction="rtl">{loaded}</DirectionProvider>);
    expect(screen.getByText(pet.title)).toBeTruthy();
    rerender(<DirectionProvider direction="rtl">{error}</DirectionProvider>);
    expect(screen.getByText('دریافت حیوانات انجام نشد')).toBeTruthy();
    expect(screen.getByText('خطای سرور')).toBeTruthy();
  });
});
