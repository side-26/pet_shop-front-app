import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { APP_CURRENCY } from '@/configs/currency';

import { AnimatedPrice } from './animated-price';

afterEach(cleanup);

describe('AnimatedPrice', () => {
  it('keeps the Price contract while rendering each formatted digit in a rolling viewport', () => {
    const { rerender } = render(<AnimatedPrice number={125_000} aria-label="قیمت متحرک" />);

    const price = screen.getByLabelText('قیمت متحرک');
    expect(price.dataset.slot).toBe('animated-price');
    expect(price.textContent).toContain(APP_CURRENCY);
    expect(price.querySelector('bdi')?.getAttribute('dir')).toBe('ltr');
    expect(screen.getByLabelText('۱۲۵٬۰۰۰')).toBeTruthy();

    rerender(<AnimatedPrice number={980_000} aria-label="قیمت متحرک" />);
    expect(screen.getByLabelText('۹۸۰٬۰۰۰')).toBeTruthy();
  });

  it('renders a default or custom fallback instead of a malformed price', () => {
    const { rerender } = render(<AnimatedPrice aria-label="قیمت ناموجود" />);

    expect(screen.getByLabelText('قیمت ناموجود').textContent).toBe('-');

    rerender(<AnimatedPrice number={Number.NaN} emptyValue="نامشخص" aria-label="قیمت ناموجود" />);
    expect(screen.getByLabelText('قیمت ناموجود').textContent).toBe('نامشخص');
  });

  it('marks the rolling amount as busy while loading', () => {
    render(<AnimatedPrice isLoading aria-label="قیمت در حال دریافت" />);

    const price = screen.getByLabelText('قیمت در حال دریافت');
    expect(price.getAttribute('aria-busy')).toBe('true');
    expect(price.dataset.loading).toBe('true');
    expect(screen.getByLabelText('در حال دریافت قیمت')).toBeTruthy();
  });
});
