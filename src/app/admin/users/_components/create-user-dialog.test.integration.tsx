import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CreateUserDialog } from './create-user-dialog';

vi.mock('@/entities/users/users.client', () => ({
  useCreateUser: () => ({ formRef: { current: null }, handleSubmit: vi.fn(), isPending: false }),
}));

afterEach(cleanup);

describe('CreateUserDialog', () => {
  it('renders the required API fields and exposes schema validation errors', async () => {
    render(
      <DirectionProvider direction="rtl">
        <CreateUserDialog open onOpenChange={vi.fn()} onCreated={vi.fn()} />
      </DirectionProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'ایجاد کاربر جدید' })).toBeTruthy();
    expect(screen.getByLabelText('شماره موبایل')).toBeTruthy();
    expect(screen.getByLabelText('کلمه عبور')).toBeTruthy();
    expect(screen.getByLabelText('تکرار کلمه عبور')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'نقش' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'ایجاد کاربر' }));

    expect(await screen.findByText('شماره موبایل الزامی است.')).toBeTruthy();
    expect(screen.getByText('کلمه عبور الزامی است.')).toBeTruthy();
    expect(screen.getByText('تکرار کلمه عبور الزامی است.')).toBeTruthy();
    expect(screen.getByText('نقش کاربر الزامی است.')).toBeTruthy();
  });
});
