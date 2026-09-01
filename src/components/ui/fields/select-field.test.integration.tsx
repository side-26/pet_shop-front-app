import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from '@/components/ui/form';

import { SelectField, selectFieldVariants } from './select-field';

type Values = { petType: string };

afterEach(cleanup);

describe('SelectField', () => {
  it('uses the same label and description typography scale as TextField', () => {
    const small = selectFieldVariants({ size: 'xs' });
    const large = selectFieldVariants({ size: 'xl' });

    expect(small.label()).toContain('tw:text-label-s');
    expect(small.description()).toContain('tw:text-xs');
    expect(large.label()).toContain('tw:text-label-l');
    expect(large.description()).toContain('tw:text-[13px]/[1.6]');
  });

  it('connects the selected value to Form context and submits it', async () => {
    const onSubmit = vi.fn();
    render(
      <Form<Values> handleSubmit={onSubmit} options={{ defaultValues: { petType: '' } }}>
        <SelectField<Values>
          name="petType"
          label="نوع حیوان"
          hint="نوع حیوان را انتخاب کنید."
          options={[
            { value: 'dog', label: 'سگ' },
            { value: 'cat', label: 'گربه' },
          ]}
        />
        <button type="submit">ثبت</button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('combobox', { name: 'نوع حیوان' }));
    const option = await screen.findByRole('option', { name: 'گربه' });
    fireEvent.pointerDown(option, { button: 0 });
    fireEvent.pointerUp(option, { button: 0 });
    fireEvent.click(option);
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ petType: 'cat' }, expect.anything()),
    );
    expect(screen.getByText('نوع حیوان را انتخاب کنید.')).toBeTruthy();
  });

  it('exposes validation errors through the persistent description', async () => {
    render(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: { petType: '' } }}>
        <SelectField<Values>
          name="petType"
          label="نوع حیوان"
          hint="نوع حیوان را انتخاب کنید."
          rules={{ required: 'انتخاب نوع حیوان الزامی است.' }}
          options={[{ value: 'dog', label: 'سگ' }]}
        />
        <button type="submit">ثبت</button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));

    expect((await screen.findByRole('alert')).textContent).toBe('انتخاب نوع حیوان الزامی است.');
    expect(screen.getByRole('combobox', { name: 'نوع حیوان' }).getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('shows an empty-state message when there are no options', async () => {
    render(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: { petType: '' } }}>
        <SelectField<Values> name="petType" label="نوع حیوان" options={[]} />
      </Form>,
    );

    fireEvent.click(screen.getByRole('combobox', { name: 'نوع حیوان' }));
    expect((await screen.findByRole('status')).textContent).toBe(
      'گزینه‌ای برای انتخاب وجود ندارد.',
    );
  });
});
