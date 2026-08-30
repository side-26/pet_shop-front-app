import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Form } from '@/components/ui/form';

import { ImageFileField, useImageFileField } from './image-file-field';
import { ImageFilePreview } from './image-file-preview';

type Values = { image: File | null };

const createObjectUrl = vi.fn(() => 'blob:pet-image');
const revokeObjectUrl = vi.fn();

beforeEach(() => {
  vi.stubGlobal('URL', { createObjectURL: createObjectUrl, revokeObjectURL: revokeObjectUrl });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function ImageControls() {
  const { deleteImageFile, imageFile } = useImageFileField();

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        deleteImageFile();
      }}
    >
      {imageFile ? 'حذف تصویر' : 'بدون تصویر'}
    </button>
  );
}

function renderImageField(avatar = false) {
  return render(
    <Form<Values> handleSubmit={vi.fn()} options={{ defaultValues: { image: null } }}>
      <ImageFileField<Values> name="image">
        <ImageFilePreview
          alt="پیش‌نمایش تصویر حیوان"
          avatar={avatar}
          fallback={<span>تصویری انتخاب نشده است</span>}
        />
        <ImageControls />
      </ImageFileField>
    </Form>,
  );
}

describe('ImageFileField', () => {
  it('shares the selected image file with the preview and revokes its temporary URL after deletion', async () => {
    renderImageField();

    const input = screen.getByLabelText('انتخاب فایل');
    const image = new File(['image'], 'dog.png', { type: 'image/png' });

    expect(input.getAttribute('accept')).toBe('image/jpeg,image/png,image/webp');
    expect(screen.getByText('تصویری انتخاب نشده است')).toBeTruthy();

    fireEvent.change(input, { target: { files: [image] } });

    const preview = await screen.findByRole('img', { name: 'پیش‌نمایش تصویر حیوان' });
    expect(preview.getAttribute('src')).toBe('blob:pet-image');
    expect(screen.getByRole('button', { name: 'حذف تصویر' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'حذف تصویر' }));

    await waitFor(() =>
      expect(screen.queryByRole('img', { name: 'پیش‌نمایش تصویر حیوان' })).toBeNull(),
    );
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:pet-image');
  });

  it('uses the shared Avatar primitive when avatar mode is requested', async () => {
    renderImageField(true);

    fireEvent.change(screen.getByLabelText('انتخاب فایل'), {
      target: { files: [new File(['image'], 'cat.webp', { type: 'image/webp' })] },
    });

    await waitFor(() => {
      expect(createObjectUrl).toHaveBeenCalled();
    });

    // AvatarImage renders its image after the browser load event. The selected
    // file is covered by the standard preview test above.
    expect(document.querySelector('[data-slot="avatar"]')).toBeTruthy();
  });
});
