import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InputOtpField, inputOtpFieldVariants } from '@/components/ui/fields/input-otp-field';
import { inputOtpSlotVariants } from '@/components/ui/input-otp';
import { Form } from '@/components/ui/form';

type Values = { code: string };

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('InputOtpField', () => {
  it('maps semantic color and size to slots and field typography', () => {
    expect(inputOtpSlotVariants({ color: 'success', size: 'xl' })).toContain(
      'tw:border-success/55',
    );
    expect(inputOtpSlotVariants({ color: 'success', size: 'xl' })).toContain('tw:size-12');
    expect(inputOtpSlotVariants({ color: 'success', size: 'xl' })).toContain('tw:text-base');
    expect(inputOtpFieldVariants({ size: 'xl' }).label()).toContain('tw:text-label-l');
    expect(inputOtpFieldVariants({ size: 'xl' }).description()).toContain('tw:text-[13px]/[1.6]');
  });

  it('validates, fires onFinished, and submits its value through the Form wrapper', async () => {
    const onFinished = vi.fn();
    const onSubmit = vi.fn();

    render(
      <Form<Values>
        options={{ defaultValues: { code: '' }, shouldFocusError: false }}
        handleSubmit={onSubmit}
      >
        <InputOtpField<Values>
          name="code"
          label="Verification code"
          hint="Enter six digits"
          rules={{
            required: 'Code is required',
            validate: (value) => value.length === 6 || 'Code must contain six digits',
          }}
          onFinished={onFinished}
          submitOnFinished
        />
        <button type="submit">Verify</button>
      </Form>,
    );

    const input = screen.getByLabelText('Verification code');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
    expect(screen.getByText('Enter six digits')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Code is required');
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '123456' } });

    await waitFor(() => expect(onFinished).toHaveBeenCalledWith('123456'));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ code: '123456' }, expect.anything()),
    );
  });
});
