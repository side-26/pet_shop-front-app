import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from '@/components/ui/form';
import { TextareaField, textareaFieldVariants } from '@/components/ui/fields/textarea-field';

type Values = { notes: string };

afterEach(cleanup);

describe('TextareaField', () => {
  it('syncs with Form and updates its bottom-left character counter', async () => {
    const onSubmit = vi.fn();
    render(
      <Form<Values> handleSubmit={onSubmit} options={{ defaultValues: { notes: '' } }}>
        <TextareaField<Values>
          name="notes"
          label="یادداشت"
          hint="توضیحات تکمیلی"
          color="info"
          size="lg"
          counter
          maxLength={20}
        />
        <button type="submit">ثبت</button>
      </Form>,
    );

    const textarea = screen.getByLabelText('یادداشت');
    expect(textarea.getAttribute('data-color')).toBe('info');
    expect(textarea.getAttribute('data-size')).toBe('lg');
    expect(screen.getByText('0 / 20')).toBeTruthy();
    fireEvent.change(textarea, { target: { value: 'میشا' } });
    expect(screen.getByText('4 / 20')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ notes: 'میشا' }, expect.anything()),
    );
  });

  it('keeps counter physically left and exposes form errors in the persistent description', async () => {
    const large = textareaFieldVariants({ size: 'xl' });

    expect(large.counter()).toContain('tw:left-3');
    expect(large.label()).toContain('tw:text-label-l');
    expect(large.description()).toContain('tw:text-[13px]/[1.6]');
    expect(large.description()).toContain('tw:-mt-1.5');
    render(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: { notes: '' } }}>
        <TextareaField<Values>
          name="notes"
          label="Notes"
          hint="Hint"
          counter
          rules={{ required: 'Notes are required' }}
        />
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Notes are required');
    expect(screen.getByText('0')).toBeTruthy();
  });
});
