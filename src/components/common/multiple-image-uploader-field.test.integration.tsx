import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  MultipleImageUploaderField,
  type MultipleImageUploaderValue,
} from './multiple-image-uploader-field';

type Values = { gallery: MultipleImageUploaderValue };

function image(name: string, type = 'image/png') {
  return new File([name], name, { type, lastModified: name.length });
}

beforeEach(() => {
  vi.stubGlobal('URL', {
    ...URL,
    createObjectURL: vi.fn((file: File) => `blob:${file.name}`),
    revokeObjectURL: vi.fn(),
  });
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

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('MultipleImageUploaderField', () => {
  it('shows persisted image URLs as read-only while keeping newly uploaded files editable', () => {
    render(
      <Form<Values>
        handleSubmit={vi.fn()}
        options={{ defaultValues: { gallery: { images: [], mainImageIndex: null } } }}
      >
        <MultipleImageUploaderField<Values>
          name="gallery"
          mainImageUrl="https://cdn.example.test/main.webp"
          defaultImages={[
            'https://cdn.example.test/main.webp',
            'https://cdn.example.test/one.webp',
            'https://cdn.example.test/two.webp',
          ]}
        />
      </Form>,
    );

    expect(screen.getByRole('region', { name: 'تصاویر فعلی' })).toBeTruthy();
    expect(screen.getByAltText('تصویر اصلی فعلی').getAttribute('src')).toBe(
      'https://cdn.example.test/main.webp',
    );
    expect(screen.getByAltText('تصویر فعلی 1').getAttribute('src')).toBe(
      'https://cdn.example.test/one.webp',
    );
    expect(screen.getByAltText('تصویر فعلی 2').getAttribute('src')).toBe(
      'https://cdn.example.test/two.webp',
    );
    expect(
      screen.getByAltText('تصویر اصلی فعلی').closest('[data-slot="carousel-item"]')?.className,
    ).toContain('tw:basis-[100px]');
    expect(screen.getByLabelText('تصاویر').closest('[data-slot="field"]')?.className).toContain(
      'tw:w-full',
    );
    expect(screen.getByLabelText('تصاویر').closest('[data-slot="field"]')?.className).toContain(
      'tw:overflow-x-hidden',
    );
    const mainImageStar = screen
      .getByAltText('تصویر اصلی فعلی')
      .parentElement?.querySelector('svg');
    expect(mainImageStar?.getAttribute('class')).toContain('tw:fill-primary');
    expect(screen.queryByText('تصویر اصلی')).toBeNull();
    expect(screen.queryByRole('button', { name: /حذف/i })).toBeNull();
    expect(screen.getByRole('button', { name: 'انتخاب تصویر' })).toBeTruthy();
  });

  it('accepts batch and incremental selection, removes duplicates, and enforces the default limit', () => {
    render(
      <Form<Values>
        handleSubmit={vi.fn()}
        options={{ defaultValues: { gallery: { images: [], mainImageIndex: null } } }}
      >
        <MultipleImageUploaderField<Values> name="gallery" hint="PNG، JPEG یا WebP" />
      </Form>,
    );

    const input = screen.getByLabelText('تصاویر') as HTMLInputElement;
    const firstBatch = [image('one.png'), image('two.png'), image('three.png')];

    expect(input.multiple).toBe(true);
    expect(input.accept).toBe('image/jpeg,image/png,image/webp');
    fireEvent.change(input, { target: { files: firstBatch } });
    fireEvent.change(input, {
      target: { files: [firstBatch[0], image('four.png'), image('five.png'), image('six.png')] },
    });

    expect(screen.getByText('5 از 5 تصویر')).toBeTruthy();
    expect(screen.getByText('five.png')).toBeTruthy();
    expect(screen.queryByText('six.png')).toBeNull();
    expect(
      (screen.getByRole('button', { name: 'انتخاب تصویر' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('never allows more than five files when a larger limit is requested', () => {
    render(
      <Form<Values>
        handleSubmit={vi.fn()}
        options={{ defaultValues: { gallery: { images: [], mainImageIndex: null } } }}
      >
        <MultipleImageUploaderField<Values> name="gallery" maxImages={10} />
      </Form>,
    );

    fireEvent.change(screen.getByLabelText('تصاویر'), {
      target: { files: ['one', 'two', 'three', 'four', 'five', 'six'].map((name) => image(name)) },
    });

    expect(screen.getByText('5 از 5 تصویر')).toBeTruthy();
    expect(screen.queryByText('six')).toBeNull();
  });

  it('uses wide carousel slides with room for image actions', () => {
    render(
      <Form<Values>
        handleSubmit={vi.fn()}
        options={{ defaultValues: { gallery: { images: [image('one.png')], mainImageIndex: 0 } } }}
      >
        <MultipleImageUploaderField<Values> name="gallery" />
      </Form>,
    );

    expect(screen.getByRole('region', { name: 'تصاویر انتخاب‌شده به‌صورت اسلایدی' })).toBeTruthy();
    expect(screen.getByText('one.png').closest('[data-slot="carousel-item"]')?.className).toContain(
      'tw:basis-[160px]',
    );
  });

  it('owns main-image selection and keeps it valid after deletion', () => {
    const files = [image('one.png'), image('two.png'), image('three.png')];

    render(
      <Form<Values>
        handleSubmit={vi.fn()}
        options={{ defaultValues: { gallery: { images: files, mainImageIndex: 0 } } }}
      >
        <MultipleImageUploaderField<Values> name="gallery" />
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'انتخاب three.png به‌عنوان تصویر اصلی' }));

    expect(
      screen
        .getByRole('button', { name: 'انتخاب three.png به‌عنوان تصویر اصلی' })
        .getAttribute('aria-pressed'),
    ).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'حذف three.png' }));

    expect(screen.queryByText('three.png')).toBeNull();
    expect(
      screen
        .getByRole('button', { name: 'انتخاب one.png به‌عنوان تصویر اصلی' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('submits a single selected image with that image set as the main image', async () => {
    const handleSubmit = vi.fn();

    render(
      <Form<Values>
        handleSubmit={handleSubmit}
        options={{ defaultValues: { gallery: { images: [], mainImageIndex: null } } }}
      >
        <MultipleImageUploaderField<Values> name="gallery" />
        <Button type="submit">ثبت</Button>
      </Form>,
    );

    const mainImage = image('main.png');
    fireEvent.change(screen.getByLabelText('تصاویر'), { target: { files: [mainImage] } });
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          gallery: { images: [mainImage], mainImageIndex: 0 },
        }),
        expect.anything(),
      ),
    );
  });

  it('submits its complete value without outside orchestration', async () => {
    const handleSubmit = vi.fn();

    render(
      <Form<Values>
        handleSubmit={handleSubmit}
        options={{ defaultValues: { gallery: { images: [], mainImageIndex: null } } }}
      >
        <MultipleImageUploaderField<Values> name="gallery" maxImages={2} />
        <Button type="submit">ثبت</Button>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText('تصاویر'), {
      target: { files: [image('one.png'), image('two.png')] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'انتخاب two.png به‌عنوان تصویر اصلی' }));
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          gallery: expect.objectContaining({ mainImageIndex: 1 }),
        }),
        expect.anything(),
      ),
    );
  });
});
