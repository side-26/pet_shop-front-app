import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginForm } from './login-form';

const clientMocks = vi.hoisted(() => ({
  formRef: { current: null },
  handleSubmit: vi.fn(),
}));

vi.mock('@/entities/auth/auth.client', () => ({
  useLoginUser: () => clientMocks,
}));

afterEach(cleanup);

describe('LoginForm', () => {
  beforeEach(() => {
    clientMocks.formRef.current = null;
    clientMocks.handleSubmit.mockReset();
  });

  it('submits through the client layer and exposes the shared loading state', async () => {
    clientMocks.handleSubmit.mockImplementation(() => new Promise<void>(() => undefined));
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText('شماره موبایل'), {
      target: { value: '09123456789' },
    });
    fireEvent.change(screen.getByLabelText('کلمه عبور'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'ورود' }));

    const loadingButton = await screen.findByRole('button', { name: /در حال ورود/ });
    await waitFor(() => expect(clientMocks.handleSubmit).toHaveBeenCalledOnce());
    expect(loadingButton.getAttribute('aria-busy')).toBe('true');
    expect(loadingButton.getAttribute('data-loading')).toBe('true');
    expect(loadingButton.className).toContain('tw:w-full');
  });
});
