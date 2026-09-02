import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Dialog } from '@/components/ui/dialog';

import { FormDialogContent } from './form-dialog-content';

afterEach(cleanup);

function renderContent(props: Partial<React.ComponentProps<typeof FormDialogContent>> = {}) {
  const onClose = props.onClose ?? vi.fn();

  render(
    <DirectionProvider direction="rtl">
      <Dialog open>
        <FormDialogContent title="ثبت آدرس" onClose={onClose} {...props}>
          <form id="address-form">فرم آدرس</form>
        </FormDialogContent>
      </Dialog>
    </DirectionProvider>,
  );

  return { onClose };
}

describe('FormDialogContent', () => {
  it('composes an accessible dialog, card, form content, and equal-width actions', () => {
    const { onClose } = renderContent({
      contentClassName: 'custom-content-class',
      formId: 'address-form',
      submitText: 'ثبت',
    });

    expect(screen.getByRole('dialog', { name: 'ثبت آدرس' })).toBeTruthy();
    const formContent = screen.getByText('فرم آدرس').closest('[data-slot="card-content"]');
    expect(formContent?.className).toContain('custom-content-class');

    const submit = screen.getByRole('button', { name: 'ثبت' });
    expect(submit.getAttribute('type')).toBe('submit');
    expect(submit.getAttribute('form')).toBe('address-form');
    expect(submit.getAttribute('data-variant')).toBe('fill');
    expect(submit.getAttribute('data-color')).toBe('primary');
    expect(submit.getAttribute('data-block')).toBe('true');

    const cancel = screen.getByRole('button', { name: 'انصراف' });
    expect(cancel.getAttribute('data-variant')).toBe('outlined');
    expect(cancel.getAttribute('data-color')).toBe('error');
    expect(cancel.getAttribute('data-block')).toBe('true');
    fireEvent.click(cancel);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('shows a distinct loading label and locks dialog actions while loading', () => {
    renderContent({ isLoading: true });

    const submit = screen.getByRole('button', { name: 'در حال ذخیره...' });
    expect(submit.getAttribute('aria-busy')).toBe('true');
    expect(submit).toHaveProperty('disabled', true);
    expect(submit.hasAttribute('form')).toBe(false);
    expect(screen.getByRole('button', { name: 'انصراف' })).toHaveProperty('disabled', true);
  });
});
