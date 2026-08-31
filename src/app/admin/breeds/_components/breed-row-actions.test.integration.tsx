import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getBreedAction,
  getBreedPropertyDefinitionsAction,
} from '@/entities/breeds/breeds.actions';
import type { BreedDTO } from '@/entities/breeds/breeds.dto';

import { BreedRowActions } from './breed-row-actions';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/breeds/breeds.actions', () => ({
  deleteBreedAction: vi.fn(),
  getBreedAction: vi.fn(),
  getBreedPropertyDefinitionsAction: vi.fn(),
}));
vi.mock('@/entities/breeds/breeds.client', () => ({
  useUpdateBreed: () => ({ formRef: { current: null }, handleSubmit: vi.fn(), isPending: false }),
  useReplaceBreedPropertyDefinitions: () => ({
    formRef: { current: null },
    handleSubmit: vi.fn(),
    isPending: false,
  }),
}));

const breed: BreedDTO = {
  id: '507f1f77bcf86cd799439012',
  title: 'گلدن رتریور',
  petType: '507f1f77bcf86cd799439011',
  country: 'اسکاتلند',
  ageAverage: '۱۰ تا ۱۲ سال',
  size: 4,
  activityLevel: 4,
  propertyDefinitions: [],
  mainImage: 'https://cdn.example.test/breeds/golden.webp',
  thumbnailImage: 'data:image/webp;base64,thumbnail',
  enable: true,
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-29T00:00:00.000Z',
};
const petTypes = [{ value: '507f1f77bcf86cd799439011', label: 'سگ' }];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('BreedRowActions', () => {
  it('starts detail loading only after selection and resolves into the shared update form', async () => {
    vi.mocked(getBreedAction).mockResolvedValue({ isSuccess: true, message: null, data: breed });
    render(
      <DirectionProvider direction="rtl">
        <BreedRowActions breedId={breed.id} breedTitle={breed.title} petTypes={petTypes} />
      </DirectionProvider>,
    );

    expect(getBreedAction).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: `عملیات ${breed.title}` }));
    await act(async () => fireEvent.click(await screen.findByText('مشاهده و ویرایش')));

    expect(getBreedAction).toHaveBeenCalledWith({ id: breed.id });
    expect(await screen.findByRole('dialog', { name: 'مشاهده و ویرایش نژاد' })).toBeTruthy();
    expect(await screen.findByDisplayValue(breed.title)).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'نوع حیوان' }).textContent).toContain('سگ');
  });

  it('loads and displays property definitions only after that action is selected', async () => {
    vi.mocked(getBreedPropertyDefinitionsAction).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: { result: [{ label: 'رنگ', value: 'طلایی' }] },
    });
    render(
      <DirectionProvider direction="rtl">
        <BreedRowActions breedId={breed.id} breedTitle={breed.title} petTypes={petTypes} />
      </DirectionProvider>,
    );

    expect(getBreedPropertyDefinitionsAction).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: `عملیات ${breed.title}` }));
    await act(async () => fireEvent.click(await screen.findByText('ویرایش ویژگی‌های اضافی')));

    await waitFor(() =>
      expect(getBreedPropertyDefinitionsAction).toHaveBeenCalledWith({ id: breed.id }),
    );
    expect(await screen.findByRole('dialog', { name: 'ویرایش ویژگی‌های اضافی نژاد' })).toBeTruthy();
    expect(await screen.findByDisplayValue('رنگ')).toBeTruthy();
    expect(screen.getByDisplayValue('طلایی')).toBeTruthy();
  });
});
