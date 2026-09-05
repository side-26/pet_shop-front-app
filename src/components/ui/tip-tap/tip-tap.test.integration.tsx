import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  TipTapHeaderActions,
  TipTapHeadingAction,
  TipTapImageUploadAction,
  TipTapListAction,
  TipTapTextAlignAction,
  TipTapTextDirectionAction,
} from './index';
import { tipTapTextAlignments, tipTapTextDirections, tipTapTypographyClassName } from './plugins';
import { TipTap, tipTapVariants } from './tip-tap';

afterEach(cleanup);

beforeAll(() => {
  Object.defineProperties(Range.prototype, {
    getBoundingClientRect: {
      configurable: true,
      value: () => new DOMRect(),
    },
    getClientRects: {
      configurable: true,
      value: () => [],
    },
  });
});

describe('TipTap', () => {
  it('renders an SSR-safe, labelled editable surface', async () => {
    render(<TipTap ariaLabel="توضیحات محصول" content="<p>غذای مناسب برای گربه‌های بالغ</p>" />);

    const editor = await screen.findByRole('textbox', { name: 'توضیحات محصول' });

    expect(editor.getAttribute('contenteditable')).toBe('true');
    expect(editor.textContent).toContain('غذای مناسب برای گربه‌های بالغ');
  });

  it('exposes the requested semantic container variants', () => {
    expect(tipTapVariants({ color: 'success', variant: 'tonal' })).toContain('tw:bg-success-muted');
    expect(tipTapVariants({ color: 'error', variant: 'outlined' })).toContain('tw:border-error');
    expect(tipTapVariants({ color: 'secondary', variant: 'fill' })).toContain('tw:bg-secondary');
  });

  it('configures alignment, automatic direction, and project typography', async () => {
    render(
      <TipTap
        ariaLabel="توضیحات راست‌به‌چپ"
        content={'<h1>عنوان</h1><p style="text-align: center">متن</p><ul><li>مورد</li></ul>'}
      />,
    );

    const editor = await screen.findByRole('textbox', { name: 'توضیحات راست‌به‌چپ' });

    expect(editor.getAttribute('dir')).toBe('auto');
    expect(editor.querySelector('p')?.style.textAlign).toBe('center');
    expect(tipTapTextAlignments).toEqual(['left', 'center', 'right']);
    expect(tipTapTextDirections).toEqual(['auto', 'rtl', 'ltr']);
    expect(tipTapTypographyClassName).toContain('tw:[&_h1]:text-heading-1');
    expect(tipTapTypographyClassName).toContain('tw:[&_ul]:ps-6');
  });

  it('renders only the requested header actions and applies alignment', async () => {
    render(
      <TipTap
        ariaLabel="توضیحات با ابزار تراز"
        content="<p>متن قابل تراز</p>"
        headerActions={
          <TipTapHeaderActions>
            <TipTapTextAlignAction />
          </TipTapHeaderActions>
        }
      />,
    );

    const editor = await screen.findByRole('textbox', { name: 'توضیحات با ابزار تراز' });

    expect(screen.getByRole('toolbar', { name: 'ابزارهای ویرایش متن' })).toBeTruthy();
    const alignmentSelect = screen.getByRole('combobox', { name: 'تراز متن' });
    expect(alignmentSelect).toBeTruthy();
    expect(alignmentSelect.querySelector('[data-slot="select-trigger-prefix-icon"]')).toBeTruthy();
    expect(screen.queryByRole('combobox', { name: 'سطح متن' })).toBeNull();

    fireEvent.click(alignmentSelect);
    const centeredOption = await screen.findByRole('option', { name: 'تراز وسط' });
    fireEvent.pointerDown(centeredOption, { button: 0 });
    fireEvent.pointerUp(centeredOption, { button: 0 });
    fireEvent.click(centeredOption);
    expect(editor.querySelector('p')?.style.textAlign).toBe('center');
  });

  it('applies heading and direction commands from their requested action groups', async () => {
    render(
      <TipTap
        ariaLabel="توضیحات با ابزارهای کامل"
        content="<p>متن قابل ویرایش</p>"
        headerActions={
          <TipTapHeaderActions>
            <TipTapHeadingAction />
            <TipTapTextDirectionAction />
          </TipTapHeaderActions>
        }
      />,
    );

    const editor = await screen.findByRole('textbox', { name: 'توضیحات با ابزارهای کامل' });

    fireEvent.click(screen.getByRole('combobox', { name: 'سطح متن' }));
    const headingOption = await screen.findByRole('option', { name: 'عنوان ۱' });
    fireEvent.pointerDown(headingOption, { button: 0 });
    fireEvent.pointerUp(headingOption, { button: 0 });
    fireEvent.click(headingOption);
    expect(editor.querySelector('h1')?.textContent).toBe('متن قابل ویرایش');

    fireEvent.click(screen.getByRole('combobox', { name: 'جهت متن' }));
    const rtlOption = await screen.findByRole('option', { name: 'راست‌به‌چپ' });
    fireEvent.pointerDown(rtlOption, { button: 0 });
    fireEvent.pointerUp(rtlOption, { button: 0 });
    fireEvent.click(rtlOption);
    expect(editor.querySelector('h1')?.getAttribute('dir')).toBe('rtl');
  });

  it('applies list choices and inserts an uploaded image URL', async () => {
    const onUpload = vi.fn().mockResolvedValue('https://cdn.example.com/pet.jpg');
    render(
      <TipTap
        ariaLabel="توضیحات با فهرست و تصویر"
        content="<p>متن قابل ویرایش</p>"
        headerActions={
          <TipTapHeaderActions>
            <TipTapListAction />
            <TipTapImageUploadAction onUpload={onUpload} />
          </TipTapHeaderActions>
        }
      />,
    );

    const editor = await screen.findByRole('textbox', { name: 'توضیحات با فهرست و تصویر' });
    fireEvent.click(screen.getByRole('combobox', { name: 'نوع فهرست' }));
    const orderedOption = await screen.findByRole('option', { name: 'فهرست شماره‌دار' });
    fireEvent.pointerDown(orderedOption, { button: 0 });
    fireEvent.pointerUp(orderedOption, { button: 0 });
    fireEvent.click(orderedOption);
    expect(editor.querySelector('ol')).toBeTruthy();

    const file = new File(['image'], 'pet.jpg', { type: 'image/jpeg' });
    const imageInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    expect(imageInput).toBeTruthy();
    fireEvent.change(imageInput!, {
      target: { files: [file] },
    });
    await waitFor(() => expect(onUpload).toHaveBeenCalledWith(file));
    expect(editor.querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example.com/pet.jpg',
    );
  });
});
