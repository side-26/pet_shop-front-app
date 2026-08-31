import { createRef } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { object, string, type ObjectSchema } from 'yup';

import { Form, type FormHandle } from '@/components/ui/form';
import '@/configs/yup.config';

type Values = { name: string };

const schema: ObjectSchema<Values> = object({
  name: string().required(),
});

describe('Form', () => {
  it('validates with schema, submits typed values, and exposes all methods through ref', async () => {
    const ref = createRef<FormHandle<Values>>();
    const onSubmit = vi.fn();

    render(
      <Form<Values>
        ref={ref}
        validationSchema={schema}
        options={{ defaultValues: { name: '' } }}
        handleSubmit={onSubmit}
      >
        {({ formState: { errors }, register }) => (
          <>
            <input aria-label="Name" {...register('name')} />
            {errors.name && <p role="alert">{errors.name.message}</p>}
            <button type="submit">Save</button>
          </>
        )}
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect((await screen.findByRole('alert')).textContent).toBe('نام الزامی است.');
    expect(onSubmit).not.toHaveBeenCalled();

    act(() => ref.current?.setValue('name', 'Misha', { shouldValidate: true }));
    expect(ref.current?.getValues('name')).toBe('Misha');
    expect(typeof ref.current?.reset).toBe('function');
    expect(typeof ref.current?.trigger).toBe('function');

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Misha' }, expect.anything()),
    );
  });
});
