import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Form } from '@/components/ui/form';

import { AdditionalProperties } from './additional-properties';
import { AdditionalPropertiesField } from './additional-properties-field';

type Values = { properties: { label: string; value: string }[] };

describe('AdditionalProperties', () => {
  it('renders user-facing labels and values, including its empty state', () => {
    const { rerender } = render(
      <AdditionalProperties items={[{ label: 'رنگ', value: 'قهوه‌ای' }]} />,
    );

    expect(screen.getByRole('heading', { name: 'مشخصات بیشتر' })).toBeTruthy();
    expect(screen.getByText('رنگ')).toBeTruthy();
    expect(screen.getByText('قهوه‌ای')).toBeTruthy();

    rerender(<AdditionalProperties items={[]} />);
    expect(screen.getByText('مشخصاتی ثبت نشده است.')).toBeTruthy();
  });

  it('lets an administrator add and remove label/value records in a form', async () => {
    const submit = vi.fn();

    render(
      <Form<Values> handleSubmit={submit} options={{ defaultValues: { properties: [] } }}>
        <AdditionalPropertiesField<Values, 'properties'> name="properties" />
        <button type="submit">ثبت</button>
      </Form>,
    );

    const fieldset = screen.getByRole('group', { name: 'مشخصات بیشتر' });
    expect(Array.from(fieldset.children).some((child) => child.tagName === 'DIV')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'افزودن مشخصات' }));
    fireEvent.change(screen.getByLabelText('عنوان'), { target: { value: 'رنگ' } });
    fireEvent.change(screen.getByLabelText('مقدار'), { target: { value: 'قهوه‌ای' } });
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));

    await waitFor(() => {
      expect(submit).toHaveBeenCalledWith(
        { properties: [{ label: 'رنگ', value: 'قهوه‌ای' }] },
        expect.anything(),
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'حذف مشخصات 1' }));
    expect(screen.queryByLabelText('عنوان')).toBeNull();
  });
});
