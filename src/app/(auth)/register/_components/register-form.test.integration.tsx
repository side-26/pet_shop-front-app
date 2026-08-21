import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterForm } from './register-form';

const clientMocks = vi.hoisted(() => ({
  formRef: { current: null },
  handleSubmit: vi.fn(),
}));

vi.mock('@/entities/auth/auth.client', () => ({
  useRegisterUser: () => clientMocks,
}));

afterEach(cleanup);

describe('RegisterForm', () => {
  beforeEach(() => {
    clientMocks.formRef.current = null;
    clientMocks.handleSubmit.mockReset();
  });

  it('renders an active loading state instead of disabling the submit button', async () => {
    clientMocks.handleSubmit.mockImplementation(() => new Promise<void>(() => undefined));
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText('شماره موبایل'), {
      target: { value: '09123456789' },
    });
    fireEvent.change(screen.getByLabelText('کلمه عبور'), {
      target: { value: '12345678' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'ثبت‌نام' }));

    const loadingButton = await screen.findByRole('button', { name: /در حال ثبت‌نام/ });
    await waitFor(() => expect(clientMocks.handleSubmit).toHaveBeenCalledOnce());
    expect(loadingButton.getAttribute('aria-busy')).toBe('true');
    expect(loadingButton.hasAttribute('disabled')).toBe(false);
    expect(loadingButton.getAttribute('data-loading')).toBe('true');
    expect(loadingButton.className).toContain('tw:w-full');
  });
});
