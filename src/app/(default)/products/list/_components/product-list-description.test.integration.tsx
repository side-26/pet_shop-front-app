import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ProductListDescription } from './product-list-description';

class ResizeObserverMock {
  observe() {}
  disconnect() {}
}

const originalResizeObserver = globalThis.ResizeObserver;

beforeEach(() => {
  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    value: ResizeObserverMock,
  });
});

afterEach(() => {
  cleanup();
  Object.defineProperty(globalThis, 'ResizeObserver', {
    configurable: true,
    value: originalResizeObserver,
  });
});

describe('ProductListDescription', () => {
  it('renders the store description in an expandable card', () => {
    render(<ProductListDescription />);

    expect(screen.getByRole('heading', { name: 'خرید آنلاین محصولات حیوانات خانگی' })).toBeTruthy();
    expect(screen.getByText(/پت شاپ پرشین، فروشگاه اینترنتی تخصصی/)).toBeTruthy();

    const trigger = screen.getByRole('button', { name: 'مشاهده بیشتر' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'مشاهده کمتر' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
  });
});
