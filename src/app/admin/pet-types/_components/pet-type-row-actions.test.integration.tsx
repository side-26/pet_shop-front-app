import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getPetTypeByIdAction,
  getPetTypePropertyDefinitionsAction,
} from '@/entities/pet-types/pet-types.actions';
import type { PetTypeDTO } from '@/entities/pet-types/pet-types.dto';
import { Dialog } from '@/components/ui/dialog';

import { PetTypeRowActions } from './pet-type-row-actions';
import { PetTypeDetailFormBody } from './pet-type-detail-dialog-content-wrapper';
import { PetTypePropertyDefinitionsFormBody } from './pet-type-property-definitions-dialog-content-wrapper';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('@/entities/pet-types/pet-types.actions', () => ({
  deletePetTypeAction: vi.fn(),
  getPetTypeByIdAction: vi.fn(),
  getPetTypePropertyDefinitionsAction: vi.fn(),
}));
vi.mock('@/entities/pet-types/pet-types.client', () => ({
  useUpdatePetType: () => ({ formRef: { current: null }, handleSubmit: vi.fn(), isPending: false }),
  useRangePetTypePropertyDefinitions: () => ({
    formRef: { current: null },
    handleSubmit: vi.fn(),
    isPending: false,
  }),
}));

const getPetTypeByIdActionMock = vi.mocked(getPetTypeByIdAction);
const getPetTypePropertyDefinitionsActionMock = vi.mocked(getPetTypePropertyDefinitionsAction);

const petType: PetTypeDTO = {
  id: '507f1f77bcf86cd799439011',
  title: 'سگ',
  description: {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'حیوان خانگی وفادار' }] }],
  },
  mainImage: 'https://cdn.example.test/pet-types/dog.webp',
  thumbnail: 'https://cdn.example.test/pet-types/dog-thumb.webp',
  isEnabled: true,
  propertyDefinitions: [],
  slug: 'dog',
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-29T00:00:00.000Z',
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('PetTypeRowActions', () => {
  it('renders the real disabled form content for both loading states', () => {
    const onClose = vi.fn();
    const onUpdated = vi.fn();
    const { rerender } = render(
      <DirectionProvider direction="rtl">
        <Dialog open>
          <PetTypeDetailFormBody formRef={{ current: null }} handleSubmit={vi.fn()} isLoading />
        </Dialog>
      </DirectionProvider>,
    );

    expect(document.querySelector('form[aria-busy="true"]')?.className).toContain('skeleton');
    expect(screen.getByLabelText('عنوان').matches(':disabled')).toBe(true);

    rerender(
      <DirectionProvider direction="rtl">
        <Dialog open>
          <PetTypePropertyDefinitionsFormBody
            formRef={{ current: null }}
            handleSubmit={vi.fn()}
            isLoading
          />
        </Dialog>
      </DirectionProvider>,
    );

    expect(document.querySelector('form[aria-busy="true"]')?.className).toContain('skeleton');
    expect(screen.getAllByLabelText('عنوان').every((field) => field.matches(':disabled'))).toBe(
      true,
    );
  });

  it('starts the detail request after selection and replaces the loading form with its data', async () => {
    getPetTypeByIdActionMock.mockResolvedValue({ isSuccess: true, message: null, data: petType });

    render(
      <DirectionProvider direction="rtl">
        <PetTypeRowActions petTypeId={petType.id} petTypeTitle={petType.title} />
      </DirectionProvider>,
    );

    expect(getPetTypeByIdActionMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'عملیات سگ' }));
    await act(async () => fireEvent.click(await screen.findByText('مشاهده و ویرایش')));

    expect(getPetTypeByIdActionMock).toHaveBeenCalledWith({ id: petType.id });
    expect(await screen.findByRole('dialog', { name: 'مشاهده و ویرایش نوع حیوان' })).toBeTruthy();
    expect(await screen.findByDisplayValue(petType.title)).toBeTruthy();
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'توضیحات' }).textContent).toBe(
        'حیوان خانگی وفادار',
      ),
    );
    expect(
      screen.getByRole('img', { name: 'پیش‌نمایش تصویر اصلی نوع حیوان' }).getAttribute('src'),
    ).toBe(petType.mainImage);

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'مشاهده و ویرایش نوع حیوان' })).toBeNull(),
    );
  });

  it('starts the property-definition request after selection and replaces the loading form with its data', async () => {
    getPetTypePropertyDefinitionsActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: { result: [{ label: 'رنگ', value: 'قهوه‌ای' }] },
    });

    render(
      <DirectionProvider direction="rtl">
        <PetTypeRowActions petTypeId={petType.id} petTypeTitle={petType.title} />
      </DirectionProvider>,
    );

    expect(getPetTypePropertyDefinitionsActionMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'عملیات سگ' }));
    await act(async () => fireEvent.click(await screen.findByText('ویرایش ویژگی‌های اضافی')));

    await waitFor(() => {
      expect(getPetTypePropertyDefinitionsActionMock).toHaveBeenCalledWith({ id: petType.id });
    });
    expect(await screen.findByRole('dialog', { name: 'ویرایش ویژگی‌های اضافی' })).toBeTruthy();
    expect(await screen.findByDisplayValue('رنگ')).toBeTruthy();
    expect(screen.getByDisplayValue('قهوه‌ای')).toBeTruthy();
  });
});
