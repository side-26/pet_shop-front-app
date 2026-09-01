import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Dialog } from '@/components/ui/dialog';

import {
  hasStoredMainImage,
  PetTypeDetailFormBody,
} from './pet-type-detail-dialog-content-wrapper';

vi.mock('@/entities/pet-types/pet-types.client', () => ({
  useUpdatePetType: () => ({ formRef: { current: null }, handleSubmit: vi.fn(), isPending: false }),
}));

afterEach(cleanup);

describe('PetTypeDetailFormBody', () => {
  it('accepts only non-empty strings as stored image values', () => {
    expect(hasStoredMainImage('https://cdn.example.test/pet-types/dog.webp')).toBe(true);
    expect(hasStoredMainImage('   ')).toBe(false);
    expect(hasStoredMainImage(null)).toBe(false);
    expect(hasStoredMainImage({ url: 'https://cdn.example.test/pet-types/dog.webp' })).toBe(false);
  });

  it('does not require a replacement file when a pet type already has an image URL', () => {
    render(
      <DirectionProvider direction="rtl">
        <Dialog open>
          <PetTypeDetailFormBody
            formRef={{ current: null }}
            handleSubmit={() => undefined}
            petType={{
              id: '507f1f77bcf86cd799439011',
              title: 'سگ',
              description: 'حیوان خانگی',
              mainImage: 'https://cdn.example.test/pet-types/dog.webp',
            }}
          />
        </Dialog>
      </DirectionProvider>,
    );

    expect(screen.getByLabelText('انتخاب تصویر اصلی نوع حیوان').hasAttribute('required')).toBe(
      false,
    );
  });

  it('requires a replacement file when the API image value is empty', () => {
    render(
      <DirectionProvider direction="rtl">
        <Dialog open>
          <PetTypeDetailFormBody
            formRef={{ current: null }}
            handleSubmit={() => undefined}
            petType={{
              id: '507f1f77bcf86cd799439011',
              title: 'سگ',
              description: 'حیوان خانگی',
              mainImage: '   ',
            }}
          />
        </Dialog>
      </DirectionProvider>,
    );

    expect(screen.getByLabelText('انتخاب تصویر اصلی نوع حیوان').hasAttribute('required')).toBe(
      true,
    );
  });
});
