import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CreatePetDialog } from './create-pet-dialog';

vi.mock('@/entities/pets/pets.client', () => ({
  useCreatePet: () => ({ formRef: { current: null }, handleSubmit: vi.fn(), isPending: false }),
}));

afterEach(cleanup);

describe('CreatePetDialog', () => {
  it('uses image-bearing relation selects and hides generated/default fields', () => {
    render(
      <DirectionProvider direction="rtl">
        <CreatePetDialog
          open
          onOpenChange={vi.fn()}
          onCreated={vi.fn()}
          formOptions={{
            petTypes: [{ id: 'type-1', title: 'گربه', image: 'type.webp' }],
          }}
        />
      </DirectionProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'افزودن حیوان جدید' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'نوع حیوان' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'نژاد' })).toBeTruthy();
    expect(screen.queryByLabelText('نامک')).toBeNull();
    expect(screen.queryByLabelText('قیمت')).toBeNull();
    expect(screen.queryByLabelText('درصد تخفیف')).toBeNull();
    expect(screen.queryByLabelText('فعال')).toBeNull();
    const imageInput = screen.getByLabelText('تصاویر حیوان') as HTMLInputElement;
    expect(imageInput.multiple).toBe(true);
    expect(imageInput.accept).toBe('image/jpeg,image/png,image/webp');
    expect(screen.getByText('0 از 5 تصویر')).toBeTruthy();
  });
});
