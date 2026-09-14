import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PetListDescription } from './pet-list-description';

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

describe('PetListDescription', () => {
  it('renders SEO copy in an accessible expandable card', () => {
    render(<PetListDescription />);

    expect(
      screen.getByRole('heading', { name: 'راهنمای انتخاب و خرید حیوانات خانگی' }),
    ).toBeTruthy();
    expect(
      screen.getByText(/در پت شاپ پرشین می‌توانید انواع حیوانات خانگی را بر اساس نوع، نژاد، سن/),
    ).toBeTruthy();

    const trigger = screen.getByRole('button', { name: 'مشاهده بیشتر' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'مشاهده کمتر' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
  });
});
