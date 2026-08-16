import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from '@/components/ui/form';
import { TextField, textFieldVariants } from '@/components/ui/fields/text-field';

type Values = { password: string };

afterEach(cleanup);

describe('TextField', () => {
  it('keeps the password icon smaller than its inset toggle target', () => {
    const small = textFieldVariants({ size: 'xs' });
    const large = textFieldVariants({ size: 'xl' });

    expect(small.toggle()).toContain('tw:end-1.5');
    expect(small.toggle()).toContain('tw:size-5');
    expect(small.toggle()).toContain('tw:[&_svg]:size-3');
    expect(large.toggle()).toContain('tw:end-2');
    expect(large.toggle()).toContain('tw:size-10');
    expect(large.toggle()).toContain('tw:[&_svg]:size-5');
    expect(large.inputWrap()).toContain('tw:[&_input]:pe-14');
  });

  it('caps description typography and tightens only the control-to-message gap', () => {
    const small = textFieldVariants({ size: 'xs' });
    const large = textFieldVariants({ size: 'xl' });

    expect(small.label()).toContain('tw:text-label-s');
    expect(small.description()).toContain('tw:text-xs');
    expect(small.description()).toContain('tw:-mt-0.5');
    expect(large.label()).toContain('tw:text-label-l');
    expect(large.description()).toContain('tw:text-[13px]/[1.6]');
    expect(large.description()).toContain('tw:-mt-1.5');
  });

  it('syncs with Form context, keeps description mounted, and propagates visual state', async () => {
    const onSubmit = vi.fn();
    render(
      <Form<Values> handleSubmit={onSubmit} options={{ defaultValues: { password: '' } }}>
        <TextField<Values>
          name="password"
          label="کلمه عبور"
          hint="حداقل هشت نویسه"
          type="password"
          color="warning"
          size="xl"
          rules={{ required: 'کلمه عبور الزامی است.' }}
        />
        <button type="submit">ثبت</button>
      </Form>,
    );

    const input = screen.getByLabelText('کلمه عبور');
    expect(input.getAttribute('data-color')).toBe('warning');
    expect(input.getAttribute('data-size')).toBe('xl');
    expect(screen.getByText('حداقل هشت نویسه')).toBeTruthy();

    fireEvent.change(input, { target: { value: 'secret-value' } });
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ password: 'secret-value' }, expect.anything()),
    );
  });

  it('shows schema/rule errors in the persistent description and toggles password visibility', async () => {
    render(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: { password: '' } }}>
        <TextField<Values>
          name="password"
          label="Password"
          hint="Hint"
          type="password"
          rules={{ required: 'Required password' }}
        />
        <button type="submit">Submit</button>
      </Form>,
    );

    const input = screen.getByLabelText('Password');
    expect(input.getAttribute('type')).toBe('password');
    fireEvent.click(screen.getByRole('button', { name: 'نمایش کلمه عبور' }));
    expect(input.getAttribute('type')).toBe('text');
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Required password');
  });
});
