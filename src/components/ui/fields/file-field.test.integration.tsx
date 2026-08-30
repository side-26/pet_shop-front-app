import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { FileField, toAcceptAttribute } from './file-field';

type Values = { image: File | null };

afterEach(cleanup);

describe('FileField', () => {
  it('converts accepted types, keeps the preview inside a click-friendly wrapper, and stores the selected file', () => {
    render(
      <Form<Values> handleSubmit={vi.fn()} options={{ defaultValues: { image: null } }}>
        <FileField<Values>
          name="image"
          acceptTypes={['image/jpeg', ' image/png ', 'image/webp']}
          hint="JPEG، PNG یا WebP"
        >
          {(file) => <span>{file?.name ?? 'پیش‌نمایش تصویر'}</span>}
        </FileField>
      </Form>,
    );

    const input = screen.getByLabelText('انتخاب فایل') as HTMLInputElement;
    const wrapper = input.closest('label');
    const file = new File(['image'], 'dog.png', { type: 'image/png' });

    expect(input.accept).toBe('image/jpeg,image/png,image/webp');
    expect(wrapper?.className).toContain('cursor-pointer');
    expect(screen.getByText('JPEG، PNG یا WebP')).toBeTruthy();

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('dog.png')).toBeTruthy();
  });

  it('renders only hint or validation feedback and presents validation feedback as an error', async () => {
    render(
      <Form<Values> handleSubmit={vi.fn()} options={{ defaultValues: { image: null } }}>
        <FileField<Values>
          name="image"
          acceptTypes={['image/*']}
          rules={{ required: 'انتخاب تصویر الزامی است.' }}
        >
          {() => <span>پیش‌نمایش تصویر</span>}
        </FileField>
        <Button type="submit">ارسال</Button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'ارسال' }));

    expect((await screen.findByRole('alert')).textContent).toBe('انتخاب تصویر الزامی است.');
    expect(screen.getByLabelText('انتخاب فایل').getAttribute('aria-invalid')).toBe('true');
  });

  it('normalizes an accept-type list without empty entries', () => {
    expect(toAcceptAttribute([' image/jpeg ', '', 'image/png'])).toBe('image/jpeg,image/png');
  });
});
