import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from '@/components/ui/form';

import { BadgeGroupField } from './badge-group-field';

type Values = { tags: { title: string }[] };

afterEach(cleanup);

describe('BadgeGroupField', () => {
  it('adds, edits, removes, and submits editable badges through Form context', async () => {
    const onSubmit = vi.fn();
    render(
      <Form<Values>
        handleSubmit={onSubmit}
        options={{ defaultValues: { tags: [{ title: 'سگ' }] } }}
      >
        <BadgeGroupField<Values> name="tags" label="برچسب‌ها" hint="حداکثر بیست برچسب وارد کنید." />
        <button type="submit">ثبت</button>
      </Form>,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'برچسب‌ها' }), {
      target: { value: 'تغذیه' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'افزودن' }));
    fireEvent.click(screen.getByRole('button', { name: 'حذف برچسب سگ' }));
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ tags: [{ title: 'تغذیه' }] }, expect.anything()),
    );
    expect(screen.getByText('حداکثر بیست برچسب وارد کنید.')).toBeTruthy();
  });

  it('renders optional labels and exposes validation feedback below the badges', async () => {
    render(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: { tags: [] } }}>
        <BadgeGroupField<Values>
          name="tags"
          rules={{
            validate: (value) =>
              (Array.isArray(value) && value.length > 0) || 'حداقل یک برچسب وارد کنید.',
          }}
        />
        <button type="submit">ثبت</button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));

    expect((await screen.findByRole('alert')).textContent).toBe('حداقل یک برچسب وارد کنید.');
    expect(screen.queryByText('برچسب‌ها')).toBeNull();
  });
});
