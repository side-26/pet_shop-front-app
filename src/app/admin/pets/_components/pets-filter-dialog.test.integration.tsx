import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PetsFilterDialog } from './pets-filter-dialog';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/entities/breeds/breeds.actions', () => ({
  getBreedsAction: vi.fn(async () => ({ isSuccess: true, message: null, data: [] })),
}));

afterEach(cleanup);

describe('PetsFilterDialog', () => {
  it('uses the same image-bearing relation selects as the create-pet dialog', () => {
    render(
      <DirectionProvider direction="rtl">
        <PetsFilterDialog
          open
          onOpenChange={vi.fn()}
          formOptions={{
            petTypes: [{ id: 'type-1', title: 'گربه', image: 'type.webp' }],
          }}
        />
      </DirectionProvider>,
    );

    expect(screen.getByRole('combobox', { name: 'نوع حیوان' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'نژاد' }).getAttribute('disabled')).not.toBeNull();
  });
});
