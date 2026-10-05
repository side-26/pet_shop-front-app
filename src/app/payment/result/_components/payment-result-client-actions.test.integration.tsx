import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PaymentResultClientActions } from './payment-result-client-actions';

const replace = vi.fn();

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ replace }) }));
vi.mock('@/entities/users/users.actions', () => ({
  emptyCartAction: vi.fn().mockResolvedValue({ isSuccess: true }),
}));
vi.mock('@/hooks/use-prevent-page-leave', () => ({ usePreventPageLeave: vi.fn() }));
vi.mock('@/stores/cart.store', () => ({
  useCartStore: (selector: (state: { clearCart: () => void }) => unknown) =>
    selector({ clearCart: vi.fn() }),
}));

describe('PaymentResultClientActions', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', { randomUUID: () => 'test-idempotency-key' });
  });

  it('keeps the countdown outside a paragraph to preserve valid HTML', async () => {
    render(<PaymentResultClientActions isSuccess />);

    await act(async () => {});

    const timer = screen.getByRole('timer');
    expect(timer.closest('p')).toBeNull();
    expect(timer.parentElement?.tagName).toBe('DIV');
  });
});
