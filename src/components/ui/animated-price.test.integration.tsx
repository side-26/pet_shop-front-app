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
});
