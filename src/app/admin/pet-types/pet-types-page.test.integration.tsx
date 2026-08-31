import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import { getAllPetTypesAction } from '@/entities/pet-types/pet-types.actions';
import type { PetTypeDTO } from '@/entities/pet-types/pet-types.dto';

import { PetTypesTableContainer } from './_components/pet-types-table-container';
import { mapPetTypesTableRows } from './_components/pet-types-table.mapper';
import { petTypesTableSkeletonData } from './_components/pet-types-table-skeleton-data';
import { PetTypesTable } from './_components/pet-types-table';
import { PetTypesTableWrapper } from './_components/pet-types-table-wrapper';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/pet-types/pet-types.actions', () => ({
  getAllPetTypesAction: vi.fn(() => new Promise(() => undefined)),
  getPetTypeByIdAction: vi.fn(),
  deletePetTypeAction: vi.fn(),
}));

const petTypes: PetTypeDTO[] = [
  {
    id: '507f1f77bcf86cd799439011',
    title: 'سگ',
    description: 'حیوان خانگی وفادار',
    mainImage: 'https://cdn.example.test/pet-types/dog.webp',
    thumbnail: 'https://cdn.example.test/pet-types/dog-thumb.webp',
    isEnabled: true,
    propertyDefinitions: [],
    slug: 'dog',
    createdAt: '2026-08-28T00:00:00.000Z',
    updatedAt: '2026-08-29T00:00:00.000Z',
  },
];

function renderTable(props?: Partial<React.ComponentProps<typeof PetTypesTable>>) {
  return render(
    <DirectionProvider direction="rtl">
      <PetTypesTable petTypes={petTypes} {...props} />
    </DirectionProvider>,
  );
}

afterEach(cleanup);

const getAllPetTypesActionMock = vi.mocked(getAllPetTypesAction);

describe(routePaths.adminPetTypes, () => {
  it('reuses row view models for a busy, non-interactive skeleton table', () => {
    const { container } = renderTable({ petTypes: petTypesTableSkeletonData, isLoading: true });

    const region = container.querySelector('section')!;
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.className).toContain('skeleton');
    expect(
      screen
        .getAllByRole('switch')
        .every(
          (control) =>
            control.hasAttribute('disabled') || control.getAttribute('aria-disabled') === 'true',
        ),
    ).toBe(true);
    expect(
      screen
        .getAllByRole('button', { name: /عملیات/ })
        .every((button) => button.hasAttribute('disabled')),
    ).toBe(true);
  });

  it('maps the entity DTOs and renders normalized errors in the container', async () => {
    const loaded = await PetTypesTableContainer({
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: petTypes }),
    });
    const error = await PetTypesTableContainer({
      petTypesPromise: Promise.resolve({
        isSuccess: false,
        message: 'خطا در ارتباط با سرور',
        data: { messages: {}, details: {} },
      }),
    });

    const { container, rerender } = render(
      <DirectionProvider direction="rtl">{loaded}</DirectionProvider>,
    );
    expect(screen.getByText('سگ')).toBeTruthy();
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
    expect(container.querySelector('[data-slot="avatar"]')?.getAttribute('style')).toContain(
      petTypes[0].thumbnail,
    );
    expect(screen.getByRole('switch', { name: 'سگ: فعال' })).toBeTruthy();

    rerender(<DirectionProvider direction="rtl">{error}</DirectionProvider>);
    expect(screen.getByText('دریافت انواع حیوان انجام نشد')).toBeTruthy();
    expect(screen.getByText('خطا در ارتباط با سرور')).toBeTruthy();
  });

  it('maps the main image as the avatar source and thumbnail as its placeholder', () => {
    const [row] = mapPetTypesTableRows(petTypes);

    expect(row.mainImage).toBe(petTypes[0].mainImage);
    expect(row.thumbnail).toBe(petTypes[0].thumbnail);
  });

  it('keeps the table wrapper responsible for starting the list request', () => {
    PetTypesTableWrapper();

    expect(getAllPetTypesActionMock).toHaveBeenCalledWith({ includeDisabled: true });
  });
});
