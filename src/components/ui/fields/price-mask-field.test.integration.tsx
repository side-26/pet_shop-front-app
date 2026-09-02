import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { PriceMaskField } from './price-mask-field';
import { formatPriceMask, PriceMask, priceMaskVariants } from './price-mask';

type Values = { disabledPrice: number | null; price: number | null };

afterEach(cleanup);

describe('PriceMask', () => {
  it('groups digits from the right and accepts Persian and Arabic digits', () => {
    const onValueChange = vi.fn();
    render(<PriceMask aria-label="قیمت" onValueChange={onValueChange} />);

    const input = screen.getByLabelText('قیمت') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '۲۳۳۳۳۳۳' } });

    expect(input.value).toBe('2,333,333');
    expect(onValueChange).toHaveBeenLastCalledWith(2_333_333);
    expect(input.inputMode).toBe('numeric');
    expect(input.dir).toBe('ltr');
    expect(screen.getByText('ریال')).toBeTruthy();
    expect(document.querySelector('[data-slot="price-mask-postfix"] svg')).toBeTruthy();

    fireEvent.change(input, { target: { value: '٨٩٩٨٨' } });
    expect(input.value).toBe('89,988');
  });

  it('formats reusable controlled values and supports custom adornments', () => {
    render(
      <PriceMask
        aria-label="قیمت دلخواه"
        value={89_988}
        prefix="تومان"
        postfixIcon={<span>€</span>}
      />,
    );

    expect((screen.getByLabelText('قیمت دلخواه') as HTMLInputElement).value).toBe('89,988');
    expect(screen.getByText('€')).toBeTruthy();
    expect(screen.getByText('تومان')).toBeTruthy();
    expect(formatPriceMask(2_333_333)).toBe('2,333,333');
  });

  it('matches every base TextField input size', () => {
    const sizes = [
      ['xs', 'tw:h-7'],
      ['sm', 'tw:h-8'],
      ['md', 'tw:h-10'],
      ['lg', 'tw:h-11'],
      ['xl', 'tw:h-12'],
    ] as const;

    render(
      <>
        {sizes.map(([size]) => (
          <PriceMask key={size} aria-label={`قیمت ${size}`} size={size} value={1_250_000} />
        ))}
      </>,
    );

    for (const [size, heightClass] of sizes) {
      const input = screen.getByLabelText(`قیمت ${size}`);
      expect(input.getAttribute('data-size')).toBe(size);
      expect(input.className).toContain(heightClass);
    }
  });

  it('keeps the currency prefix typography smaller than its numeric input at every size', () => {
    expect(priceMaskVariants({ size: 'xs' }).prefix()).toContain('tw:text-[10px]');
    expect(priceMaskVariants({ size: 'sm' }).prefix()).toContain('tw:text-xs');
    expect(priceMaskVariants({ size: 'md' }).prefix()).toContain('tw:text-xs');
    expect(priceMaskVariants({ size: 'lg' }).prefix()).toContain('tw:text-label-s');
    expect(priceMaskVariants({ size: 'xl' }).prefix()).toContain('tw:text-label-m');
  });
});

describe('PriceMaskField', () => {
  it('submits an unformatted number through React Hook Form', async () => {
    const handleSubmit = vi.fn();
    render(
      <Form<Values>
        handleSubmit={handleSubmit}
        options={{ defaultValues: { disabledPrice: null, price: null } }}
      >
        <PriceMaskField<Values> name="price" label="قیمت محصول" hint="قیمت را وارد کنید." />
        <Button type="submit">ثبت</Button>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText('قیمت محصول'), {
      target: { value: '2,333,333' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith(
        { disabledPrice: null, price: 2_333_333 },
        expect.anything(),
      ),
    );
  });

  it('keeps accessible validation feedback and disabled state', async () => {
    render(
      <Form<Values>
        handleSubmit={() => undefined}
        options={{ defaultValues: { disabledPrice: null, price: null } }}
      >
        <PriceMaskField<Values>
          name="price"
          label="مبلغ"
          rules={{ required: 'وارد کردن مبلغ الزامی است.' }}
        />
        <PriceMaskField<Values> name="disabledPrice" label="مبلغ غیرفعال" disabled />
        <Button type="submit">ارسال</Button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'ارسال' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toBe('وارد کردن مبلغ الزامی است.');
    expect(screen.getByLabelText('مبلغ').getAttribute('aria-invalid')).toBe('true');
    expect((screen.getByLabelText('مبلغ غیرفعال') as HTMLInputElement).disabled).toBe(true);
  });
});
