import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { SelectField, selectFieldVariants } from './select-field';

type Values = { petType: string };

afterEach(cleanup);

describe('SelectField', () => {
  it('truncates long selected values while retaining the full accessible label and toggle control', () => {
    const label = 'A very long pet type name that must remain available to assistive technology';

    render(
      <Select items={[{ label, value: 'long-pet-type' }]} defaultValue="long-pet-type">
        <SelectTrigger aria-label={label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="long-pet-type">{label}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox', { name: label });
    const value = trigger.querySelector('[data-slot="select-value"]');
    const icon = trigger.querySelector('[data-slot="select-trigger-icon"]');
    expect(value?.className).toContain('tw:min-w-0');
    expect(value?.className).toContain('tw:flex-1');
    expect(value?.className).toContain('tw:truncate');
    expect(icon?.className).toContain('tw:shrink-0');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

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
