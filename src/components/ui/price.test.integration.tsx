import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Price } from '@/components/ui/price';

afterEach(cleanup);

describe('Price', () => {
  it('formats grouped Persian numbers and renders rial or toman after the value', () => {
    const { rerender } = render(<Price number={1250000} prefix="تومان" />);

    expect(screen.getByText('۱٬۲۵۰٬۰۰۰')).toBeTruthy();
    expect(screen.getByText('تومان')).toBeTruthy();

    rerender(<Price number={980000} prefix="ریال" />);
    expect(screen.getByText('۹۸۰٬۰۰۰')).toBeTruthy();
    expect(screen.getByText('ریال')).toBeTruthy();
  });

  it('renders the dollar symbol before the isolated number and accepts a custom class name', () => {
    render(<Price number={49.99} prefix="$" className="custom-price" aria-label="price" />);

    const price = screen.getByLabelText('price');
    expect(price.className).toContain('custom-price');
    expect(price.textContent).toBe('$۴۹٫۹۹');
    expect(price.querySelector('bdi')?.getAttribute('dir')).toBe('ltr');
  });
});
