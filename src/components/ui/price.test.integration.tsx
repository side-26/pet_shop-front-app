import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { APP_CURRENCY } from '@/configs/currency';
import { Price } from '@/components/ui/price';

afterEach(cleanup);

describe('Price', () => {
  it('formats grouped Persian numbers and always renders the application currency after the value', () => {
    const { rerender } = render(<Price number={1250000} />);

    expect(screen.getByText('۱٬۲۵۰٬۰۰۰')).toBeTruthy();
    expect(screen.getByText(APP_CURRENCY)).toBeTruthy();

    rerender(<Price number={980000} />);
    expect(screen.getByText('۹۸۰٬۰۰۰')).toBeTruthy();
    expect(screen.getByText(APP_CURRENCY)).toBeTruthy();
  });

  it('isolates the number and accepts a custom class name', () => {
    render(<Price number={49.99} className="custom-price" aria-label="price" />);

    const price = screen.getByLabelText('price');
    expect(price.className).toContain('custom-price');
    expect(price.textContent).toBe(`۴۹٫۹۹${APP_CURRENCY}`);
    expect(price.querySelector('bdi')?.getAttribute('dir')).toBe('ltr');
  });
});
