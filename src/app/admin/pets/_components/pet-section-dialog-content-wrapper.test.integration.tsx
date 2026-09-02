import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Dialog } from '@/components/ui/dialog';

import { PetSectionDialogContentWrapper } from './pet-section-dialog-content-wrapper';

vi.mock('@/entities/pets/pets.client', () => ({
  useUpdatePetBaseInfo: () => ({
    formRef: { current: null },
    handleSubmit: vi.fn(),
    isPending: false,
  }),
  useUpdatePetImages: () => ({
    formRef: { current: null },
    handleSubmit: vi.fn(),
    isPending: false,
  }),
  useUpdatePetPrice: () => ({
    formRef: { current: null },
    handleSubmit: vi.fn(),
    isPending: false,
  }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  );
  vi.stubGlobal(
    'IntersectionObserver',
    class IntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

describe('PetSectionDialogContentWrapper', () => {
  it('uses the multiple-image uploader for a replacement image set', async () => {
    render(
      <DirectionProvider direction="rtl">
        <Dialog open>
          <PetSectionDialogContentWrapper
            petId="507f1f77bcf86cd799439011"
            petTitle="گربه پرشین"
            section="images"
            request={Promise.resolve({
              isSuccess: true,
              message: null,
              data: {
                mainImage: 'https://cdn.example.test/main.webp',
                mainImageThumbnail: 'data:image/webp;base64,AAAA',
                imagesList: ['https://cdn.example.test/one.webp'],
              },
            })}
            optionsRequest={Promise.resolve({
              isSuccess: true,
              message: null,
              data: { petTypes: [], breeds: [] },
            })}
            onClose={vi.fn()}
            onUpdated={vi.fn()}
          />
        </Dialog>
      </DirectionProvider>,
    );

    expect(await screen.findByRole('region', { name: 'تصاویر فعلی' })).toBeTruthy();
    expect(screen.getByAltText('تصویر اصلی فعلی').getAttribute('src')).toBe(
      'https://cdn.example.test/main.webp',
    );
    expect(screen.getByAltText('تصویر فعلی 1').getAttribute('src')).toBe(
      'https://cdn.example.test/one.webp',
    );
    const input = screen.getByLabelText('تصاویر جایگزین');
    const fieldset = input.closest('fieldset');
    expect((input as HTMLInputElement).multiple).toBe(true);
    expect(fieldset?.className).toContain('tw:w-full');
    expect(fieldset?.className).toContain('tw:min-w-0');
    expect(screen.getByText('0 از 5 تصویر')).toBeTruthy();
    expect(screen.queryByLabelText('جایگزینی تصویر اصلی حیوان')).toBeNull();
  });
});
